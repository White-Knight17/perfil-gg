import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';
import { AnimationConfigService } from '../services/animation-config.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [MatIconModule, ScrollRevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills implements AfterViewInit, OnDestroy {
  @ViewChild('skillsSection') skillsSection!: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;
  private scrollTrigger?: ScrollTrigger;
  private barTweens: gsap.core.Tween[] = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly animationConfig: AnimationConfigService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.animateSkillBars();
  }

  ngOnDestroy(): void {
    this.barTweens.forEach((t) => t.kill());
    this.barTweens = [];
    this.scrollTrigger?.kill();
  }

  /**
   * Animate all `.skill-fill` bars from 0% to their target percentage
   * using GSAP ScrollTrigger scrub.
   */
  private animateSkillBars(): void {
    const fills: HTMLElement[] = Array.from(
      this.skillsSection.nativeElement.querySelectorAll('.skill-fill'),
    );
    if (!fills.length) return;

    // Store target widths and set initial to 0
    const targets: { el: HTMLElement; level: number }[] = fills.map((el) => {
      const level = parseInt(el.dataset['level'] ?? '0', 10);
      el.style.width = '0%';
      return { el, level };
    });

    if (this.animationConfig.reducedMotion()) {
      targets.forEach(({ el, level }) => {
        el.style.width = `${level}%`;
      });
      return;
    }

    targets.forEach(({ el, level }) => {
      const tween = gsap.to(el, {
        width: `${level}%`,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.skillsSection.nativeElement,
          start: 'top 75%',
          toggleActions: 'play none none none',
          scroller: document.body, // Required: Lenis uses body as scroller proxy
        },
      });
      this.barTweens.push(tween);
    });
  }

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
