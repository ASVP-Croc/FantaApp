import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calendar } from '../models/Calendar';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = `${environment.baseUrl}api/teams/:teamId/calendars`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Funzione per ottenere l'URL corretto sostituendo ':teamId' con il teamId effettivo
  private getUrl(teamId: string): string {
    return this.apiUrl.replace(':teamId', teamId);
  }

  // 1. Crea un nuovo calendario per un team specifico con numero di matchdays
  createCalendar(teamId: string, season: string, numMatchdays: number): Observable<Calendar> {
     const headers = new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
      });
    return this.http.post<Calendar>(this.getUrl(teamId), { season, numMatchdays }, { headers });
  }

  // 2. Ottieni tutti i calendari di un team
  getCalendarsByTeam(teamId: string): Observable<Calendar[]> {
    return this.http.get<Calendar[]>(this.getUrl(teamId));
  }

  // 3. Ottieni un singolo calendario di un team specifico
  getCalendarById(teamId: string, calendarId: string): Observable<Calendar> {
    return this.http.get<Calendar>(`${this.getUrl(teamId)}/${calendarId}`);
  }

  // 4. Aggiorna un calendario di un team specifico
  updateCalendar(teamId: string, calendarId: string, calendarData: Partial<Calendar>): Observable<Calendar> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
  });
    return this.http.put<Calendar>(`${this.getUrl(teamId)}/${calendarId}`, calendarData, { headers });
  }

  // 5. Elimina un calendario di un team specifico
  deleteCalendar(teamId: string, calendarId: string): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
  });
    return this.http.delete<{ message: string }>(`${this.getUrl(teamId)}/${calendarId}`, { headers });
  }
}
