import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamsService } from '../services/teams.service';
import { AuthService } from '../services/auth.service';
import { Team } from '../models/Team';
import { Player } from '../models/Player';
import { IonHeader, IonContent, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton} from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-team-detail',
  templateUrl: './team-details.page.html',
  styleUrls: ['./team-details.page.scss'],
  standalone: true,
  imports: [ FormsModule, CommonModule, IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonTitle, IonToolbar, IonContent, IonHeader, HttpClientModule],
  providers: [TeamsService, AuthService],
})
export class TeamDetailsPage implements OnInit {
  team: Team | null = null;
  players: Player[] = [];  // Variabile per memorizzare i giocatori

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamsService: TeamsService,
  ) {}

  ngOnInit() {
    const teamId = this.route.snapshot.paramMap.get('teamId');
    if (teamId) {
        this.teamsService.getTeamById(teamId).subscribe({
            next: (team) => {
                this.team = team;  // Ottieni la squadra
                this.players = team.players;  // Ottieni i giocatori associati
            },
            error: (err) => console.error('Errore caricamento team:', err),
        });
    }
  }

  navigateToCalendars() {
    this.router.navigate(['teams', this.team!._id, 'calendars']);
  }

  navigateToPlayers() {
    this.router.navigate(['teams', this.team!._id, 'players']);
  }
}
