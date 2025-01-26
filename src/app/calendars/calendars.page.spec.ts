import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarsPage } from './calendars.page';

describe('CalendarsPage', () => {
  let component: CalendarsPage;
  let fixture: ComponentFixture<CalendarsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
