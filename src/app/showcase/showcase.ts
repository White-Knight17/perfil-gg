import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserMockup } from '../components/browser-mockup/browser-mockup';
import { TiltDirective } from '../directives/tilt.directive';

interface ShowcaseProject {
  id: string;
  name: string;
  description: string;
  stack: string[];
  url: string;
  screenshot: string;
}

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CommonModule, BrowserMockup, TiltDirective],
  templateUrl: './showcase.html',
  styleUrl: './showcase.css'
})
export class Showcase implements AfterViewInit, OnDestroy {
  @ViewChild('showcaseSection') showcaseSection!: ElementRef<HTMLElement>;
  @ViewChild('showcaseTrack') showcaseTrack!: ElementRef<HTMLElement>;

  private isBrowser: boolean;
  private scrollTrigger?: ScrollTrigger;

  projects: ShowcaseProject[] = [
    {
      id: 'wlop',
      name: 'WLOP Landing Page',
      description: 'Landing page inmersiva para el artista digital WLOP. Galería interactiva con animaciones suaves y diseño minimalista que resalta el arte fantástico.',
      stack: ['Angular', 'TypeScript', 'GSAP', 'Tailwind CSS'],
      url: 'https://wlop-landing-page.vercel.app/',
      screenshot: '/assets/showcase/wlop-screenshot.png'
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    gsap.registerPlugin(ScrollTrigger);

    const track = this.showcaseTrack.nativeElement;
    const section = this.showcaseSection.nativeElement;

    // Calculate total scroll distance
    const totalWidth = track.scrollWidth - window.innerWidth;

    this.scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${totalWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Move track horizontally
        gsap.set(track, { x: -self.progress * totalWidth });
      }
    });
  }

  ngOnDestroy(): void {
    this.scrollTrigger?.kill();
  }
}
