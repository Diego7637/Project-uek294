import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserControllerService, LoginRequestDto } from '../../openapi-client';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  fb = inject(FormBuilder);
  userApi = inject(UserControllerService);
  toastr: ToastrService = inject(ToastrService);
  router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit(): void {

    const dto: LoginRequestDto = {
      email: this.form.value.email!,
      password: this.form.value.password!
    };
    //async
    this.userApi.login(dto).subscribe({
      next: (res) => {

        console.log('Login Response:', res);

        const token = res.token ?? null;

        if (!token) {
          this.toastr.error('Kein Token erhalten', 'Fehler');
          return;
        }

        localStorage.setItem('AUTH_TOKEN', token);

        this.toastr.success('Login erfolgreich', 'Erfolg');
        this.router.navigate(['/']);
      },

      error: (err: any) => {
        console.error('FULL ERROR:', err);
        console.error('ERROR BODY:', err.error);
        console.error('STATUS:', err.status);

        this.toastr.error('Login fehlgeschlagen', 'Fehler');
      }
    });
  }
}
