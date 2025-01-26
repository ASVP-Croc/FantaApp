import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  { path: 'teams/:teamId',
    loadComponent: () => import('./team-details/team-details.page').then(m => m.TeamDetailsPage)
  },
  { 
    path: 'teams/:teamId/players', 
    loadComponent: () => import('./players/players.page').then(m => m.PlayersPage) 
  },
  {
    path: 'teams/:teamId/calendars',
    loadComponent: () => import('./calendars/calendars.page').then( m => m.CalendarsPage)
  },
  { 
    path: 'teams/:teamId/calendars/:calendarId', 
    loadComponent: () => import('./calendar-details/calendar-details.page').then(m => m.CalendarDetailsPage) 
  },
  { 
    path: 'teams/:teamId/calendars/:calendarId/matchdays', 
    loadComponent: () => import('./matchdays/matchdays.page').then(m => m.MatchdaysPage) 
  },
  { 
    path: 'teams/:teamId/calendars/:calendarId/matchdays/:matchdayId', 
    loadComponent: () => import('./matchday-details/matchday-details.page').then(m => m.MatchdayDetailsPage) 
  },
  {
    path: 'teams/:teamId/calendars/:calendarId/matchdays/:matchdayId/formation',
    loadComponent: () => import('./formation/formation.page').then( m => m.FormationPage)
  },
  {
    path: 'users/:userId/joinTeam',
    loadComponent: () => import('./insert-code/insert-code.page').then( m => m.InsertCodePage)
  },
  {
    path: 'matchdays/:teamId/:matchdayId',
    loadComponent: () => import('./matchday-user/matchday-user.page').then( m => m.MatchdayUserPage)
  },
  {
    path: 'matchdays/:teamId/:matchdayId/formations',
    loadComponent: () => import('./formation-user/formation-user.page').then( m => m.FormationUserPage)
  },
];
