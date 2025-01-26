import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarDetailsPage } from './calendar-details.page';

describe('CalendarDetailsPage', () => {
  let component: CalendarDetailsPage;
  let fixture: ComponentFixture<CalendarDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
