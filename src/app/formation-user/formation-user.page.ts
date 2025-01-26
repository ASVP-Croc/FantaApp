import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { Formation } from '../models/Formation';
import { Player } from '../models/Player';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { PlayerService } from '../services/players.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-formation-user',
  templateUrl: './formation-user.page.html',
  styleUrls: ['./formation-user.page.scss'],
  standalone: true,
  imports: [HttpClientModule, IonLabel, IonItem, IonButton, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
  providers: [UserService, PlayerService, AuthService]
})
export class FormationUserPage implements OnInit {
  teamId!: string;
  matchdayId!: string;
  formation: Formation | null = null;  // Formazione può essere null se non esiste
  players: Player[] = [];  // Lista dei giocatori disponibili
  selectedPlayers: Player[] = [];  // Giocatori selezionati per la formazione
  module: string = '';  // Campo per il modulo della formazione (senza FormGroup)
  createdBy = this.authService.getUserIdFromToken() || '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private playerService: PlayerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Recupero dei parametri dall'URL
    this.teamId = this.route.snapshot.paramMap.get('teamId')!;
    this.matchdayId = this.route.snapshot.paramMap.get('matchdayId')!;

    // Recupera i dati iniziali
    this.loadFormation();
    this.loadPlayers();
  }

  // Recupera la formazione esistente dell'utente corrente
  loadFormation() {
    this.userService.getFormation(this.teamId, this.matchdayId).subscribe({
      next: (response) => {
        const formation = response.userFormation; // Accedi alla formazione vera e propria
        if (formation) {
          this.formation = formation;
          this.selectedPlayers = formation.players;
          // Assumi che `players` sia un array di oggetti giocatore
        }
      },
      error: (err) => console.error('Errore nel caricamento della formazione:', err),
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
    
    this.userService
  .createFormation(this.matchdayId, formationData)
  .subscribe({
    next: () => {
      this.loadFormation(); 
    },
    error: (error) => {
      console.error('Errore durante la creazione della formazione:', error);
    },});
  }

  // Aggiorna una formazione esistente
  updateFormation() {
    if (!this.formation || !this.isFormValid()) {
      alert('Seleziona una formazione valida e 11 giocatori');
      return;
    }
      // Crea l'oggetto da inviare con entrambi i campi
  const updatedData = {
    players: this.selectedPlayers.map((p) => p._id), // Lista di ID dei giocatori
    module: this.formation.module, // Modulo corrente
  };

  this.userService
  .updateFormation(this.matchdayId, this.formation._id, updatedData)
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

    this.userService
      .deleteFormation(
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
