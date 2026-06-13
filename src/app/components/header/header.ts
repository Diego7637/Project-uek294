import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAdmin = false;

  private intervalId: any;

  ngOnInit(): void {
    this.checkAdmin();

    this.intervalId = setInterval(() => {
      this.checkAdmin();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private checkAdmin(): void {

    const token = localStorage.getItem('AUTH_TOKEN');

    if (!token) {
      this.isAdmin = false;
      return;
    }

    try {

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      const roles: string[] = payload.roles ?? [];

      this.isAdmin = roles.some(
        role => role.toLowerCase() === 'admin'
      );

      console.log('PAYLOAD:', payload);
      console.log('ROLES:', roles);
      console.log('IS ADMIN:', this.isAdmin);

    } catch (error) {

      console.error('JWT ERROR:', error);

      this.isAdmin = false;
    }
  }
}
