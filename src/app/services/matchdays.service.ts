import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Matchday } from '../models/Matchday';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MatchdayService {
  
  private apiUrl = `${environment.baseUrl}api/teams/:teamId/calendars/:calendarId/matchdays`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Metodo per ottenere l'URL dinamico in base ai parametri teamId e calendarId
  private getUrl(teamId: string, calendarId: string): string {
    return this.apiUrl.replace(':teamId', teamId).replace(':calendarId', calendarId);
  }

  // Crea un nuovo matchday e lo associa al calendario specifico di una squadra
  createMatchday(teamId: string, calendarId: string, matchdayData: Matchday): Observable<Matchday> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
  });
    return this.http.post<Matchday>(this.getUrl(teamId, calendarId), matchdayData, { headers });
  }

  // Ottieni tutti i matchdays di un calendario specifico di una squadra
  getMatchdays(teamId: string, calendarId: string): Observable<Matchday[]> {
    return this.http.get<Matchday[]>(this.getUrl(teamId, calendarId));
  }

  // Ottieni un singolo matchday di un calendario specifico di una squadra
  getMatchdayById(teamId: string, calendarId: string, matchdayId: string): Observable<Matchday> {
    return this.http.get<Matchday>(`${this.getUrl(teamId, calendarId)}/${matchdayId}`);
  }

  // Aggiorna un matchday di un calendario specifico di una squadra
  updateMatchday(teamId: string, calendarId: string, matchdayId: string, matchdayData: Partial<Matchday>): Observable<Matchday> {
     const headers = new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
      });
    return this.http.put<Matchday>(`${this.getUrl(teamId, calendarId)}/${matchdayId}`, matchdayData, { headers });
  }

  // Elimina un matchday di un calendario specifico di una squadra
  deleteMatchday(teamId: string, calendarId: string, matchdayId: string): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
  });
    return this.http.delete<{ message: string }>(`${this.getUrl(teamId, calendarId)}/${matchdayId}`, { headers });
  }

  getMatchdayDetails(teamId: string, matchdayId: string):  Observable<Matchday> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
  });
    return this.http.get<Matchday>(`${environment.baseUrl}api/matchdays/${teamId}/${matchdayId}`, { headers });
  }
}

