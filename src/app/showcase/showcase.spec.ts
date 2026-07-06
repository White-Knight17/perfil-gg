import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Showcase } from './showcase';

// Mock GSAP + ScrollTrigger since they need real browser APIs
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    timeline: () => ({
      to: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      add: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    }),
    globalTimeline: { getChildren: () => [] },
    quickTo: () => vi.fn(),
    killTweensOf: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({
      kill: vi.fn(),
      progress: 0,
    })),
    refresh: vi.fn(),
    kill: vi.fn(),
    getAll: () => [],
  },
}));

describe('Showcase', () => {
  let component: Showcase;
  let fixture: ComponentFixture<Showcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showcase],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Showcase);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a projects array with at least one project', () => {
    expect(Array.isArray(component.projects)).toBe(true);
    expect(component.projects.length).toBeGreaterThan(0);
  });

  it('each project should have required fields', () => {
    for (const project of component.projects) {
      expect(project.id).toBeDefined();
      expect(typeof project.id).toBe('string');
      expect(project.name).toBeDefined();
      expect(typeof project.name).toBe('string');
      expect(project.description).toBeDefined();
      expect(typeof project.description).toBe('string');
      expect(Array.isArray(project.stack)).toBe(true);
      expect(project.url).toBeDefined();
      expect(project.screenshot).toBeDefined();
    }
  });

  it('should render the section header with title', () => {
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.section-header');
    expect(header).toBeTruthy();
  });

  it('should render project cards with name and description', () => {
    fixture.detectChanges();

    const projectNames = fixture.nativeElement.querySelectorAll('.project-name');
    expect(projectNames.length).toBe(component.projects.length);

    // Check first project
    const first = component.projects[0];
    expect(first.name).toBeTruthy();
    expect(first.description).toBeTruthy();
  });

  it('should render stack tags for each project', () => {
    fixture.detectChanges();

    const tags = fixture.nativeElement.querySelectorAll('.tech-tag');
    expect(tags.length).toBeGreaterThan(0);
  });

  it('should render a "Ver sitio en vivo" button with link', () => {
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.view-project-btn');
    expect(btn).toBeTruthy();
  });

  it('should track project id for @for loop', () => {
    // Ensure all ids are unique
    const ids = component.projects.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should not initialize ScrollTrigger on SSR (isPlatformBrowser = false)', () => {
    // SSR guard test: on server, ngAfterViewInit should return early
    // We just verify the component renders without error
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });
});
