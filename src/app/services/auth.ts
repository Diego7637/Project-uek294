import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  decodeToken(token: string) {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  getRoles(): string[] {
    const token = localStorage.getItem('token');
    if (!token) return [];

    const payload = this.decodeToken(token);
    return payload?.roles ?? [];
  }

  isAdmin(): boolean {
    return this.getRoles().includes('admin');
  }

}
