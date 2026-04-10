import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly GITHUB_USERNAME = 'White-Knight17';
  private readonly GITHUB_API_URL = `https://api.github.com/users/${this.GITHUB_USERNAME}/repos`;

  constructor(private http: HttpClient) {}

  getUserRepositories(): Observable<GitHubRepository[]> {
    return this.http.get<GitHubRepository[]>(this.GITHUB_API_URL, {
      params: {
        sort: 'updated',
        direction: 'desc',
        per_page: '6', // Get top 6 most recently updated repos
      },
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`https://api.github.com/users/${this.GITHUB_USERNAME}`);
  }
}
