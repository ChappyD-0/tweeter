import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

interface SignupModel {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {
  // Modelo vinculado al formulario
  model: SignupModel = {
    username: '',
    email: '',
    password: ''
  };

  // Mensajes para mostrar al usuario
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  /** Se ejecuta al enviar el formulario */
  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage   = '';

    this.userService.postSignup(this.model).subscribe(
      () => {
        this.successMessage = '¡Cuenta creada con éxito! Ahora inicia sesión.';
        // Redirige al login
        this.router.navigate(['/login']);
      },
      (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Error al crear la cuenta.';
      }
    );
  }
}
