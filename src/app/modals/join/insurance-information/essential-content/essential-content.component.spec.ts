import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssentialContentComponent } from './essential-content.component';

describe('EssentialContentComponent', () => {
  let component: EssentialContentComponent;
  let fixture: ComponentFixture<EssentialContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssentialContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssentialContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
