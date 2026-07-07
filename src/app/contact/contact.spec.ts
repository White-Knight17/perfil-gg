import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Contact } from './contact';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { setupBrowserMocks } from '../test-utils';
import { provideQueryClient, QueryClient } from '@tanstack/angular-query-experimental';

setupBrowserMocks();

describe('Contact', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;
  let httpClient: { post: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    httpClient = { post: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Contact],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: HttpClient, useValue: httpClient },
        provideQueryClient(new QueryClient()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('form starts with correct state flags', () => {
    expect(component.isSubmitting).toBe(false);
    expect(component.showSuccess).toBe(false);
    expect(component.showError).toBe(false);
  });
  it('form should be invalid when empty', () => {
    expect(component.form.invalid).toBe(true);
  });
  it('sends POST to Formspree when valid', () => {
    component.form.patchValue({ name: 'Test', email: 'a@b.com', subject: 'Hola', message: 'Un mensaje de prueba' });
    httpClient.post.mockReturnValue(of({}));
    component.onSubmit();
    expect(httpClient.post).toHaveBeenCalledWith('https://formspree.io/f/xreowwza', expect.any(Object), expect.any(Object));
  });
  it('resetForm clears error and success', () => {
    component.showError = true;
    component.showSuccess = true;
    component.resetForm();
    expect(component.showError).toBe(false);
    expect(component.showSuccess).toBe(false);
  });
  it('renders heading', () => {
    const h2 = fixture.nativeElement.querySelector('h2');
    expect(h2).toBeTruthy();
    expect(h2.textContent).toContain('Trabajemos');
  });
});
