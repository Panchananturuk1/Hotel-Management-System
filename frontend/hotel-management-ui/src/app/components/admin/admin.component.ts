import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
  }

  // Method to handle hotel form refresh event
  loadHotels(): void {
    // This will trigger a refresh in the hotel list component
    this.hotelService.refreshHotels();
  }
}
