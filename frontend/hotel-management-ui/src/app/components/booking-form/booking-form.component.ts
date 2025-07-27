import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Room, BookingData, RoomType } from '../../models/room';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  @Input() set room(value: Room) {
    this._room = value;
    this.initializeForm();
  }
  get room(): Room {
    return this._room;
  }
  private _room: Room = {
    id: 0,
    number: '',
    type: 'DOUBLE' as RoomType,
    price: 0,
    maxOccupancy: 2,
    isAvailable: true,
    hotel: {
      id: 0,
      name: ''
    }
  };
  
  @Output() bookingComplete = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<void>();
  
  bookingForm: FormGroup = new FormGroup({});
  isSubmitting = false;
  error: string | null = null;
  minDate: string = '';
  maxDate: string = '';
  
  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private datePipe: DatePipe
  ) {}

  // Removed duplicate ngOnInit

  initializeForm(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.bookingForm = this.fb.group({
      checkIn: [today.toISOString().split('T')[0], [Validators.required]],
      checkOut: [tomorrow.toISOString().split('T')[0], [Validators.required]],
      guestCount: [1, [Validators.required, Validators.min(1), Validators.max(this._room.maxOccupancy || 4)]],
      specialRequests: [''],
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required]]
    });

    this.minDate = today.toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // Set default check-out to 1 day after check-in
    this.bookingForm.get('checkIn')?.valueChanges.subscribe((checkIn: string) => {
      if (checkIn) {
        const checkOutControl = this.bookingForm.get('checkOut');
        if (checkOutControl?.value && new Date(checkOutControl.value) <= new Date(checkIn)) {
          const checkOutDate = new Date(checkIn);
          checkOutDate.setDate(checkOutDate.getDate() + 1);
          checkOutControl.setValue(checkOutDate.toISOString().split('T')[0]);
        }
      }
    });
    
    // Set max guest count based on room capacity
    if (this.room) {
      const guestCountControl = this.bookingForm.get('guestCount');
      if (guestCountControl) {
        guestCountControl.addValidators(Validators.max(this.room.maxOccupancy || 4));
        guestCountControl.updateValueAndValidity();
      }
    }
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || !this.room.id) {
      return;
    }
    
    this.isSubmitting = true;
    this.error = null;
    
    const formValue = this.bookingForm.value;
    const bookingData: BookingData = {
      roomId: this.room.id,
      customerName: formValue.customerName,
      customerEmail: formValue.customerEmail,
      checkIn: new Date(formValue.checkIn),
      checkOut: new Date(formValue.checkOut),
      guestCount: formValue.guestCount,
      specialRequests: formValue.specialRequests || undefined,
      status: 'PENDING'
    };
    
    // First check availability
    this.roomService.checkAvailability(
      this.room.id, 
      bookingData.checkIn, 
      bookingData.checkOut
    ).subscribe({
      next: (isAvailable: boolean) => {
        if (isAvailable) {
          // If available, proceed with booking
          this.roomService.bookRoom(bookingData).subscribe({
            next: () => {
              this.isSubmitting = false;
              this.bookingComplete.emit(true);
            },
            error: (err: any) => {
              console.error('Booking failed:', err);
              this.error = 'Failed to book room. Please try again.';
              this.isSubmitting = false;
            }
          });
        } else {
          this.error = 'Room is no longer available for the selected dates.';
          this.isSubmitting = false;
        }
      },
      error: (err: any) => {
        console.error('Availability check failed:', err);
        this.error = 'Failed to check room availability. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
  
  // Helper method to format dates for display
  formatDate(date: Date | string): string {
    return this.datePipe.transform(date, 'mediumDate') || '';
  }
}
