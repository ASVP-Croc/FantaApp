import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchdayUserPage } from './matchday-user.page';

describe('MatchdayUserPage', () => {
  let component: MatchdayUserPage;
  let fixture: ComponentFixture<MatchdayUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchdayUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
