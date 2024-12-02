import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsBusinessComponent } from './keywordsbusiness.component';

describe('KeywordsBusinessComponent', () => {
  let component: KeywordsBusinessComponent;
  let fixture: ComponentFixture<KeywordsBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeywordsBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeywordsBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
