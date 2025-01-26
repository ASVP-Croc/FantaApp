import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonNote } from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, IonNote, IonLabel, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent],
  providers: [UserService, AuthService]
})
export class Tab4Page implements OnInit {
  teams: any[] = [];
  leaderboard: any[] | null = null;
  selectedTeam: any = null;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.userService.getUserDetails(userId).subscribe({
        next: (data) => {
          this.teams = data.teamsJoined.map((t: any) => t.team);
        },
        error: (err) => {
          console.error('Errore nel caricamento delle squadre:', err);
        },
      });
    }
  }

  viewLeaderboard(team: any): void {
    this.selectedTeam = team;
    this.userService.getTeamLeaderboard(team._id).subscribe({
      next: (data) => {
        this.leaderboard = data;
      },
      error: (err) => {
        console.error('Errore nel caricamento della classifica:', err);
      },
    });
  }
}

