import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { PlayerService } from '../services/players.service';
import { Player } from '../models/Player';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, IonicModule],
  providers: [PlayerService, AuthService],
})
export class PlayersPage implements OnInit {
  players: Player[] = [];
  teamId: string = '';
  newPlayer: { firstName: string; lastName: string } = { firstName: '', lastName: '' };
  selectedPlayer: Player | null = null;

  constructor(
    private playersService: PlayerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Ottieni teamId dalla route
    this.route.params.subscribe(params => {
      this.teamId = params['teamId'];
      this.loadPlayers();
    });
  }

  // Carica la lista dei giocatori
  loadPlayers() {
    this.playersService.getPlayers(this.teamId).subscribe((players) => {
      this.players = players;
    });
  }

   // Apre il form di aggiornamento per un giocatore
   openUpdateForm(player: Player) {
    this.selectedPlayer = { ...player }; // Copia i dati del giocatore selezionato
  }

  // Crea un nuovo giocatore
  createPlayer() {
    if (this.newPlayer.firstName && this.newPlayer.lastName) {
      const playerData = {
        ...this.newPlayer
      };
      this.playersService.createPlayer(this.teamId, playerData).subscribe((player) => {
        this.players.push(player);
        this.newPlayer = { firstName: '', lastName: '' };
      });
    }
  }

  // Elimina un giocatore
  deletePlayer(playerId: string) {
    this.playersService.deletePlayer(this.teamId, playerId).subscribe(() => {
      this.players = this.players.filter(player => player._id !== playerId);
    });
  }

 // Aggiorna un giocatore (aggiungi gol e assist)
 updatePlayer() {
  if (this.selectedPlayer && this.selectedPlayer.goals >= 0 && this.selectedPlayer.assists >= 0) {
    const updatedData = {
      goals: this.selectedPlayer.goals,
      assists: this.selectedPlayer.assists
    };

    this.playersService.updatePlayer(this.teamId, this.selectedPlayer._id, updatedData).subscribe((updatedPlayer) => {
      const index = this.players.findIndex(player => player._id === updatedPlayer._id);
      if (index !== -1) {
        this.players[index] = updatedPlayer;
      }
      this.selectedPlayer = null;
    });
  }
}

toggleUpdateForm(player: Player) {
  // Se il giocatore è già selezionato, chiudi il form
  if (this.selectedPlayer?._id === player._id) {
    this.selectedPlayer = null;
  } else {
    this.selectedPlayer = { ...player }; // Apre il form con i dati del giocatore
  }
}
}
