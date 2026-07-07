import { TestBed } from '@angular/core/testing';
import { GithubService } from './github';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('GithubService', () => {
  let service: GithubService;
  let httpClient: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    httpClient = { get: vi.fn() };
    TestBed.configureTestingModule({ providers: [GithubService, { provide: HttpClient, useValue: httpClient }] });
    service = TestBed.inject(GithubService);
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('should fetch repos as promise', async () => {
    httpClient.get.mockReturnValue(of([{ name: 'test', id: 1 }]));
    const repos = await service.getUserRepositories();
    expect(repos).toEqual([{ name: 'test', id: 1 }]);
  });

  it('should fetch profile as promise', async () => {
    httpClient.get.mockReturnValue(of({ login: 'White-Knight17' }));
    const profile = await service.getUserProfile();
    expect(profile.login).toBe('White-Knight17');
  });
});
