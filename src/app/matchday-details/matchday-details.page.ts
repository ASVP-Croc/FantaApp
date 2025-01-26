import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchdayService } from '../services/matchdays.service';
import { Matchday } from '../models/Matchday';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonDatetime, IonLabel} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-matchday-detail',
  templateUrl: './matchday-details.page.html',
  styleUrls: ['./matchday-details.page.scss'],
  standalone: true,
  imports: [RouterModule, IonLabel, IonDatetime, HttpClientModule, IonButton, IonList, IonToolbar, IonHeader,  IonTitle, IonItem, IonContent, CommonModule, FormsModule ],
  providers: [MatchdayService, AuthService],
})
export class MatchdayDetailsPage implements OnInit {
  teamId!: string;
  calendarId!: string;
  matchdayId!: string;
  matchday!: Matchday | null;
  updatedDate!: string;
  showDatePicker = false; // Controlla la visibilità del calendario

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchdayService: MatchdayService
  ) {}

  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('teamId')!;
    this.calendarId = this.route.snapshot.paramMap.get('calendarId')!;
    this.matchdayId = this.route.snapshot.paramMap.get('matchdayId')!;
    this.fetchMatchday(); // Qui mantieni solo la logica per caricare i dettagli del matchday
  }

  fetchMatchday() {
    this.matchdayService
      .getMatchdayById(this.teamId, this.calendarId, this.matchdayId)
      .subscribe((matchday) => {
        this.matchday = matchday;
        this.updatedDate = matchday.date.toString();
      });
  }

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker; // Alterna la visibilità
  }

  onDateChange(event: any) {
    this.updatedDate = event.detail.value;
  }

  updateMatchday() {
    if (!this.updatedDate) {
      alert('Please select a valid date');
      return;
    }

    const updatedData = { date: new Date(this.updatedDate) };

    this.matchdayService
      .updateMatchday(this.teamId, this.calendarId, this.matchdayId, updatedData)
      .subscribe(() => {
        alert('Matchday updated successfully!');
        this.showDatePicker = false; // Nascondi il calendario dopo il salvataggio
        this.fetchMatchday(); // Aggiorna i dettagli del matchday
      });
  }

  // Naviga alla pagina della formazione senza chiamare GET
  goToFormation(): void {
    this.router.navigate([`/teams/${this.teamId}/calendars/${this.calendarId}/matchdays/${this.matchdayId}/formation`]);
  }
}