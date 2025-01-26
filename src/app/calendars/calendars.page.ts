import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Calendar } from '../models/Calendar';
import { CalendarService } from '../services/calendars.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-calendars',
  templateUrl: './calendars.page.html',
  styleUrls: ['./calendars.page.scss'],
  standalone: true,
  imports: [HttpClientModule, IonicModule, CommonModule, FormsModule, RouterModule],
  providers: [CalendarService, AuthService]
})
export class CalendarsPage implements OnInit {
  teamId: string = '';
  calendars: Calendar[] = [];
  newCalendar: { season: string; numMatchdays: number } = { season: '', numMatchdays: 0 };

  constructor(
    private calendarService: CalendarService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('teamId')!;
    this.loadCalendars();
  }

  // Carica tutti i calendari del team
  loadCalendars(): void {
    this.calendarService.getCalendarsByTeam(this.teamId).subscribe({
      next: (data) => (this.calendars = data),
      error: (err) => console.error(err),
    });
  }

  // Crea un nuovo calendario
  createCalendar(): void {
    if (!this.newCalendar.season || this.newCalendar.numMatchdays <= 0) {
      alert('Inserisci una stagione valida e un numero di giornate.');
      return;
    }

    this.calendarService
      .createCalendar(this.teamId, this.newCalendar.season, this.newCalendar.numMatchdays)
      .subscribe({
        next: (calendar) => {
          this.calendars.push(calendar);
          this.newCalendar = { season: '', numMatchdays: 0 };
        },
        error: (err) => console.error(err),
      });
  }

  // Elimina un calendario
  deleteCalendar(calendarId: string): void {
    this.calendarService.deleteCalendar(this.teamId, calendarId).subscribe({
      next: () => (this.calendars = this.calendars.filter((c) => c._id !== calendarId)),
      error: (err) => console.error(err),
    });
  }
}