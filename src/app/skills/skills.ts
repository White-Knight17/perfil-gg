import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';

export interface Skill {
  name: string;
  level: number;
}

export type SkillTier = 'Core' | 'Avanzado' | 'Complementario';

export interface SkillGroup {
  tier: SkillTier;
  skills: Skill[];
}

const TIER_ORDER: readonly SkillTier[] = ['Core', 'Avanzado', 'Complementario'];

/** Maps the existing 0-100 level onto an honest three-tier label. */
function tierFor(level: number): SkillTier {
  if (level >= 85) return 'Core';
  if (level >= 75) return 'Avanzado';
  return 'Complementario';
}

/** Groups a skill list by tier, preserving order and dropping empty tiers. */
function groupSkills(skills: Skill[]): SkillGroup[] {
  return TIER_ORDER.map((tier) => ({
    tier,
    skills: skills.filter((skill) => tierFor(skill.level) === tier),
  })).filter((group) => group.skills.length > 0);
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  readonly frontendSkills: Skill[] = [
    { name: 'Angular', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'SASS / CSS3', level: 80 },
    { name: 'HTML5', level: 95 },
    { name: 'Tailwind CSS', level: 75 },
    { name: 'GSAP', level: 70 },
    { name: 'Angular Material', level: 85 },
  ];

  readonly backendSkills: Skill[] = [
    { name: 'NestJS', level: 85 },
    { name: 'Node.js', level: 90 },
    { name: 'Express', level: 80 },
    { name: 'Prisma ORM', level: 75 },
    { name: 'JWT Security', level: 80 },
    { name: 'RESTful APIs', level: 90 },
  ];

  readonly databaseSkills: Skill[] = [
    { name: 'PostgreSQL', level: 80 },
    { name: 'MySQL', level: 75 },
    { name: 'MongoDB', level: 70 },
  ];

  readonly aiSkills: Skill[] = [
    { name: 'Agentes Autónomos', level: 85 },
    { name: 'Prompt Engineering', level: 80 },
    { name: 'Integración de LLMs', level: 75 },
    { name: 'Machine Learning', level: 70 },
    { name: 'Procesamiento de Lenguaje Natural', level: 75 },
  ];

  readonly toolsSkills = [
    { name: 'Docker', class: 'fa-brands fa-docker tool-icon-docker' },
    { name: 'Git / GitHub', class: 'fa-brands fa-github tool-icon-github' },
    { name: 'Metodologías Ágiles', class: 'fa-solid fa-rotate tool-icon-agile' },
    { name: 'UML / DER', class: 'fa-solid fa-diagram-project tool-icon-uml' },
  ];

  readonly frontendGroups = groupSkills(this.frontendSkills);
  readonly backendGroups = groupSkills(this.backendSkills);
  readonly databaseGroups = groupSkills(this.databaseSkills);
  readonly aiGroups = groupSkills(this.aiSkills);
}
