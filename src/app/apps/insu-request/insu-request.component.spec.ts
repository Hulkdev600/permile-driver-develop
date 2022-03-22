import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuRequestComponent } from './insu-request.component';

describe('InsuRequestComponent', () => {
  let component: InsuRequestComponent;
  let fixture: ComponentFixture<InsuRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
