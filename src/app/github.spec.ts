import { TestBed } from '@angular/core/testing';
import { GithubService } from './github';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('GithubService', () => {
  let service: GithubService;
  let httpClient: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    httpClient = { get: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        GithubService,
        { provide: HttpClient, useValue: httpClient },
      ],
    });

    service = TestBed.inject(GithubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user repositories from GitHub API', () => {
    const mockRepos = [{ name: 'test-repo', id: 1 }];
    httpClient.get.mockReturnValue(of(mockRepos));

    service.getUserRepositories().subscribe((repos) => {
      expect(repos).toEqual(mockRepos);
    });

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://api.github.com/users/White-Knight17/repos',
      expect.objectContaining({
        params: expect.objectContaining({
          sort: 'updated',
          direction: 'desc',
          per_page: '6',
        }),
      }),
    );
  });

  it('should fetch user profile from GitHub API', () => {
    const mockProfile = { login: 'White-Knight17', id: 1 };
    httpClient.get.mockReturnValue(of(mockProfile));

    service.getUserProfile().subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://api.github.com/users/White-Knight17',
    );
  });

  it('should return repos with correct interface shape', () => {
    const mockRepos = [
      {
        name: 'test-repo',
        description: 'A test repo',
        html_url: 'https://github.com/user/test-repo',
        stargazers_count: 5,
        forks_count: 2,
        language: 'TypeScript',
        updated_at: '2024-01-01T00:00:00Z',
        topics: ['angular', 'typescript'],
        fork: false,
      },
    ];
    httpClient.get.mockReturnValue(of(mockRepos));

    service.getUserRepositories().subscribe((repos) => {
      const repo = repos[0];
      expect(repo.name).toBe('test-repo');
      expect(repo.description).toBe('A test repo');
      expect(repo.html_url).toBe('https://github.com/user/test-repo');
      expect(repo.stargazers_count).toBe(5);
      expect(repo.forks_count).toBe(2);
      expect(repo.language).toBe('TypeScript');
      expect(repo.topics).toContain('angular');
      expect(repo.fork).toBe(false);
    });
  });
});
