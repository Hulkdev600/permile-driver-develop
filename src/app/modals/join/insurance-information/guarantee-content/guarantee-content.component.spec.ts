import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeContentComponent } from './guarantee-content.component';

describe('GuaranteeContentComponent', () => {
  let component: GuaranteeContentComponent;
  let fixture: ComponentFixture<GuaranteeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuaranteeContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
