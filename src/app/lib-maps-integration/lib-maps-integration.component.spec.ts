import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibMapsIntegrationComponent } from './lib-maps-integration.component';

describe('LibMapsIntegrationComponent', () => {
  let component: LibMapsIntegrationComponent;
  let fixture: ComponentFixture<LibMapsIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibMapsIntegrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibMapsIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
