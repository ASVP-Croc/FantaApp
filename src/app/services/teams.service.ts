import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../models/Team';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';  // Importa il servizio di autenticazione

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private apiUrl = `${environment.baseUrl}api/teams`;

  constructor(private http: HttpClient, private authService: AuthService) {}
  
  getUserTeams(): Observable<{ createdTeams: Team[]; joinedTeams: Team[] }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.get<{ createdTeams: Team[]; joinedTeams: Team[] }>(`${this.apiUrl}`, { headers });
}

  getTeamById(teamId: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${teamId}`);
  }

  createTeam(teamData: { name: string; coach: string }): Observable<Team> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.post<Team>(this.apiUrl, teamData, { headers });
  }

  updateTeam(teamId: string, teamData: Partial<Team>): Observable<Team> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.put<Team>(`${this.apiUrl}/${teamId}`, teamData, { headers });
  }

  deleteTeam(teamId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.delete<any>(`${this.apiUrl}/${teamId}`, { headers });
  }
}
