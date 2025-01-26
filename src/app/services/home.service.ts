import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getHomeData(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}
