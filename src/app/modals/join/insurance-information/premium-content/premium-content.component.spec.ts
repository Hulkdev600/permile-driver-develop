import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumContentComponent } from './premium-content.component';

describe('PremiumContentComponent', () => {
  let component: PremiumContentComponent;
  let fixture: ComponentFixture<PremiumContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiumContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
