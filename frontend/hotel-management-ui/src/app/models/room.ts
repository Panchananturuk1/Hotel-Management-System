// Room type literals
export type RoomType = 'SINGLE' | 'DOUBLE' | 'DELUXE' | 'SUITE';

// Room type information for UI display
export interface RoomTypeInfo {
  label: string;
  icon: string;
  description: string;
  defaultMaxOccupancy: number;
}

// Room interface
export interface Room {
  id?: number;
  number: string;
  type: RoomType;
  price: number;
  hotel?: {
    id: number;
    name: string;
    location?: string;
  };
  isBooked?: boolean;
  isAvailable?: boolean;
  maxOccupancy?: number;
  amenities?: string[];
  description?: string;
  size?: number; // in square feet
  view?: string; // e.g., 'Sea View', 'Garden View', 'City View'
  floor?: number;
  bedType?: string; // e.g., 'King', 'Queen', 'Twin'
  images?: string[]; // URLs to room images
  createdAt?: Date;
  updatedAt?: Date;
}

// Room filter criteria
export interface RoomFilter {
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  roomTypes?: RoomType[];
  amenities?: string[];
  view?: string;
  floor?: number;
}

// Booking data
export interface BookingData {
  roomId: number;
  customerName: string;
  customerEmail: string;
  checkIn: Date;
  checkOut: Date;
  specialRequests?: string;
  guestCount: number;
  totalPrice?: number;
  bookingDate?: Date;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN' | 'CHECKED_OUT';
}

// Booking response
export interface BookingResponse {
  id: number;
  bookingNumber: string;
  room: Room;
  customerName: string;
  customerEmail: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Room availability response
export interface RoomAvailability {
  roomId: number;
  available: boolean;
  message?: string;
  conflictingBookings?: {
    checkIn: Date;
    checkOut: Date;
  }[];
}
