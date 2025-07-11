import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.isLoading = true;
    this.error = null;
    
    this.hotelService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load hotels. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  deleteHotel(id: number): void {
    if (!confirm('Are you sure you want to delete this hotel?')) {
      return;
    }

    this.hotelService.deleteHotel(id).subscribe({
      next: () => {
        this.loadHotels();
      },
      error: () => {
        this.error = 'Failed to delete hotel. Please try again.';
      }
    });
  }
}
