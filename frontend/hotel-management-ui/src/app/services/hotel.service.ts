import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hotel } from '../models/hotel';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  // Update this URL to your EC2 public IP and port
  private baseUrl = 'http://localhost:8081/api/hotels';
  
  // Subject for hotel list refresh
  private refreshHotelsSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.baseUrl);
  }

  getHotel(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.baseUrl}/${id}`);
  }

  createHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.post<Hotel>(this.baseUrl, hotel);
  }

  updateHotel(id: number, hotel: Hotel): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.baseUrl}/${id}`, hotel);
  }

  deleteHotel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Method to trigger a refresh of the hotel list
  refreshHotels(): void {
    this.refreshHotelsSubject.next();
  }

  // Observable that components can subscribe to for refresh events
  get refreshNeeded$(): Observable<void> {
    return this.refreshHotelsSubject.asObservable();
  }
}
