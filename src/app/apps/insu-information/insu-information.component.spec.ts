import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuInformationComponent } from './insu-information.component';

describe('InsuInformationComponent', () => {
  let component: InsuInformationComponent;
  let fixture: ComponentFixture<InsuInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
