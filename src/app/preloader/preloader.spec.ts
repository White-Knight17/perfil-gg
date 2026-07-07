import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Preloader } from './preloader';
import { PreloaderService } from '../services/preloader.service';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(() => ({ kill: vi.fn() })),
    from: vi.fn(() => ({ kill: vi.fn() })),
    fromTo: vi.fn(() => ({ kill: vi.fn() })),
    set: vi.fn(),
    timeline: () => ({ to: vi.fn().mockReturnThis(), add: vi.fn().mockReturnThis(), kill: vi.fn() }),
  },
}));

describe('Preloader', () => {
  let component: Preloader;
  let fixture: ComponentFixture<Preloader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Preloader],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [PreloaderService],
    }).compileComponents();

    fixture = TestBed.createComponent(Preloader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('has preloader overlay', () => expect(fixture.nativeElement.querySelector('.preloader-overlay')).toBeTruthy());
  it('displays GG initials', () => {
    const text = fixture.nativeElement.querySelector('.gradient-text');
    expect(text).toBeTruthy();
    expect(text.textContent?.trim()).toBe('GG');
  });
  it('displays name', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent).toContain('German Giorgio');
  });
  it('displays title (with non-breaking spaces from stagger prep)', () => {
    const p = fixture.nativeElement.querySelector('p');
    expect(p).toBeTruthy();
    expect(p.textContent).toContain('Desarrollador');
    expect(p.textContent).toContain('Full-Stack');
  });
  it('preloaderService.done() is false before animation', () => {
    const ps = TestBed.inject(PreloaderService);
    expect(ps.done()).toBe(false);
  });
});
