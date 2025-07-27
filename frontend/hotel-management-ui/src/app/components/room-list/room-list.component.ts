import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Room, RoomType } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookingFormComponent],
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  @Input() hotelId: number = 0;
  @Input() hotelName: string = '';
  
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm = '';
  selectedType: RoomType | '' = '';
  selectedRoom: Room | null = null;
  
  // Room types for filter
  roomTypes = [
    { value: '', label: 'All Types' },
    { value: 'SINGLE' as RoomType, label: 'Single' },
    { value: 'DOUBLE', label: 'Double' },
    { value: 'DELUXE', label: 'Deluxe' },
    { value: 'SUITE', label: 'Suite' }
  ];

  constructor(
    private roomService: RoomService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoading = true;
    this.error = null;
    
    this.roomService.getRoomsByHotelId(this.hotelId).subscribe({
      next: (rooms: Room[]) => {
        this.rooms = rooms;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load rooms. Please try again later.';
        this.isLoading = false;
        console.error('Error loading rooms:', err);
      }
    });
  }

  applyFilters() {
    if (!this.rooms) return;
    
    this.filteredRooms = this.rooms.filter(room => {
      // Filter by search term
      const searchTerm = this.searchTerm.toLowerCase();
      const matchesSearch = !this.searchTerm || 
        room.number.toLowerCase().includes(searchTerm) ||
        room.type.toLowerCase().includes(searchTerm);
      
      // Filter by room type
      const matchesType = !this.selectedType || room.type === this.selectedType;
      
      return matchesSearch && matchesType;
    });
  }

  onSearchChange(searchValue: string): void {
    this.searchTerm = searchValue;
    this.applyFilters();
  }

  onTypeChange(type: string): void {
    this.selectedType = type as RoomType | '';
    this.applyFilters();
  }

  // Open booking modal
  openBookingModal(room: Room): void {
    this.selectedRoom = room;
    const modalRef = this.modalService.open(BookingFormComponent, { 
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
    
    // Pass room data to the booking form
    modalRef.componentInstance.room = { ...room };
    
    // Handle booking completion
    modalRef.componentInstance.bookingComplete.subscribe((success: boolean) => {
      if (success) {
        // Refresh rooms list after successful booking
        this.loadRooms();
        modalRef.close();
      }
    });
    
    // Handle modal dismissal
    modalRef.componentInstance.cancel.subscribe(() => {
      modalRef.dismiss();
    });
  }

  // Format price with currency
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
  
  // Get room type icon
  getRoomTypeIcon(type: RoomType | string): string {
    const roomType = this.roomService.getRoomType(type);
    return roomType?.icon || 'hotel';
  }
  
  // Get room type label
  getRoomTypeLabel(type: RoomType | string): string {
    const roomType = this.roomService.getRoomType(type);
    return roomType?.label || String(type);
  }

  // View room details
  viewRoomDetails(room: Room): void {
    this.selectedRoom = room;
    // You can implement a modal or navigation to show room details
    console.log('Viewing room details:', room);
  }

  // Book a room
  bookRoom(room: Room): void {
    this.openBookingModal(room);
  }

  // Get hotel location (mock implementation - replace with actual implementation)
  getHotelLocation(): string {
    // This is a mock implementation
    // In a real app, you would get this from a service or input property
    return 'New Delhi, India';
  }
}
