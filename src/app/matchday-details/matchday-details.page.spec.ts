import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchdayDetailsPage } from './matchday-details.page';

describe('MatchdayDetailsPage', () => {
  let component: MatchdayDetailsPage;
  let fixture: ComponentFixture<MatchdayDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchdayDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
