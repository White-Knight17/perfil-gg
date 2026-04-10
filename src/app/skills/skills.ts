import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  frontendSkills = [
    { name: 'Angular', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'SASS / CSS3', level: 80 },
    { name: 'HTML5', level: 95 },
    { name: 'Tailwind CSS', level: 75 },
    { name: 'GSAP', level: 70 },
    { name: 'Angular Material', level: 85 },
  ];

  backendSkills = [
    { name: 'NestJS', level: 85 },
    { name: 'Node.js', level: 90 },
    { name: 'Express', level: 80 },
    { name: 'Prisma ORM', level: 75 },
    { name: 'JWT Security', level: 80 },
    { name: 'RESTful APIs', level: 90 },
  ];

  databaseSkills = [
    { name: 'PostgreSQL', level: 80 },
    { name: 'MySQL', level: 75 },
    { name: 'MongoDB', level: 70 },
  ];

  aiSkills = [
    { name: 'Agentes Autónomos', level: 85 },
    { name: 'Prompt Engineering', level: 80 },
    { name: 'Integración de LLMs', level: 75 },
    { name: 'Machine Learning', level: 70 },
    { name: 'Procesamiento de Lenguaje Natural', level: 75 },
  ];

  toolsSkills = [
    { name: 'Docker', class: 'fa-brands fa-docker tool-icon-docker' },
    { name: 'Git / GitHub', class: 'fa-brands fa-github tool-icon-github' },
    { name: 'Metodologías Ágiles', class: 'fa-solid fa-rotate tool-icon-agile' },
    { name: 'UML / DER', class: 'fa-solid fa-diagram-project tool-icon-uml' },
  ];
}
