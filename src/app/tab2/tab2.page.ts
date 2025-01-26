import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonList, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonToast } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamsService } from '../services/teams.service';
import { AuthService } from '../services/auth.service';
import { Team } from '../models/Team';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-teams',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [ HttpClientModule, IonInput, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, CommonModule, RouterModule],
  providers: [TeamsService, AuthService],
})
export class Tab2Page implements OnInit {
  teams: Team[] = [];
  selectedTeam: Team | null = null;
  newTeam: Team = { name: '', coach: '', _id: '', players: [], calendar: [],createdBy: '', inviteCode: ''};
  showCreationForm = false;
  userTeams: Team[] = [];
  joinedTeams: Team[] = [];
  showToastMessage = false;
  inviteCode: string = '';
  showJoinForm = false;  // Variabile per gestire la visibilità del form "Unisciti a una squadra"
  editingTeamId: string | null = null; // Memorizza l'ID della squadra in modifica
  editingTeam: Partial<Team> | null = null; // Memorizza i dati della squadra in modifica

  constructor(private teamsService: TeamsService, private router: Router) {}

  ngOnInit() {
    this.loadUserTeams();  // Carica le squadre dell'utente al caricamento della pagina
  }

  loadUserTeams(): void {
    this.teamsService.getUserTeams().subscribe({
        next: (data) => {
            this.userTeams = data.createdTeams;   // Squadre create dall'utente
            this.joinedTeams = data.joinedTeams;  // Squadre a cui l'utente è iscritto
        },
        error: (err) => console.error('Errore durante il recupero delle squadre:', err),
    });
}

  // Crea una nuova squadra
  createNewTeam() {
    const teamData = { name: this.newTeam.name, coach: this.newTeam.coach };
  
    this.teamsService.createTeam(teamData).subscribe({
      next: (createdTeam) => {
        this.userTeams.push(createdTeam); // Aggiungi la nuova squadra alla lista
        this.newTeam = { _id: '', name: '', coach: '', players: [], calendar: [], createdBy: '', inviteCode: '' };
        this.showCreationForm = false;
        this.showToastMessage = true;
        this.inviteCode = createdTeam.inviteCode; // Mostra il codice di invito generato
      },
      error: (err) => {
        console.error('Errore durante la creazione della squadra:', err);
      },
    });
  }

   // Modifica una squadra
   editTeam(team: Team): void {
    this.editingTeam = { ...team }; // Clona l'oggetto per evitare modifiche dirette
  }

  // Salva le modifiche
  updateTeam(): void {
    if (this.editingTeam && this.editingTeam._id) {
      const updatedData = {
        name: this.editingTeam.name,
        coach: this.editingTeam.coach,
      };

      this.teamsService.updateTeam(this.editingTeam._id, updatedData).subscribe({
        next: (updatedTeam) => {
          const index = this.userTeams.findIndex((t) => t._id === updatedTeam._id);
          if (index !== -1) {
            this.userTeams[index] = updatedTeam; // Aggiorna la lista locale
          }
          this.editingTeam = null; // Resetta i dati in modifica
        },
        error: (err) => console.error('Errore durante l\'aggiornamento della squadra:', err),
      });
    }
  }

  // Elimina una squadra
  deleteTeam(teamId: string): void {
    this.teamsService.deleteTeam(teamId).subscribe({
      next: () => {
        this.userTeams = this.userTeams.filter((team) => team._id !== teamId);
      },
      error: (err) => console.error('Errore durante l\'eliminazione della squadra:', err),
    });
  }

  // Annulla la modifica
  cancelEdit(): void {
    this.editingTeam = null;
  }


  copyInviteCode() {
    navigator.clipboard.writeText(this.inviteCode).then(() => {
    });
  }

 // Metodo per navigare alla pagina di dettaglio
 navigateToTeamDetails(teamId: string) {
  this.router.navigate([`/teams/${teamId}`]);
}

  // Modifica il pulsante per aprire il form di modifica
toggleEditForm(team: Team): void {
  this.editingTeamId = team._id; // Memorizza l'ID della squadra in modifica
  this.editingTeam = { ...team }; // Clona l'oggetto della squadra
}
}