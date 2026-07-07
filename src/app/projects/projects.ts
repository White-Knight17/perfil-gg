import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';
import { StaggerListDirective } from '../directives/stagger-list.directive';
import { CounterAnimationDirective } from '../directives/counter-animation.directive';
import { TiltDirective } from '../directives/tilt.directive';
import { useGithubReposQuery, type GitHubRepository } from '../github';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    ScrollRevealDirective, StaggerListDirective,
    CounterAnimationDirective, TiltDirective,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  readonly query = useGithubReposQuery();

  readonly isLoading = computed(() => this.query.isPending());
  readonly isError = computed(() => this.query.isError());
  readonly errorMessage = computed(() =>
    this.query.error() ? 'No se pudieron cargar los proyectos desde GitHub' : null,
  );

  readonly projects = computed(() => {
    const repos = this.query.data() ?? [];
    return repos
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);
  });

  readonly isEmpty = computed(() => !this.isLoading() && this.projects().length === 0);

  retry(): void {
    this.query.refetch();
  }

  getLangClass(language: string | null): string {
    if (!language) return 'lang-default';
    const map: Record<string, string> = {
      TypeScript: 'lang-typescript', JavaScript: 'lang-javascript',
      Python: 'lang-python', HTML: 'lang-html', CSS: 'lang-css', SCSS: 'lang-scss',
    };
    return map[language] || 'lang-default';
  }
}
