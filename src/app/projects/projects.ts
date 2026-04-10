import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GithubService } from '../github';
import { GitHubRepository } from '../github';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  projects: GitHubRepository[] = [];
  loading = true;
  error: string | null = null;

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.loadGitHubProjects();
  }

  loadGitHubProjects(): void {
    this.githubService.getUserRepositories().subscribe({
      next: (repos) => {
        this.projects = repos
          .filter((repo) => !repo.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching GitHub repos:', err);
        this.error = 'No se pudieron cargar los proyectos desde GitHub';
        this.loading = false;
        this.loadSampleProjects();
      },
    });
  }

  loadSampleProjects(): void {
    this.projects = [
      {
        name: 'portfolio-landing-page',
        description: 'Landing page profesional para freelancer full-stack especialista en IA',
        html_url: `https://github.com/White-Knight17/portfolio-landing-page`,
        stargazers_count: 0,
        forks_count: 0,
        language: 'TypeScript',
        updated_at: new Date().toISOString(),
        topics: ['angular', 'typescript', 'ai', 'portfolio'],
      },
      {
        name: 'ia-agent-framework',
        description: 'Framework para crear agentes autónomos con integración de LLMs',
        html_url: `https://github.com/White-Knight17/ia-agent-framework`,
        stargazers_count: 0,
        forks_count: 0,
        language: 'TypeScript',
        updated_at: new Date().toISOString(),
        topics: ['ai', 'agents', 'llm', 'typescript'],
      },
    ] as GitHubRepository[];
    this.loading = false;
  }

  getLangClass(language: string | null): string {
    if (!language) return 'lang-default';
    const map: Record<string, string> = {
      TypeScript: 'lang-typescript',
      JavaScript: 'lang-javascript',
      Python: 'lang-python',
      HTML: 'lang-html',
      CSS: 'lang-css',
      SCSS: 'lang-scss',
    };
    return map[language] || 'lang-default';
  }
}
