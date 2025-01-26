import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonInput, IonText } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [ HttpClientModule, CommonModule, IonText, FormsModule, IonInput, IonLabel, IonItem, IonList, IonButton, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonContent, IonHeader, IonToolbar, IonTitle],
  providers: [AuthService, UserService]
})

export class Tab1Page {
  showLoginForm = false;
  showRegisterForm = false;
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  };
  errorMessage = '';
  welcomeMessage = '';
  isAuthenticated = false;
  username: string | null = null;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  toggleLoginForm() {
    this.resetForm();
    this.showRegisterForm = false;
    this.showLoginForm = !this.showLoginForm;
  }

  toggleRegisterForm() {
    this.resetForm();
    this.showLoginForm = false;
    this.showRegisterForm = !this.showRegisterForm;
  }

  login() {
    this.authService
      .login({ email: this.formData.email, password: this.formData.password })
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.accessToken);
          this.userService.getUserDetails(this.authService.getUserIdFromToken()!).subscribe({
            next: (userDetails) => {
              this.username = userDetails.username;
              this.isAuthenticated = true;
              this.welcomeMessage = `Benvenuto, ${this.username}!`;
              this.showLoginForm = false;
              this.router.navigate(['/']);
            },
            error: (err) => {
              this.errorMessage = err.error?.message || 'Errore nel recupero dei dettagli dell\'utente.';
            }
          });
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Errore durante il login.';
        },
      });
  }

  register() {
    this.authService.register(this.formData).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.userService.getUserDetails(this.authService.getUserIdFromToken()!).subscribe({
          next: (userDetails) => {
            this.username = userDetails.username;
            this.isAuthenticated = true;
            this.welcomeMessage = `Registrazione completata! Benvenuto, ${this.username}!`;
            this.showRegisterForm = false;
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.errorMessage =
              err.error?.message || 'Errore nel recupero dei dettagli dell\'utente.';
          }
        });
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Errore durante la registrazione.';
      },
    });
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.welcomeMessage = '';
    this.router.navigate(['/']);
  }

  resetForm() {
    this.errorMessage = '';
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
    };
  }


  navigateToCreateTeam() {
    this.router.navigate(['/teams']);
  }

  // Naviga alla pagina per inserire il codice
  navigateToJoinTeam() {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.router.navigate([`/users/${userId}/joinTeam`]);
    } else {
      this.errorMessage = 'Errore: Utente non autenticato.';
    }
  }
}