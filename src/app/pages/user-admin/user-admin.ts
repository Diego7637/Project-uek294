import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  UserControllerService,
  UserShowDto
} from '../../openapi-client';

@Component({
  selector: 'pm-user-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-admin.html',
  styleUrl: './user-admin.scss'
})
export class UserAdmin {

  private userService = inject(UserControllerService);

  users: UserShowDto[] = [];

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  promote(user: UserShowDto): void {

    if (!user.id) {
      return;
    }

    this.userService.promoteUser(user.id).subscribe({
      next: () => {
        user.isAdmin = true;
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
