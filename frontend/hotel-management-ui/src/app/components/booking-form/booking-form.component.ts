import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Room, BookingData, RoomType } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbDatepickerModule],
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
  serverError: string | null = null;
  minDate: NgbDateStruct = { year: 0, month: 0, day: 0 };
  maxDate: NgbDateStruct = { year: 0, month: 0, day: 0 };
  
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

    // Create NgbDateStruct objects
    const todayStruct: NgbDateStruct = {
      year: today.getFullYear(),
      month: today.getMonth() + 1, // NgbDateStruct months are 1-12
      day: today.getDate()
    };

    const tomorrowStruct: NgbDateStruct = {
      year: tomorrow.getFullYear(),
      month: tomorrow.getMonth() + 1,
      day: tomorrow.getDate()
    };

    this.bookingForm = this.fb.group({
      checkInDate: [todayStruct, [Validators.required]],
      checkOutDate: [tomorrowStruct, [Validators.required]],
      guestCount: [1, [Validators.required, Validators.min(1), Validators.max(this._room.maxOccupancy || 4)]],
      specialRequests: [''],
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]]
    });

    // Set min and max dates for datepicker
    this.minDate = todayStruct;
    
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    this.maxDate = {
      year: maxDate.getFullYear(),
      month: maxDate.getMonth() + 1,
      day: maxDate.getDate()
    };
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
      this.bookingForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    this.error = null;
    this.serverError = null;
    
    const formValue = this.bookingForm.value;
    
    // Convert NgbDateStruct to Date objects
    const checkInDate = new Date(formValue.checkInDate.year, formValue.checkInDate.month - 1, formValue.checkInDate.day);
    const checkOutDate = new Date(formValue.checkOutDate.year, formValue.checkOutDate.month - 1, formValue.checkOutDate.day);
    
    // Format dates for API
    const checkInStr = checkInDate.toISOString().split('T')[0];
    const checkOutStr = checkOutDate.toISOString().split('T')[0];
    
    const bookingData: BookingData = {
      roomId: this.room.id.toString(),
      customerName: formValue.customerName,
      customerEmail: formValue.customerEmail,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      guestCount: formValue.guestCount,
      specialRequests: formValue.specialRequests || undefined
    };
    
    // First check availability
    this.roomService.checkAvailability(
      this.room.id, 
      checkInDate, 
      checkOutDate
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
              this.serverError = 'Failed to book room. Please try again.';
              this.isSubmitting = false;
            }
          });
        } else {
          this.serverError = 'Room is no longer available for the selected dates.';
          this.isSubmitting = false;
        }
      },
      error: (err: any) => {
        console.error('Availability check failed:', err);
        this.serverError = 'Failed to check room availability. Please try again.';
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

  // Helper method to format price
  formatPrice(price: number | undefined): string {
    if (price === undefined) return '₹0';
    return `₹${price.toLocaleString('en-IN')}`;
  }

  // Calculate number of nights
  calculateNights(): number {
    const checkInDate = this.bookingForm.get('checkInDate')?.value;
    const checkOutDate = this.bookingForm.get('checkOutDate')?.value;
    
    if (!checkInDate || !checkOutDate) return 0;
    
    // Convert NgbDateStruct to Date objects
    const checkIn = new Date(checkInDate.year, checkInDate.month - 1, checkInDate.day);
    const checkOut = new Date(checkOutDate.year, checkOutDate.month - 1, checkOutDate.day);
    
    // Calculate difference in days
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  // Calculate total price
  calculateTotal(): number {
    const nights = this.calculateNights();
    return nights * (this.room.price || 0);
  }

  // Get max occupancy based on room type
  getMaxOccupancy(): number {
    return this.room.maxOccupancy || (
      this.room.type === 'SINGLE' ? 1 :
      this.room.type === 'DOUBLE' ? 2 :
      this.room.type === 'DELUXE' ? 2 : 4
    );
  }

  // Get minimum checkout date (must be after check-in)
  getMinCheckoutDate() {
    const checkInDate = this.bookingForm.get('checkInDate')?.value;
    if (!checkInDate) return this.minDate;
    
    // Return the day after check-in as minimum checkout date
    return {
      year: checkInDate.year,
      month: checkInDate.month,
      day: checkInDate.day + 1
    };
  }

  // Get maximum checkout date (1 year from now)
  getMaxCheckoutDate() {
    return this.maxDate;
  }

  // Getter for form controls
  get checkInDateControl() { return this.bookingForm.get('checkInDate')!; }
  get checkOutDateControl() { return this.bookingForm.get('checkOutDate')!; }
  get guestCountControl() { return this.bookingForm.get('guestCount')!; }
  get customerNameControl() { return this.bookingForm.get('customerName')!; }
  get customerEmailControl() { return this.bookingForm.get('customerEmail')!; }
  get specialRequestsControl() { return this.bookingForm.get('specialRequests')!; }
}
