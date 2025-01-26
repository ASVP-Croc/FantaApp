import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.baseUrl}api/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserDetails(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
      return this.http.get<any>(`${this.apiUrl}/${userId}`, { headers });
    }

    // Metodo per iscriversi a una squadra tramite codice di invito
  joinTeam(userId: string, inviteCode: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.post<any>(`${this.apiUrl}/${userId}/joinTeam`, { inviteCode }, { headers });
  }

  getCurrentWeekMatchdays(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.get<any>(`${environment.baseUrl}api/matchdays/${userId}`, { headers });
  }

  getFormation(teamId: string, matchdayId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization:  `Bearer ${this.authService.getToken()}`,
    });
    return this.http.get<any>(`${environment.baseUrl}api/matchdays/${teamId}/${matchdayId}/formations`, { headers });
  }

   //Crea una formazione per un matchday.
   createFormation(matchdayId: string, formationData: { players: string[]; module: string }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.post(`${environment.baseUrl}api/matchdays/${matchdayId}/formations`, formationData, { headers });
  }

 //Aggiorna una formazione esistente.
  updateFormation(matchdayId: string, formationId: string, updatedData: { players?: string[]; module?: string }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.put(`${environment.baseUrl}api/matchdays/${matchdayId}/formations/${formationId}`, updatedData, { headers });
  }

  //Elimina una formazione.
  deleteFormation(matchdayId: string, formationId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.delete(`${environment.baseUrl}api/matchdays/${matchdayId}/formations/${formationId}`, { headers });
  }

  getTeamLeaderboard(teamId: string): Observable<any> {
    const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.get<any>(`${environment.baseUrl}api/ranking/${teamId}`, { headers });
}
}
