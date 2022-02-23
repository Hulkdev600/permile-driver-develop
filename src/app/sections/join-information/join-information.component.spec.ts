import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinInformationComponent } from './join-information.component';

describe('JoinInformationComponent', () => {
  let component: JoinInformationComponent;
  let fixture: ComponentFixture<JoinInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
