import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsertCodePage } from './insert-code.page';

describe('InsertCodePage', () => {
  let component: InsertCodePage;
  let fixture: ComponentFixture<InsertCodePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
