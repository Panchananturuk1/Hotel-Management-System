import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hotel-management-ui';
  
  constructor(public authService: AuthService, private router: Router) {}
  
  ngOnInit() {
    // Check if user is already logged in from previous session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Use the public method instead of accessing private property
        this.authService.setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
