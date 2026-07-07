import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Projects } from './projects';
import { GithubService } from '../github';
import { of, throwError } from 'rxjs';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

vi.mock('gsap', () => ({ gsap: { to: vi.fn(() => ({ kill: vi.fn() })), from: vi.fn(() => ({ kill: vi.fn() })), fromTo: vi.fn(() => ({ kill: vi.fn(), scrollTrigger: { kill: vi.fn() } })), set: vi.fn(), timeline: () => ({ to: vi.fn().mockReturnThis(), from: vi.fn().mockReturnThis(), add: vi.fn().mockReturnThis(), kill: vi.fn() }), registerPlugin: vi.fn(), quickTo: () => vi.fn(), killTweensOf: vi.fn() } }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { create: vi.fn(() => ({ kill: vi.fn() })), refresh: vi.fn(), kill: vi.fn() } }));

const mockRepos = [
  { name: 'repo-1', description: 'First repo', html_url: 'https://github.com/user/repo-1', stargazers_count: 5, forks_count: 2, language: 'TypeScript', updated_at: '2024-01-01T00:00:00Z', topics: ['angular'], fork: false },
  { name: 'repo-2', description: 'Second repo', html_url: 'https://github.com/user/repo-2', stargazers_count: 3, forks_count: 1, language: 'Python', updated_at: '2024-01-02T00:00:00Z', topics: ['ai'], fork: false },
  { name: 'forked-repo', description: 'Forked repo', html_url: 'https://github.com/other/forked-repo', stargazers_count: 0, forks_count: 0, language: null, updated_at: '2024-01-03T00:00:00Z', topics: [], fork: true },
];

describe('Projects', () => {
  let component: Projects;
  let fixture: ComponentFixture<Projects>;
  let githubService: { getUserRepositories: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    githubService = { getUserRepositories: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Projects],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: GithubService, useValue: githubService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Projects);
    component = fixture.componentInstance;
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should start with loading=true', () => expect(component.loading).toBe(true));

  it('should fetch and display repos on init', () => {
    githubService.getUserRepositories.mockReturnValue(of(mockRepos));
    fixture.detectChanges();
    expect(component.loading).toBe(false);
    expect(component.projects.length).toBe(2);
    expect(component.projects[0].name).toBe('repo-1');
  });

  it('should sort repos by stargazers_count descending', () => {
    githubService.getUserRepositories.mockReturnValue(of(mockRepos));
    fixture.detectChanges();
    expect(component.projects[0].stargazers_count).toBe(5);
    expect(component.projects[1].stargazers_count).toBe(3);
  });

  it('should fallback to sample data on API error', () => {
    githubService.getUserRepositories.mockReturnValue(throwError(() => new Error('API error')));
    fixture.detectChanges();
    expect(component.loading).toBe(false);
    expect(component.error).toBeTruthy();
    expect(component.projects.length).toBeGreaterThan(0);
  });

  it('should retry after error', () => {
    githubService.getUserRepositories.mockReturnValueOnce(throwError(() => new Error('API error'))).mockReturnValueOnce(of(mockRepos));
    fixture.detectChanges();
    component.loadGitHubProjects();
    expect(component.error).toBeNull();
    expect(component.projects.length).toBe(2);
  });

  it('should return correct language class', () => {
    expect(component.getLangClass('TypeScript')).toBe('lang-typescript');
    expect(component.getLangClass('Go')).toBe('lang-default');
    expect(component.getLangClass(null)).toBe('lang-default');
  });
});
