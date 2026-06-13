import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = () => {

  const toastr = inject(ToastrService);
  const router = inject(Router);

  const token = localStorage.getItem('AUTH_TOKEN');

  if (!token) {
    toastr.warning('Du bist nicht eingeloggt', 'Warnung');
    router.navigateByUrl('/auth/login');
    return false;
  }

  // Token Payload auslesen
  const payload = JSON.parse(atob(token.split('.')[1]));

  // Prüfen ob Rolle admin vorhanden ist
  const roles = payload.roles || payload.role || [];

  if (Array.isArray(roles) && roles.includes('admin')) {
    return true;
  }

  toastr.warning('Du hast keine Berechtigungen', 'Warnung');
  router.navigateByUrl('/products');
  return false;
};
