import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugestedWordResourceComponent } from './sugestedWordResource.component';

describe('ResumeOptionComponent', () => {
  let component: SugestedWordResourceComponent;
  let fixture: ComponentFixture<SugestedWordResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SugestedWordResourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SugestedWordResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});