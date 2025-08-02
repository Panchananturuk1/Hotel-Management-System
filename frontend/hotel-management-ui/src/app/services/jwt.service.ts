import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }
  
  /**
   * Parse JWT token and extract payload
   * @param token JWT token string
   * @returns Decoded token payload or null if invalid
   */
  parseToken(token: string): any {
    if (!token) {
      return null;
    }
    
    try {
      // Get the payload part of the JWT (second part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  }
  
  /**
   * Check if token is expired
   * @param token JWT token string
   * @returns boolean indicating if token is expired
   */
  isTokenExpired(token: string): boolean {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    
    // exp is in seconds, Date.now() is in milliseconds
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate < new Date();
  }
}