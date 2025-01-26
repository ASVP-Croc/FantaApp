import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationService } from '../services/formations.service';
import { PlayerService } from '../services/players.service';
import { Formation } from '../models/Formation';
import { Player } from '../models/Player';
import { CommonModule } from '@angular/common';
import { IonButton, IonInput, IonContent, IonList, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-formation',
  templateUrl: './formation.page.html',
  styleUrls: ['./formation.page.scss'],
  standalone: true,
  imports: [HttpClientModule, IonTitle, IonToolbar, IonHeader, IonInput, IonContent, CommonModule, IonButton, IonItem, IonLabel, FormsModule, RouterModule],
  providers: [FormationService, PlayerService, AuthService],
})
export class FormationPage implements OnInit {
  teamId!: string;
  calendarId!: string;
  matchdayId!: string;
  formation: Formation | null = null;  // Formazione può essere null se non esiste
  players: Player[] = [];  // Lista dei giocatori disponibili
  selectedPlayers: Player[] = [];  // Giocatori selezionati per la formazione
  module: string = '';  // Campo per il modulo della formazione (senza FormGroup)
  createdBy = this.authService.getUserIdFromToken() || '';

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private playerService: PlayerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Recupero dei parametri dall'URL
    this.teamId = this.route.snapshot.paramMap.get('teamId')!;
    this.calendarId = this.route.snapshot.paramMap.get('calendarId')!;
    this.matchdayId = this.route.snapshot.paramMap.get('matchdayId')!;

    // Recupera i dati iniziali
    this.loadFormation();
    this.loadPlayers();
  }

  // Recupera la formazione esistente
  loadFormation() {
    this.formationService.getFormation(this.teamId, this.calendarId, this.matchdayId).subscribe((formation) => {
      if (formation) {
        this.formation = formation;
        this.selectedPlayers = formation.players; // players sono oggetti Player completi
      }
    });
  }

  // Recupera i dettagli completi dei giocatori usando gli ID
  loadPlayerDetails(playerIds: string[]) {
    this.playerService.getPlayersByIds(this.teamId, playerIds).subscribe((players) => {
      this.selectedPlayers = players; // Aggiorniamo la lista di giocatori con i dettagli
    });
  }

  // Recupera i giocatori disponibili
  loadPlayers() {
    this.playerService.getPlayers(this.teamId).subscribe((players) => {
      // Filtriamo i giocatori già selezionati dalla lista
      this.players = players.filter(
        (player) => !this.selectedPlayers.find((p) => p._id === player._id)
      );
    });
  }

  // Seleziona un giocatore
  selectPlayer(player: Player) {
    if (this.selectedPlayers.length >= 11) {
      alert('Puoi selezionare solo 11 giocatori');
      return;
    }
    this.selectedPlayers.push(player);
    this.players = this.players.filter((p) => p._id !== player._id);
  }

  // Rimuovi un giocatore
  removePlayer(player: Player) {
    this.selectedPlayers = this.selectedPlayers.filter(
      (p) => p._id !== player._id
    );
    this.players.push(player);
  }

  // Funzione di validazione per il modulo
  isFormValid(): boolean {
    return this.module.trim().length > 0 && this.selectedPlayers.length === 11;
  }

  // Crea una nuova formazione
  createFormation() {
    if (!this.isFormValid()) {
      alert('Compila il modulo e seleziona esattamente 11 giocatori');
      return;
    }

    const formationData = {
      module: this.module,
      players: this.selectedPlayers.map((p) => p._id),
      createdBy: this.createdBy,
    };
    
    this.formationService
  .createFormation(this.teamId, this.calendarId, this.matchdayId, formationData)
  .subscribe({
    next: () => {
      this.loadFormation();  // Carica la formazione con i dettagli completi dei giocatori
    },
    error: (error) => {
      console.error('Errore durante la creazione della formazione:', error);
    },
  });
  }

  // Aggiorna una formazione esistente
  updateFormation() {
    if (!this.formation || !this.isFormValid()) {
      alert('Seleziona una formazione valida e 11 giocatori');
      return;
    }
    const updatedData = {
      players: this.selectedPlayers.map((p) => p._id), // Lista di ID dei giocatori
      module: this.formation.module, // Modulo corrente
    };

    this.formationService
      .updateFormation(
        this.teamId,
        this.calendarId,
        this.matchdayId,
        this.formation._id,
        updatedData
      )
      .subscribe(() => {
        alert('Formazione aggiornata con successo!');
        this.loadFormation();
      });
  }

  // Elimina la formazione
  deleteFormation() {
    if (!this.formation) {
      alert('Nessuna formazione da eliminare');
      return;
    }

    this.formationService
      .deleteFormation(
        this.teamId,
        this.calendarId,
        this.matchdayId,
        this.formation._id
      )
      .subscribe(() => {
        alert('Formazione eliminata con successo!');
        this.formation = null;
        this.selectedPlayers = [];
        this.loadPlayers();
      });
  }


  // Verifica se un giocatore è stato selezionato
isSelected(player: Player): boolean {
  return this.selectedPlayers.some((p) => p._id === player._id);
}

// Gestisce l'aggiunta o rimozione di un giocatore
togglePlayer(player: Player) {
  if (this.isSelected(player)) {
    // Rimuovi il giocatore se è già selezionato
    this.selectedPlayers = this.selectedPlayers.filter(
      (p) => p._id !== player._id
    );
  } else {
    // Aggiungi il giocatore se non è già selezionato
    if (this.selectedPlayers.length >= 11) {
      alert('Puoi selezionare solo 11 giocatori');
      return;
    }
    this.selectedPlayers.push(player);
  }
}
}