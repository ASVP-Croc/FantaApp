import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Formation } from '../models/Formation';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = `${environment.baseUrl}api/teams/:teamId/calendars/:calendarId/matchdays/:matchdayId/formation`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Metodo per ottenere l'URL dinamico in base ai parametri teamId, calendarId e matchdayId
  private getUrl(teamId: string, calendarId: string, matchdayId: string): string {
    return this.apiUrl
      .replace(':teamId', teamId)
      .replace(':calendarId', calendarId)
      .replace(':matchdayId', matchdayId);
  }

  // Crea una nuova formazione per un matchday
  createFormation(teamId: string, calendarId: string, matchdayId: string, formationData: { players: string[]; module: string, createdBy: string }): Observable<Formation> {
      const headers = new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
      });
    return this.http.post<Formation>(this.getUrl(teamId, calendarId, matchdayId), formationData, { headers });
  }

  // Ottieni la formazione di un matchday specifico
  getFormation(teamId: string, calendarId: string, matchdayId: string): Observable<Formation> {
    return this.http.get<Formation>(this.getUrl(teamId, calendarId, matchdayId));
  }

  // Aggiorna la formazione di un matchday
  updateFormation(teamId: string, calendarId: string, matchdayId: string, formationId: string, updatedData: { players?: string[]; module?: string }): Observable<Formation> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
  });
    return this.http.put<Formation>(`${this.getUrl(teamId, calendarId, matchdayId)}/${formationId}`, { updatedData }, { headers });
  }

   // Funzione per eliminare una formazione
  deleteFormation(teamId: string, calendarId: string, matchdayId: string, formationId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
  });
    return this.http.delete<any>(`${this.getUrl(teamId, calendarId, matchdayId)}/${formationId}`, { headers });
  }
}