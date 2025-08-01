import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

// Import types directly from the room model file using relative path
import { 
  Room, 
  RoomType, 
  RoomTypeInfo, 
  RoomFilter, 
  BookingData, 
  BookingResponse, 
  RoomAvailability 
} from 'src/app/models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = `${environment.apiUrl}/api/rooms`;
  
  // Room type configurations
  private roomTypeConfig: { [key in RoomType]: RoomTypeInfo } = {
    SINGLE: { 
      label: 'Single', 
      icon: 'single_bed',
      description: 'Perfect for solo travelers',
      defaultMaxOccupancy: 1
    },
    DOUBLE: { 
      label: 'Double', 
      icon: 'king_bed',
      description: 'Ideal for couples',
      defaultMaxOccupancy: 2
    },
    DELUXE: { 
      label: 'Deluxe', 
      icon: 'weekend',
      description: 'Spacious and comfortable',
      defaultMaxOccupancy: 2
    },
    SUITE: { 
      label: 'Suite', 
      icon: 'meeting_room',
      description: 'Luxury living with separate areas',
      defaultMaxOccupancy: 4
    }
  };

  // Common room amenities
  private commonAmenities = [
    'Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 
    'Safe', 'Hairdryer', 'Coffee Maker', 'Desk',
    'Room Service', 'Iron', 'Telephone', 'Bathrobe',
    'Slippers', 'Toiletries', 'Shower', 'Bathtub'
  ];

  constructor(private http: HttpClient) { }

  // Get rooms by hotel ID
  getRoomsByHotelId(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/hotel/${hotelId}`).pipe(
      map(rooms => rooms.map(room => this.enrichRoom(room))),
      catchError((error) => this.handleError<Room[]>(`getRoomsByHotelId id=${hotelId}`, [])(error))
    );
  }

  // Get all rooms with optional filtering
  getRooms(filters?: RoomFilter): Observable<Room[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.checkIn) params = params.set('checkIn', filters.checkIn.toISOString());
      if (filters.checkOut) params = params.set('checkOut', filters.checkOut.toISOString());
      if (filters.guests) params = params.set('guests', filters.guests.toString());
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.roomTypes?.length) params = params.set('roomTypes', filters.roomTypes.join(','));
      if (filters.amenities?.length) params = params.set('amenities', filters.amenities.join(','));
      if (filters.view) params = params.set('view', filters.view);
      if (filters.floor) params = params.set('floor', filters.floor.toString());
    }

    return this.http.get<Room[]>(this.apiUrl, { params }).pipe(
      map(rooms => rooms.map(room => this.enrichRoomData(room))),
      catchError((error) => this.handleError<Room[]>('getRooms', [])(error))
    );
  }

  // Get room by ID
  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`).pipe(
      map(room => this.enrichRoom(room)),
      catchError((error) => this.handleError<Room>(`getRoom id=${id}`)(error))
    );
  }

  // Check room availability
  checkAvailability(roomId: number, checkIn: Date, checkOut: Date): Observable<boolean> {
    const params = new HttpParams()
      .set('checkIn', checkIn.toISOString())
      .set('checkOut', checkOut.toISOString());

    return this.http.get<{ available: boolean }>(`${this.apiUrl}/${roomId}/availability`, { params })
      .pipe(
        map(response => response.available),
        catchError((error) => this.handleError<boolean>('checkAvailability', false)(error))
      );
  }

  // Check room availability with RoomAvailability response
  checkRoomAvailability(roomId: string, checkIn: string, checkOut: string): Observable<RoomAvailability> {
    const params = new HttpParams()
      .set('checkIn', checkIn)
      .set('checkOut', checkOut);

    return this.http.get<RoomAvailability>(`${this.apiUrl}/${roomId}/availability`, { params })
      .pipe(
        catchError((error) => this.handleError<RoomAvailability>('checkRoomAvailability', { roomId: Number(roomId), available: false })(error))
      );
  }

  // Book a room
  bookRoom(bookingData: BookingData): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/${bookingData.roomId}/book`, bookingData).pipe(
      catchError((error) => this.handleError<BookingResponse>('bookRoom')(error))
    );
  }

  // Create a new room
  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room).pipe(
      map(createdRoom => this.enrichRoom(createdRoom)),
      catchError((error) => this.handleError<Room>('createRoom')(error))
    );
  }

  // Update an existing room
  updateRoom(id: number, room: Partial<Room>): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room).pipe(
      map(updatedRoom => this.enrichRoom(updatedRoom)),
      catchError((error) => this.handleError<Room>('updateRoom')(error))
    );
  }

  // Delete a room
  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => this.handleError<void>('deleteRoom')(error))
    );
  }

  // Process and enrich rooms data
  processRooms(rooms: Room[]): Room[] {
    return rooms.map(room => this.enrichRoom(room));
  }

  // Enrich room data with additional properties (alias for enrichRoom for backward compatibility)
  enrichRoomData(room: Room): Room {
    return this.enrichRoom(room);
  }

  // Enrich room data with additional properties
  enrichRoom(room: Room): Room {
    const roomTypeConfig = this.roomTypeConfig[room.type] || this.roomTypeConfig['DOUBLE'];
    
    // Ensure all required Room properties are present
    const enrichedRoom: Room = {
      ...room,
      number: room.number || '',
      type: room.type || 'DOUBLE',
      price: room.price || 0,
      maxOccupancy: room.maxOccupancy || roomTypeConfig.defaultMaxOccupancy,
      isBooked: room.isBooked || false,
      isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
      amenities: room.amenities || [...this.commonAmenities],
      description: room.description || roomTypeConfig.description,
      // Ensure hotel object is properly structured
      hotel: room.hotel || { id: 0, name: '' }
    };
    
    return enrichedRoom;
  }
  
  // Get room type information
  getRoomType(type: RoomType | string): RoomTypeInfo {
    // Define valid room types
    const validRoomTypes: RoomType[] = ['SINGLE', 'DOUBLE', 'DELUXE', 'SUITE'];
    // If type is a valid RoomType, use it, otherwise default to 'DOUBLE'
    const roomType: RoomType = validRoomTypes.includes(type as RoomType) 
      ? type as RoomType 
      : 'DOUBLE';
    return this.roomTypeConfig[roomType] || this.roomTypeConfig['DOUBLE'];
  }

  // Error handling helper
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      let errorMessage = 'An error occurred';
      if (error instanceof HttpErrorResponse) {
        // Server-side error
        errorMessage = `Server returned code ${error.status}: ${error.statusText}`;
        if (error.error?.message) {
          errorMessage += ` - ${error.error.message}`;
        }
      } else if (error?.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Return an observable with a user-facing error message
      return throwError(() => new Error(errorMessage));
    };
  }
}
