import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  selectedHotelId: number | null = null;
  isLoading = true;
  error: string | null = null;
  searchControl = new FormControl('');
  ratingFilter = new FormControl('');
  
  // Track expanded state for each hotel
  expandedHotels: { [key: number]: boolean } = {};

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
        this.filteredHotels = [...this.hotels];
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load hotels. Please try again later.';
        this.isLoading = false;
      }
    });

    // Subscribe to search input changes
    this.searchControl.valueChanges.subscribe(() => this.filterHotels());
    this.ratingFilter.valueChanges.subscribe(() => this.filterHotels());
  }

  // Convert numeric rating to star symbols
  getStarRating(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return fullStars + (hasHalfStar ? '½' : '') + emptyStars;
  }

  // Toggle rooms visibility for a hotel
  toggleRooms(hotelId: number): void {
    if (this.selectedHotelId === hotelId) {
      // If clicking the same hotel, close it
      this.selectedHotelId = null;
    } else {
      // Otherwise, show rooms for the selected hotel
      this.selectedHotelId = hotelId;
    }
  }

  // Handle hotel deletion
  deleteHotel(id: number): void {
    if (!confirm('Are you sure you want to delete this hotel? This will also remove all associated rooms and bookings.')) {
      return;
    }

    this.hotelService.deleteHotel(id).subscribe({
      next: () => {
        // Remove the hotel from the local array
        this.hotels = this.hotels.filter(h => h.id !== id);
        this.filteredHotels = this.filteredHotels.filter(h => h.id !== id);
        
        // If the deleted hotel was selected, clear the selection
        if (this.selectedHotelId === id) {
          this.selectedHotelId = null;
        }
      },
      error: (err) => {
        this.error = 'Failed to delete hotel. Please try again.';
        console.error('Error deleting hotel:', err);
      }
    });
  }

  // Filter hotels based on search term and rating
  filterHotels(event?: Event | string): void {
    let searchTerm = '';
    
    if (typeof event === 'string') {
      searchTerm = event.toLowerCase();
    } else if (event && event.target) {
      // Handle DOM event
      searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    } else {
      // Get current value from form control
      searchTerm = this.searchControl.value?.toLowerCase() || '';
    }
    
    const minRating = parseFloat(this.ratingFilter.value || '0');

    this.filteredHotels = this.hotels.filter(hotel => {
      const matchesSearch = 
        hotel.name.toLowerCase().includes(searchTerm) ||
        (hotel.location?.toLowerCase() || '').includes(searchTerm) ||
        (hotel.amenities?.some((amenity: string) => amenity.toLowerCase().includes(searchTerm)) || false);
      
      const matchesRating = hotel.rating >= minRating;
      
      return matchesSearch && matchesRating;
    });
  }

  // Handle rating filter change (for template binding)
  filterByRating(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.ratingFilter.setValue(selectElement.value, { emitEvent: true });
  }


}
