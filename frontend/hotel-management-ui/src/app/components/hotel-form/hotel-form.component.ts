import { Component, EventEmitter, Output } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel';

@Component({
  selector: 'app-hotel-form',
  templateUrl: './hotel-form.component.html',
  styleUrls: ['./hotel-form.component.css']
})
export class HotelFormComponent {
  hotel: Hotel = { name: '', location: '' };
  @Output() refresh = new EventEmitter<void>();

  constructor(private hotelService: HotelService) {}

  submit(): void {
    this.hotelService.createHotel(this.hotel).subscribe(() => {
      this.hotel = { name: '', location: '' };
      this.refresh.emit();
    });
  }
}
