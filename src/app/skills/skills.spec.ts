import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Skills } from './skills';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

vi.mock('gsap', () => ({ gsap: { to: vi.fn(() => ({ kill: vi.fn() })), from: vi.fn(() => ({ kill: vi.fn() })), fromTo: vi.fn(() => ({ kill: vi.fn(), scrollTrigger: { kill: vi.fn() } })), set: vi.fn(), timeline: () => ({ to: vi.fn().mockReturnThis(), from: vi.fn().mockReturnThis(), add: vi.fn().mockReturnThis(), kill: vi.fn() }), registerPlugin: vi.fn() } }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { create: vi.fn(() => ({ kill: vi.fn() })) } }));

describe('Skills', () => {
  let component: Skills;
  let fixture: ComponentFixture<Skills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Skills], schemas: [NO_ERRORS_SCHEMA] }).compileComponents();
    fixture = TestBed.createComponent(Skills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('has frontend skills', () => expect(component.frontendSkills.length).toBeGreaterThan(0));
  it('has all skill categories', () => {
    expect(component.frontendSkills.length).toBe(7);
    expect(component.backendSkills.length).toBe(6);
    expect(component.databaseSkills.length).toBe(3);
    expect(component.aiSkills.length).toBe(5);
    expect(component.toolsSkills.length).toBe(4);
  });
  it('each frontend skill has name and level', () => {
    for (const s of component.frontendSkills) expect(s.name && typeof s.level === 'number').toBeTruthy();
  });
  it('each backend skill has name and level', () => {
    for (const s of component.backendSkills) expect(s.name && typeof s.level === 'number').toBeTruthy();
  });
  it('each tool has name and icon class', () => {
    for (const s of component.toolsSkills) expect(s.name && s.class).toBeTruthy();
  });
  it('renders heading', () => {
    const h2 = fixture.nativeElement.querySelector('h2');
    expect(h2).toBeTruthy();
    expect(h2.textContent).toContain('Habilidades');
  });
});
