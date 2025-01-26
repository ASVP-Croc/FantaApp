import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchdayService } from '../services/matchdays.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-matchday-user',
  templateUrl: './matchday-user.page.html',
  styleUrls: ['./matchday-user.page.scss'],
  standalone: true,
  imports: [IonButton, HttpClientModule, IonLabel, IonItem, IonList, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonSpinner, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
  providers: [MatchdayService, AuthService, TeamsService]
})
export class MatchdayUserPage implements OnInit {
  teamId: string | null = null;
  teamName: string | null = null;
  matchdayId: string | null = null;
  matchdayDetails: any;

  constructor(
    private route: ActivatedRoute,
    private matchdayService: MatchdayService,
    private teamService : TeamsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('teamId');
    this.matchdayId = this.route.snapshot.paramMap.get('matchdayId');
    if (this.matchdayId && this.teamId) {
      this.loadMatchdayDetails(this.teamId, this.matchdayId);
    };
    if(this.teamId){
      this.loadTeamName(this.teamId);
    }
  }

  loadTeamName(teamId: string){
    this.teamService.getTeamById(teamId).subscribe({
      next: (data) => {
        this.teamName = data.name;
      },
      error: (error) => {
        console.error('Errore nel caricamento del nome della squadra', error);
      },
    })
  }

  loadMatchdayDetails(teamId: string, matchdayId: string) {
    this.matchdayService.getMatchdayDetails(teamId, matchdayId).subscribe({
      next: (data) => {
        this.matchdayDetails = data;
      },
      error: (error) => {
        console.error('Errore nel caricamento dei dettagli del matchday', error);
      },
    });
  }

  navigateToFormationCreation() {
    if (this.matchdayDetails && this.matchdayId) {
      this.router.navigate(['matchdays/:teamId/:matchdayId/formations', {
        teamId: this.teamId,
        matchdayId: this.matchdayId,
      }]);
    }
  }
}
