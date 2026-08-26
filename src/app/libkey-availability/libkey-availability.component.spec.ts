import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibkeyAvailabilityComponent } from './libkey-availability.component';

describe('LibkeyAvailabilityComponent', () => {
  let component: LibkeyAvailabilityComponent;
  let fixture: ComponentFixture<LibkeyAvailabilityComponent>;
  let parentRecordAvailability: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibkeyAvailabilityComponent],
    }).compileComponents();
  });

  afterEach(() => {
    if (parentRecordAvailability && parentRecordAvailability.parentNode) {
      parentRecordAvailability.parentNode.removeChild(parentRecordAvailability);
    }
  });

  function createTestEnvironment(htmlString: string) {
    parentRecordAvailability = document.createElement('nde-record-availability');
    parentRecordAvailability.innerHTML = htmlString;
    document.body.appendChild(parentRecordAvailability);

    fixture = TestBed.createComponent(LibkeyAvailabilityComponent);
    component = fixture.componentInstance;
    parentRecordAvailability.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  }

  it('should create', () => {
    createTestEnvironment('');
    expect(component).toBeTruthy();
  });

  it('should hide stacked-button > button if onlineAvailability is hidden by third iron and has no button', (done) => {
    const html = `
      <nde-online-availability data-ti-online-availability-hidden-by-third-iron="1"></nde-online-availability>
      <stacked-button><button id="btn">Find Online</button></stacked-button>
    `;
    createTestEnvironment(html);

    setTimeout(() => {
      const button = parentRecordAvailability.querySelector(
        'stacked-button > button',
      ) as HTMLElement;
      expect(button.style.display).toBe('none');
      done();
    }, 50);
  });

  it('should wait for stacked-button > button to be inserted asynchronously after third iron marks onlineAvailability', (done) => {
    const html = `
      <nde-online-availability data-ti-online-availability-hidden-by-third-iron="1"></nde-online-availability>
    `;
    createTestEnvironment(html);

    // Verify button is not there initially
    expect(
      parentRecordAvailability.querySelector('stacked-button > button'),
    ).toBeNull();

    // Asynchronously insert stacked-button > button
    setTimeout(() => {
      const stackedButton = document.createElement('stacked-button');
      stackedButton.innerHTML = '<button id="btn">Find Online</button>';
      parentRecordAvailability.appendChild(stackedButton);
    }, 20);

    setTimeout(() => {
      const button = parentRecordAvailability.querySelector(
        'stacked-button > button',
      ) as HTMLElement;
      expect(button).not.toBeNull();
      expect(button.style.display).toBe('none');
      done();
    }, 100);
  });

  it('should NOT hide stacked-button > button if onlineAvailability contains a button', (done) => {
    const html = `
      <nde-online-availability data-ti-online-availability-hidden-by-third-iron="1">
        <button class="quicklink-button">View Online</button>
      </nde-online-availability>
      <stacked-button><button id="btn">Find Online</button></stacked-button>
    `;
    createTestEnvironment(html);

    setTimeout(() => {
      const button = parentRecordAvailability.querySelector(
        'stacked-button > button',
      ) as HTMLElement;
      expect(button.style.display).not.toBe('none');
      done();
    }, 50);
  });
});
