import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Contact } from './contact';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { setupBrowserMocks } from '../test-utils';

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
      providers: [{ provide: HttpClient, useValue: httpClient }],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('form fields start empty', () => {
    expect(component.contactForm.name).toBe('');
    expect(component.contactForm.email).toBe('');
    expect(component.contactForm.subject).toBe('');
    expect(component.contactForm.message).toBe('');
  });
  it('starts with correct state flags', () => {
    expect(component.isSubmitting).toBe(false);
    expect(component.showSuccess).toBe(false);
    expect(component.showError).toBe(false);
  });
  it('sets isSubmitting on submit', () => {
    httpClient.post.mockReturnValue(of({}));
    component.onSubmit();
    expect(component.isSubmitting).toBe(true);
  });
  it('resetForm clears error and success', () => {
    component.showError = true;
    component.showSuccess = true;
    component.resetForm();
    expect(component.showError).toBe(false);
    expect(component.showSuccess).toBe(false);
  });
  it('sends POST to Formspree', () => {
    httpClient.post.mockReturnValue(of({}));
    component.onSubmit();
    expect(httpClient.post).toHaveBeenCalledWith('https://formspree.io/f/xreowwza', component.contactForm, expect.any(Object));
  });
  it('renders heading', () => {
    const h2 = fixture.nativeElement.querySelector('h2');
    expect(h2).toBeTruthy();
    expect(h2.textContent).toContain('Trabajemos');
  });
});
