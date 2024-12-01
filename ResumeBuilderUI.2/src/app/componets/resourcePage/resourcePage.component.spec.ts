import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePageComponent } from './resourcePage.component';

describe('ResumeOptionComponent', () => {
  let component: ResourcePageComponent;
  let fixture: ComponentFixture<ResourcePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourcePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
