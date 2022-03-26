import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimGuideContentComponent } from './claim-guide-content.component';

describe('ClaimGuideContentComponent', () => {
  let component: ClaimGuideContentComponent;
  let fixture: ComponentFixture<ClaimGuideContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimGuideContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimGuideContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
