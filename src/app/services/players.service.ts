import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Player } from '../models/Player';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = `${environment.baseUrl}api/teams/:teamId/players`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getUrl(teamId: string): string {
    return this.apiUrl.replace(':teamId', teamId);
  }

  // Crea un nuovo giocatore
  createPlayer(teamId: string, playerData: { firstName: string; lastName: string }): Observable<Player> {
    const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.post<Player>(this.getUrl(teamId), playerData, { headers });
}

  // Ottieni tutti i giocatori
  getPlayers(teamId: string): Observable<Player[]> {
    return this.http.get<Player[]>(this.getUrl(teamId));
  }

  // Ottieni un singolo giocatore
  getPlayerById(teamId: string, playerId: string): Observable<Player> {
    return this.http.get<Player>(`${this.getUrl(teamId)}/${playerId}`);
  }

  getPlayersByIds(teamId: string, playerId: string[]): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.getUrl(teamId)}/${playerId}`);
  }

  getPlayersByTeam(teamId: string): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.getUrl(teamId)}`);
  }

  // Aggiorna un giocatore
  updatePlayer(teamId: string, playerId: string, playerData: Partial<Player>): Observable<Player> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
  });
    return this.http.put<Player>(`${this.getUrl(teamId)}/${playerId}`, playerData, { headers });
  }

  // Elimina un giocatore
  deletePlayer(teamId: string, playerId: string): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
  });
    return this.http.delete<{ message: string }>(`${this.getUrl(teamId)}/${playerId}`, { headers });
  }
}
