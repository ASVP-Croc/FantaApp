import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-matchdays',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, HttpClientModule],
  providers: [UserService, AuthService]
})
export class Tab3Page implements OnInit {
  matchdays: any[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    // Ottieni l'userId dall'URL o dal token
    let userId = this.route.snapshot.paramMap.get('userId');
    if (!userId) {
      userId = this.authService.getUserIdFromToken();
    }

    if (userId) {
      this.loadMatchdays(userId);
    } else {
      console.error('User ID non trovato.');
    }
  }

  loadMatchdays(userId: string) {
    this.userService.getCurrentWeekMatchdays(userId).subscribe({
      next: (data) => {
        this.matchdays = data;
      },
      error: (error) => {
        console.error('Errore nel caricamento dei matchdays', error);
      },
    });
  }

  goToMatchdayDetail(matchday: any) {
    if (!matchday.matchday._id && !matchday.teamId) {
      console.error('Errore: matchdayId mancante!', matchday.matchday._id);
      console.error('Errore: teamId mancante!', matchday.teamId);
      return;
    }
    this.router.navigate(['/matchdays', matchday.teamId, matchday.matchday._id]);
  }
}
