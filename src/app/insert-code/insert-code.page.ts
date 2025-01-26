import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonInput, IonItem, IonLabel, IonText } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-insert-code',
  templateUrl: './insert-code.page.html',
  styleUrls: ['./insert-code.page.scss'],
  standalone: true,
  imports: [IonText, CommonModule, FormsModule, HttpClientModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonInput, IonItem, IonLabel],
  providers: [UserService, AuthService],
})
export class InsertCodePage {
  inviteCode: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  joinTeam() {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.errorMessage = 'Errore: Utente non autenticato.';
      return;
    }

    this.userService.joinTeam(userId, this.inviteCode).subscribe({
      next: () => {
        this.successMessage = 'Iscrizione completata con successo!';
        this.errorMessage = '';
        this.router.navigate(['/teams']);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Errore durante l\'iscrizione alla squadra.';
        this.successMessage = '';
      },
    });
  }
}