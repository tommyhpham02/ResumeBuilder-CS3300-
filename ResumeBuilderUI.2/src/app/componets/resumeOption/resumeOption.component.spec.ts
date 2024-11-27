import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeOptionComponent } from './resumeOption.component';

describe('ResumeOptionComponent', () => {
  let component: ResumeOptionComponent;
  let fixture: ComponentFixture<ResumeOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumeOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});