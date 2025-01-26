import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormationUserPage } from './formation-user.page';

describe('FormationUserPage', () => {
  let component: FormationUserPage;
  let fixture: ComponentFixture<FormationUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
