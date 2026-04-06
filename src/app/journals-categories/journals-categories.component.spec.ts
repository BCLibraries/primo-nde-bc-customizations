import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalsCategoriesComponent } from './journals-categories.component';

describe('JournalsCategoriesComponent', () => {
  let component: JournalsCategoriesComponent;
  let fixture: ComponentFixture<JournalsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalsCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
