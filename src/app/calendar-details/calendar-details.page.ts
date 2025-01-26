import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarService } from '../services/calendars.service';
import { Calendar } from '../models/Calendar';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonList, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-details.page.html',
  styleUrls: ['./calendar-details.page.scss'],
  standalone: true,
  imports: [HttpClientModule, IonToolbar, IonHeader,  IonTitle, IonContent, CommonModule, FormsModule, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent ],
  providers: [CalendarService, AuthService]
})
export class CalendarDetailsPage implements OnInit {
  teamId: string = '';
  calendarId: string = '';
  calendar: Calendar | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private calendarService: CalendarService
  ) {}

  ngOnInit() {
    // Recupera il teamId e il calendarId dalla rotta
    this.teamId = this.route.snapshot.paramMap.get('teamId')!;
    this.calendarId = this.route.snapshot.paramMap.get('calendarId')!;

    // Carica i dettagli del calendario specificato
    this.loadCalendarDetails();
  }

  // Carica i dettagli del calendario selezionato
  loadCalendarDetails(): void {
    this.calendarService.getCalendarById(this.teamId, this.calendarId).subscribe({
      next: (data) => {
        this.calendar = data;
      },
      error: (err) => console.error('Errore nel recuperare il calendario:', err),
    });
  }

  // Naviga alla pagina dei matchdays del calendario
  navigateToMatchdays() {
    this.router.navigate(['teams', this.teamId, 'calendars', this.calendarId, 'matchdays']);
  }
}
