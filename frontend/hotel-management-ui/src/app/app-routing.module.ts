import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/hotels', pathMatch: 'full' },
  { path: 'hotels', component: HotelListComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'bookings', component: BookingFormComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '/hotels' } // Redirect to hotels for any unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }