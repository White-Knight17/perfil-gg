import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly GITHUB_USERNAME = 'White-Knight17';
  private readonly GITHUB_API_URL = `https://api.github.com/users/${this.GITHUB_USERNAME}/repos`;

  constructor(private http: HttpClient) {}

  private get headers(): { headers?: HttpHeaders } {
    const token = environment.githubToken;
    if (!token) return {};
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getUserRepositories(): Observable<GitHubRepository[]> {
    return this.http.get<GitHubRepository[]>(this.GITHUB_API_URL, {
      ...this.headers,
      params: {
        sort: 'updated',
        direction: 'desc',
        per_page: '6',
      },
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(
      `https://api.github.com/users/${this.GITHUB_USERNAME}`,
      this.headers,
    );
  }
}
