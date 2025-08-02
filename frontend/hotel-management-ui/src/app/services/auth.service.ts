import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:8080/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) {
    // Check if user is stored in localStorage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // For demo purposes, we'll simulate authentication without a backend
  // In a real app, you would connect to a backend API
  login(email: string, password: string): Observable<User> {
    // Simulate API call
    // In a real app, replace this with an actual HTTP request
    if (email === 'demo@example.com' && password === 'password') {
      const user: User = {
        id: 1,
        username: 'Demo User',
        email: email,
        token: 'fake-jwt-token'
      };
      
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user);
    } else {
      return throwError(() => new Error('Invalid email or password'));
    }
  }

  signup(name: string, email: string, password: string): Observable<User> {
    // Simulate API call
    // In a real app, replace this with an actual HTTP request
    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 1, // Generate random ID for demo
      username: name,
      email: email,
      token: 'fake-jwt-token'
    };
    
    // Store user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);
    return of(newUser);
  }

  logout(): void {
    // Remove user from localStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}
