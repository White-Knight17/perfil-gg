import {
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
  afterNextRender,
} from '@angular/core';
import { gsap } from 'gsap';
import { PreloaderService } from '../services/preloader.service';
import { AnimationConfigService } from '../services/animation-config.service';

/**
 * Preloader component — full-screen intro animation.
 *
 * Sequence:
 *   1. "GG" avatar scales from 0 → 1 (back.out easing)
 *   2. Pulse glow effect around avatar (continuous yoyo)
 *   3. "German Giorgio" fades in below
 *   4. "Desarrollador Full-Stack" reveals with staggered character animation
 *   5. Minimum display time enforced (1.5s from start)
 *   6. Preloader zooms out / fades out
 *   7. Calls PreloaderService.complete() to signal hero animation can start
 *
 * SSR-guarded: all animation code runs only in browser.
 */
@Component({
  selector: 'app-preloader',
  standalone: true,
  templateUrl: './preloader.html',
  styleUrl: './preloader.css',
})
export class Preloader implements OnDestroy {
  @ViewChild('preloaderRef') preloaderRef!: ElementRef<HTMLDivElement>;
  @ViewChild('avatarWrapperRef') avatarWrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('pulseRef') pulseRef!: ElementRef<HTMLDivElement>;
  @ViewChild('nameRef') nameRef!: ElementRef<HTMLHeadingElement>;
  @ViewChild('titleRef') titleRef!: ElementRef<HTMLParagraphElement>;

  private introTimeline?: gsap.core.Timeline;
  private outroTimeline?: gsap.core.Timeline;
  private pulseTween?: gsap.core.Tween;
  private titleStaggerTween?: gsap.core.Tween;
  private startTime = 0;

  constructor(
    private readonly preloaderService: PreloaderService,
    private readonly animationConfig: AnimationConfigService,
  ) {
    afterNextRender(() => {
      this.startTime = performance.now();

      // Respect reduced motion: show the final state briefly and get out
      // of the way instead of running the full choreography.
      if (this.animationConfig.reducedMotion()) {
        gsap.set(this.preloaderRef.nativeElement, {
          autoAlpha: 0,
          pointerEvents: 'none',
        });
        this.preloaderService.complete();
        return;
      }

      this.animateIntro();
    });
  }

  ngOnDestroy(): void {
    this.introTimeline?.kill();
    this.outroTimeline?.kill();
    this.pulseTween?.kill();
    this.titleStaggerTween?.kill();
  }

  // ─── Intro Animation ──────────────────────────────────────────────

  private animateIntro(): void {
    // Set initial states
    gsap.set(this.preloaderRef.nativeElement, { pointerEvents: 'auto' });
    gsap.set(this.avatarWrapperRef.nativeElement, { scale: 0, opacity: 0 });
    gsap.set(this.nameRef.nativeElement, { opacity: 0, y: 20 });
    gsap.set(this.titleRef.nativeElement, { opacity: 0 });

    // Build the title as character spans for stagger reveal
    this.prepareTitleStagger();

    this.introTimeline = gsap.timeline({
      onComplete: () => this.onIntroComplete(),
    });

    // 1. Monogram settles in
    this.introTimeline.to(this.avatarWrapperRef.nativeElement, {
      scale: 1,
      opacity: 1,
      duration: 0.7,
      ease: 'power3.out',
    });

    // 2. Start pulse glow (overlaps with subsequent steps)
    this.startPulseGlow();

    // 3. Name fades in (overlaps end of avatar animation)
    this.introTimeline.to(
      this.nameRef.nativeElement,
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
      },
      '-=0.35',
    );

    // 4. Title staggered character reveal (overlaps name animation)
    this.titleStaggerTween = gsap.from(this.titleRef.nativeElement.children, {
      opacity: 0,
      y: 8,
      stagger: 0.018,
      duration: 0.35,
      ease: 'power2.out',
    });

    this.introTimeline.add(this.titleStaggerTween, '-=0.25');
  }

  /** Wrap each character in a <span> for stagger animation */
  private prepareTitleStagger(): void {
    const el = this.titleRef.nativeElement;
    const text = el.textContent || '';
    el.textContent = '';
    el.style.opacity = '1';

    for (const char of text) {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      el.appendChild(span);
    }
  }

  /** Continuous pulsing glow around the monogram */
  private startPulseGlow(): void {
    this.pulseTween = gsap.to(this.pulseRef.nativeElement, {
      boxShadow:
        '0 0 28px rgba(155,157,255,0.22), 0 0 60px rgba(155,157,255,0.10)',
      duration: 1.6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }

  // ─── Outro (minimum display + transition) ─────────────────────────

  private onIntroComplete(): void {
    const elapsed = performance.now() - this.startTime;
    const remaining = Math.max(0, 1500 - elapsed);

    setTimeout(() => this.animateOut(), remaining);
  }

  private animateOut(): void {
    // Stop pulse loop
    this.pulseTween?.kill();

    this.outroTimeline = gsap.timeline({
      onComplete: () => {
        this.preloaderService.complete();
      },
    });

    this.outroTimeline.to(this.preloaderRef.nativeElement, {
      scale: 1.1,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    });

    // Let clicks pass through once the overlay starts fading
    this.outroTimeline.set(this.preloaderRef.nativeElement, {
      pointerEvents: 'none',
    }, 0);
  }
}
