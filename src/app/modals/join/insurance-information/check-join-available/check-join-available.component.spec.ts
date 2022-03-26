import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckJoinAvailableComponent } from './check-join-available.component';

describe('CheckJoinAvailableComponent', () => {
  let component: CheckJoinAvailableComponent;
  let fixture: ComponentFixture<CheckJoinAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckJoinAvailableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckJoinAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
