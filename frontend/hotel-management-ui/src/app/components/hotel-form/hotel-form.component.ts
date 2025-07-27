import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel';

@Component({
  selector: 'app-hotel-form',
  templateUrl: './hotel-form.component.html',
  styleUrls: ['./hotel-form.component.css']
})
export class HotelFormComponent {
  hotel: Hotel = { name: '', location: '', rating: 0 };
  hoverRating = 0;
  @Output() refresh = new EventEmitter<void>();
  isSubmitting = false;
  error: string | null = null;

  constructor(private hotelService: HotelService) {}

  setRating(rating: number): void {
    this.hotel.rating = rating;
  }

  submit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.error = null;
    
    this.hotelService.createHotel(this.hotel).subscribe({
      next: () => {
        this.hotel = { name: '', location: '', rating: 0 };
        this.refresh.emit();
      },
      error: (err) => {
        this.error = 'Failed to create hotel. Please try again.';
        if (err.error?.message) {
          this.error = err.error.message;
        }
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
