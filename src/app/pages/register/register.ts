import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterDto, UserControllerService } from '../../openapi-client';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent implements OnInit {

  private fb = inject(FormBuilder);
  private userApi = inject(UserControllerService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        street: ['', Validators.required],
        zip: ['', Validators.required],
        city: ['', Validators.required],
        country: ['CH', Validators.required],
        phone: [''],
        mobilePhone: [''],
        email: ['', [Validators.required, Validators.email]],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
          ]
        ],

        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const pw = control.get('password')?.value;
    const cpw = control.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  submit(): void {
    if (!this.form || this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.errors?.['mismatch']) {
        this.toastr.error('Passwörter stimmen nicht überein');
      }
      return;
    }

    const v = this.form.getRawValue();

    const dto: RegisterDto = {
      firstName: v.firstName?.trim(),
      lastName: v.lastName?.trim(),
      street: v.street?.trim(),
      zip: v.zip,
      city: v.city?.trim(),
      country: v.country,
      phone: v.phone?.trim() || null,
      mobilePhone: v.mobilePhone?.trim() || null,
      email: v.email?.trim().toLowerCase(),
      password: v.password
    };

    this.userApi.registerWithoutAdminRights(dto).subscribe({
      next: () => {
        this.toastr.success('Registrierung erfolgreich', 'Erfolg');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.toastr.error('Registrierung fehlgeschlagen', 'Fehler');
      }
    });
  }
}
