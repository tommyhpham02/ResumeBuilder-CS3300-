import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTemplatePageComponent } from './resumeTemplatePage.component';

describe('DownloadComponent', () => {
  let component: ResumeTemplatePageComponent;
  let fixture: ComponentFixture<ResumeTemplatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumeTemplatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
