import { Component, OnDestroy, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserMockup } from '../components/browser-mockup/browser-mockup';
import { AnimationConfigService } from '../services/animation-config.service';

interface ShowcaseProject {
  id: string;
  name: string;
  description: string;
  stack: string[];
  url: string;
  screenshot: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [BrowserMockup],
  templateUrl: './showcase.html',
  styleUrl: './showcase.css',
})
export class Showcase implements OnDestroy {
  @ViewChild('showcaseSection') showcaseSection!: ElementRef<HTMLElement>;
  @ViewChild('showcaseTrack') showcaseTrack!: ElementRef<HTMLElement>;
  @ViewChild('showcaseProgress') showcaseProgress!: ElementRef<HTMLElement>;

  private scrollTrigger?: ScrollTrigger;

  projects: ShowcaseProject[] = [
    {
      id: 'wlop',
      name: 'WLOP Landing Page',
      description:
        'Landing page inmersiva para el artista digital WLOP. Galería interactiva con animaciones suaves y diseño minimalista que resalta el arte fantástico.',
      stack: ['Angular', 'TypeScript', 'GSAP', 'Tailwind CSS'],
      url: 'https://wlop-landing-page.vercel.app/',
      screenshot: '/assets/showcase/wlop-screenshot.webp',
      width: 1600,
      height: 835,
    },
    {
      id: 'clima',
      name: 'ClimaProject',
      description:
        'Aplicación del clima con búsqueda de ciudades en tiempo real. Interfaz limpia y responsiva con animaciones suaves y condiciones meteorológicas dinámicas.',
      stack: ['Angular', 'TypeScript', 'Tailwind CSS', 'Lenis'],
      url: 'https://clima-beta-seven.vercel.app/',
      screenshot: '/assets/showcase/clima-screenshot.webp',
      width: 1600,
      height: 743,
    },
    {
      id: 'brawl',
      name: 'BrawlStats',
      description:
        'Prototipo de plataforma de estadísticas para Brawl Stars. Dashboard con animaciones GSAP que cargan progresivamente al entrar.',
      stack: ['Angular', 'TypeScript', 'Tailwind CSS', 'GSAP'],
      url: 'https://brawl-proto.vercel.app/',
      screenshot: '/assets/showcase/brawl-screenshot.webp',
      width: 1600,
      height: 743,
    },
  ];

  constructor(private readonly animationConfig: AnimationConfigService) {
    afterNextRender(() => {
      const section = this.showcaseSection.nativeElement;

      // Horizontal pinning is a strong effect; on small screens and for
      // reduced-motion users the section degrades to a vertical stack.
      const isCompact =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(max-width: 1023px)').matches;
      if (isCompact || this.animationConfig.reducedMotion()) {
        section.classList.add('showcase-static');
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const track = this.showcaseTrack.nativeElement;
      const progressFill = this.showcaseProgress.nativeElement;

      const xTo = gsap.quickTo(track, 'x', { duration: 0.5, ease: 'power2.out' });
      const progressTo = gsap.quickTo(progressFill, 'scaleX', {
        duration: 0.3,
        ease: 'power2.out',
      });

      const travelDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      this.scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${travelDistance() * 1.1}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        scroller: document.body, // Required: Lenis uses body as scroller proxy
        onUpdate: (self) => {
          xTo(-self.progress * travelDistance());
          progressTo(self.progress);
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.scrollTrigger?.kill();
  }
}
