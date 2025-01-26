import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchdayService } from '../services/matchdays.service';
import { Matchday } from '../models/Matchday';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-matchdays',
  templateUrl: './matchdays.page.html',
  styleUrls: ['./matchdays.page.scss'],
  standalone: true,
  imports: [ HttpClientModule, IonLabel, IonItem, IonList, IonToolbar, IonHeader,  IonTitle, IonContent, CommonModule, FormsModule ],
  providers: [MatchdayService, AuthService],
})
export class MatchdaysPage implements OnInit {
  teamId: string = '';
  calendarId: string = '';
  matchdays: Matchday[] = [];

  constructor(
    private route: ActivatedRoute,
    private matchdayService: MatchdayService,
    private router: Router
  ) {}

  ngOnInit() {
    // Recupera il teamId e il calendarId dalla rotta
    this.teamId = this.route.snapshot.paramMap.get('teamId')!;
    this.calendarId = this.route.snapshot.paramMap.get('calendarId')!;

    // Recupera i matchdays associati al calendario
    this.loadMatchdays();
  }

  // Carica i matchdays del calendario specifico
  loadMatchdays(): void {
    this.matchdayService.getMatchdays(this.teamId, this.calendarId).subscribe({
      next: (data) => {
        this.matchdays = data;
      },
      error: (err) => {
        console.error('Errore nel recuperare i matchdays:', err);
      }
    });
  }

  // Naviga al dettaglio di un singolo matchday
  viewMatchdayDetails(matchdayId: string): void {
    this.router.navigate([`/teams/${this.teamId}/calendars/${this.calendarId}/matchdays/${matchdayId}`]);
  }
}

