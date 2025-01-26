import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchdaysPage } from './matchdays.page';

describe('MatchdaysPage', () => {
  let component: MatchdaysPage;
  let fixture: ComponentFixture<MatchdaysPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchdaysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
