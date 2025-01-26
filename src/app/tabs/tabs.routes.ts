import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'teams',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
    
      {
        path: 'matchdays',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'ranking',
        loadComponent: () =>
          import('../tab4/tab4.page').then((m) => m.Tab4Page),
      },
      {
        path: 'teams/:teamId',
        loadComponent: () =>
          import('../team-details/team-details.page').then((m) => m.TeamDetailsPage),
      },
      {
        path: 'teams/:teamId/players',
        loadComponent: () =>
          import('../players/players.page').then((m) => m.PlayersPage),
      },
      {
        path: 'teams/:teamId/calendars',
        loadComponent: () =>
          import('../calendars/calendars.page').then((m) => m.CalendarsPage),
      },
      {
        path: 'teams/:teamId/calendars/:calendarId',
        loadComponent: () =>
          import('../calendar-details/calendar-details.page').then((m) => m.CalendarDetailsPage),
      },
      {
        path: 'teams/:teamId/calendars/:calendarId/matchdays',
        loadComponent: () =>
          import('../matchdays/matchdays.page').then((m) => m.MatchdaysPage),
      },
      {
        path: 'teams/:teamId/calendars/:calendarId/matchdays/:matchdayId',
        loadComponent: () =>
          import('../matchday-details/matchday-details.page').then((m) => m.MatchdayDetailsPage),
      },
      {
        path: 'teams/:teamId/calendars/:calendarId/matchdays/:matchdayId/formation',
        loadComponent: () =>
          import('../formation/formation.page').then((m) => m.FormationPage),
      },
      {
        path: 'matchdays/:teamId/:matchdayId',
        loadComponent: () => import('../matchday-user/matchday-user.page').then( m => m.MatchdayUserPage)
      },
      {
        path: 'matchdays/:teamId/:matchdayId/formations',
        loadComponent: () => import('../formation-user/formation-user.page').then( m => m.FormationUserPage)
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
