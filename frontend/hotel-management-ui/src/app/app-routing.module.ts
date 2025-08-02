import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/hotels', pathMatch: 'full' },
  { path: 'hotels', component: HotelListComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'bookings', component: BookingFormComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '/hotels' } // Redirect to hotels for any unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }