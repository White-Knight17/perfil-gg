import {
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  afterNextRender,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { gsap } from 'gsap';
import { PreloaderService } from '../services/preloader.service';
import { LenisService } from '../services/lenis.service';

/**
 * Home (Hero) component — refactored with @ViewChild instead of global CSS
 * selectors, choreographed GSAP timeline, and magnetic button effect.
 *
 * Animation sequence (triggered by PreloaderService.done signal):
 *   1. h1 title — line-level stagger (two lines)
 *   2. h2 subtitle — character-level staggered reveal
 *   3. p description — fade + slide up
 *   4. CTA buttons — staggered reveal
 *   5. Background blobs — slow rotation animation
 *   6. Avatar — subtle float animation
 *
 * Magnet buttons on CTA:
 *   - On mousemove: button follows cursor (×0.3 factor)
 *   - On mouseleave: snaps back with elastic ease
 *   - Disabled on touch devices
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnDestroy {
  // ─── View Refs ─────────────────────────────────────────────────────

  @ViewChild('heroTitle') heroTitle!: ElementRef<HTMLHeadingElement>;
  @ViewChild('heroSubtitle') heroSubtitle!: ElementRef<HTMLHeadingElement>;
  @ViewChild('heroDescription') heroDescription!: ElementRef<HTMLParagraphElement>;
  @ViewChild('ctaGroup') ctaGroup!: ElementRef<HTMLDivElement>;
  @ViewChildren('ctaBtn') ctaButtons!: QueryList<ElementRef<HTMLAnchorElement>>;
  @ViewChild('avatarRef') avatarRef!: ElementRef<HTMLDivElement>;
  @ViewChild('blob1') blob1!: ElementRef<HTMLDivElement>;
  @ViewChild('blob2') blob2!: ElementRef<HTMLDivElement>;
  @ViewChild('blob3') blob3!: ElementRef<HTMLDivElement>;

  // ─── State ─────────────────────────────────────────────────────────

  private isTouchDevice = false; // set in afterNextRender
  private heroStarted = false;

  // GSAP instances for cleanup
  private subtitleTween?: gsap.core.Tween;
  private descriptionTween?: gsap.core.Tween;
  private ctaTweens: gsap.core.Tween[] = [];
  private blobRotationTween?: gsap.core.Tween;
  private avatarFloatTween?: gsap.core.Tween;
  private magneticTweens: gsap.core.Tween[] = [];
  private readonly magneticCleanups: Array<() => void> = [];
  private preloaderSub?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly preloaderService: PreloaderService,
    private readonly lenisService: LenisService,
  ) {
    afterNextRender(() => {
      this.isTouchDevice = 'ontouchstart' in window;

      // Wait for preloader completion signal
      this.preloaderSub = setTimeout(() => this.checkPreloader(), 100);
    });
  }

  ngOnDestroy(): void {
    // Kill all GSAP instances
    this.subtitleTween?.kill();
    this.descriptionTween?.kill();
    this.ctaTweens.forEach((t) => t.kill());
    this.blobRotationTween?.kill();
    this.avatarFloatTween?.kill();
    this.magneticTweens.forEach((t) => t.kill());

    // Remove magnetic event listeners
    this.magneticCleanups.forEach((cleanup) => cleanup());

    // Clear timers
    if (this.preloaderSub) clearTimeout(this.preloaderSub);
  }

  // ─── Public ───────────────────────────────────────────────────────

  scrollToSection(sectionId: string): void {
    // Use Lenis smooth scroll when available, fall back to native
    if (this.lenisService.instance) {
      this.lenisService.scrollTo(`#${sectionId}`, { offset: -80 });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ─── Animation Orchestration ──────────────────────────────────────

  /**
   * Polls PreloaderService.done() signal. Once true, starts the full
   * hero animation sequence. Uses rAF-based polling to avoid
   * tight-loop checking.
   */
  private checkPreloader(): void {
    if (this.preloaderService.done()) {
      this.triggerHeroAnimation();
    } else {
      // Check again on next frame instead of tight-looping
      this.preloaderSub = setTimeout(() => this.checkPreloader(), 50);
    }
  }

  private triggerHeroAnimation(): void {
    if (this.heroStarted) return;
    this.heroStarted = true;

    // Small delay to let the preloader fade-out transition settle
    requestAnimationFrame(() => {
      this.animateTitle();
      this.animateSubtitle();
      this.animateDescription();
      this.animateCtaButtons();
      this.animateBlobs();
      this.animateAvatar();
      this.initMagneticButtons();
    });
  }

  // ─── Title (h1) — line stagger ────────────────────────────────────

  private animateTitle(): void {
    const children = this.heroTitle.nativeElement.children;
    if (!children.length) return;

    // Use set + to instead of from for robustness with SSR hydration
    gsap.set(children, { y: 50, opacity: 0 });
    gsap.to(children, {
      y: 0,
      opacity: 1,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
    });
  }

  // ─── Subtitle (h2) — character stagger ────────────────────────────

  private animateSubtitle(): void {
    const el = this.heroSubtitle.nativeElement;
    const text = el.textContent || '';
    el.innerHTML = '';

    // Wrap each character in a span
    for (const char of text) {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      el.appendChild(span);
    }

    // Use set + to instead of from for robustness with SSR hydration
    gsap.set(el.children, { opacity: 0, y: 20, rotateX: -90 });
    this.subtitleTween = gsap.to(el.children, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.02,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 0.15,
    });
  }

  // ─── Description (p) — fade + slide up ────────────────────────────

  private animateDescription(): void {
    // Use set + to instead of from for robustness with SSR hydration
    gsap.set(this.heroDescription.nativeElement, { y: 20, opacity: 0 });
    this.descriptionTween = gsap.to(this.heroDescription.nativeElement, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.35,
    });
  }

  // ─── CTA Buttons — staggered reveal ───────────────────────────────

  private animateCtaButtons(): void {
    this.ctaButtons.forEach((btn, i) => {
      // Use set + to instead of from for robustness with SSR hydration
      gsap.set(btn.nativeElement, { y: 30, opacity: 0 });
      const tween = gsap.to(btn.nativeElement, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.55 + i * 0.15,
      });
      this.ctaTweens.push(tween);
    });
  }

  // ─── Background Blobs — slow rotation / float ─────────────────────

  private animateBlobs(): void {
    [this.blob1, this.blob2, this.blob3].forEach((blob, i) => {
      if (!blob) return;

      const dir = i % 2 === 0 ? 1 : -1;
      this.blobRotationTween = gsap.to(blob.nativeElement, {
        rotation: dir * 15,
        x: dir * 10,
        y: -10,
        duration: 4 + i,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.5,
      });
    });
  }

  // ─── Avatar — subtle float ────────────────────────────────────────

  private animateAvatar(): void {
    if (!this.avatarRef) return;

    this.avatarFloatTween = gsap.to(this.avatarRef.nativeElement, {
      y: -6,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1,
    });
  }

  // ─── Magnetic Button Effect ───────────────────────────────────────

  private initMagneticButtons(): void {
    if (this.isTouchDevice) return;

    this.ctaButtons.forEach((btnRef) => {
      this.applyMagneticEffect(btnRef.nativeElement);
    });
  }

  private applyMagneticEffect(btn: HTMLAnchorElement): void {
    // quickTo is the most performant approach for mouse-follow
    const xTo = gsap.quickTo(btn, 'x', {
      duration: 0.3,
      ease: 'power2.out',
    });
    const yTo = gsap.quickTo(btn, 'y', {
      duration: 0.3,
      ease: 'power2.out',
    });

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      xTo(x);
      yTo(y);
    };

    const onLeave = () => {
      const snapBack = gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
      this.magneticTweens.push(snapBack);
    };

    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);

    // Store cleanup
    this.magneticCleanups.push(() => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    });
  }
}
