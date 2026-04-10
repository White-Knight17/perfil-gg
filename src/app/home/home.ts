import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.animateHeroElements();
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private animateHeroElements(): void {
    gsap.fromTo(
      '.hero h1',
      { y: 100, opacity: 0 },
      { duration: 1, y: 0, opacity: 1, ease: 'power3.out', delay: 0.2 },
    );

    gsap.fromTo(
      '.hero h2',
      { y: 80, opacity: 0 },
      { duration: 1, y: 0, opacity: 1, ease: 'power3.out', delay: 0.4 },
    );

    gsap.fromTo(
      '.hero p',
      { y: 60, opacity: 0 },
      { duration: 1, y: 0, opacity: 1, ease: 'power3.out', delay: 0.6 },
    );

    gsap.fromTo(
      '.hero .btn-group a',
      { y: 40, opacity: 0 },
      { duration: 0.8, y: 0, opacity: 1, ease: 'power3.out', delay: 0.8, stagger: 0.15 },
    );
  }
}
