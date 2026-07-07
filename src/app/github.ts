import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

export interface GitHubRepository {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  fork: boolean;
}

const GITHUB_USERNAME = 'White-Knight17';
const REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const PROFILE_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;

function authHeaders() {
  const token = environment.githubToken;
  if (!token) return {};
  return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
}

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);

  getUserRepositories(): Promise<GitHubRepository[]> {
    return firstValueFrom(this.http.get<GitHubRepository[]>(REPOS_URL, {
      ...authHeaders(),
      params: { sort: 'updated', direction: 'desc', per_page: '6' },
    }));
  }

  getUserProfile(): Promise<any> {
    return firstValueFrom(this.http.get<any>(PROFILE_URL, authHeaders()));
  }
}

/** TanStack Query hook — fetches and caches GitHub repos */
export function useGithubReposQuery() {
  const service = inject(GithubService);
  return injectQuery(() => ({
    queryKey: ['github', 'repos'],
    queryFn: () => service.getUserRepositories(),
  }));
}

/** TanStack Query hook — fetches and caches GitHub profile */
export function useGithubProfileQuery() {
  const service = inject(GithubService);
  return injectQuery(() => ({
    queryKey: ['github', 'profile'],
    queryFn: () => service.getUserProfile(),
  }));
}
