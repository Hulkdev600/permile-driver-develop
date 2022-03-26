import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutsLimitContentComponent } from './payouts-limit-content.component';

describe('PayoutsLimitContentComponent', () => {
  let component: PayoutsLimitContentComponent;
  let fixture: ComponentFixture<PayoutsLimitContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutsLimitContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutsLimitContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
