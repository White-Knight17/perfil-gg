import {
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  afterNextRender,
} from '@angular/core';
import { gsap } from 'gsap';
import { PreloaderService } from '../services/preloader.service';
import { LenisService } from '../services/lenis.service';
import { AnimationConfigService } from '../services/animation-config.service';

/**
 * Home (Hero) component.
 *
 * Content is rendered visible by default; the intro timeline only hides
 * elements right before animating them, so a failed/absent preloader can
 * never leave the hero blank.
 *
 * Sequence (triggered by PreloaderService.done signal):
 *   1. h1 — line-mask reveal (each line slides up out of its mask)
 *   2. h2 + paragraph — fade + short rise
 *   3. CTAs — staggered rise
 *   4. Identity card — fade + rise
 *
 * Micro-interactions:
 *   - Magnetic CTA buttons (desktop pointer only, 0.16 factor)
 *   - Slow floating monogram
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnDestroy {
  // ─── View refs ────────────────────────────────────────────────────

  @ViewChild('heroTitle') heroTitle!: ElementRef<HTMLHeadingElement>;
  @ViewChild('heroSubtitle') heroSubtitle!: ElementRef<HTMLHeadingElement>;
  @ViewChild('heroDescription') heroDescription!: ElementRef<HTMLParagraphElement>;
  @ViewChild('ctaGroup') ctaGroup!: ElementRef<HTMLDivElement>;
  @ViewChildren('ctaBtn') ctaButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChild('avatarRef') avatarRef!: ElementRef<HTMLDivElement>;
  @ViewChild('profileCard') profileCard!: ElementRef<HTMLElement>;

  // ─── State ────────────────────────────────────────────────────────

  private isTouchDevice = false;
  private heroStarted = false;

  private introTimeline?: gsap.core.Timeline;
  private avatarFloatTween?: gsap.core.Tween;
  private magneticTweens: gsap.core.Tween[] = [];
  private readonly magneticCleanups: Array<() => void> = [];
  private pollTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly preloaderService: PreloaderService,
    private readonly lenisService: LenisService,
    private readonly animationConfig: AnimationConfigService,
  ) {
    afterNextRender(() => {
      this.isTouchDevice = window.matchMedia('(hover: none)').matches;
      this.pollTimer = setTimeout(() => this.checkPreloader(), 100);
    });
  }

  ngOnDestroy(): void {
    this.introTimeline?.kill();
    this.avatarFloatTween?.kill();
    this.magneticTweens.forEach((t) => t.kill());
    this.magneticCleanups.forEach((cleanup) => cleanup());

    if (this.pollTimer) clearTimeout(this.pollTimer);
  }

  // ─── Public ───────────────────────────────────────────────────────

  scrollToSection(sectionId: string): void {
    if (this.lenisService.instance) {
      this.lenisService.scrollTo(`#${sectionId}`, { offset: -80 });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ─── Orchestration ────────────────────────────────────────────────

  /** Waits for the preloader to finish before starting the intro. */
  private checkPreloader(): void {
    if (this.preloaderService.done()) {
      this.triggerHeroAnimation();
    } else {
      this.pollTimer = setTimeout(() => this.checkPreloader(), 50);
    }
  }

  private triggerHeroAnimation(): void {
    if (this.heroStarted) return;
    this.heroStarted = true;

    requestAnimationFrame(() => {
      if (this.animationConfig.reducedMotion()) {
        this.initMagneticButtons();
        return;
      }

      const lines = this.heroTitle.nativeElement.querySelectorAll<HTMLElement>('.line');

      this.introTimeline = gsap
        .timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
        .set(lines, { yPercent: 110, opacity: 0 })
        .set(
          [this.heroSubtitle.nativeElement, this.heroDescription.nativeElement],
          { y: 16, opacity: 0 },
        )
        .set(this.ctaGroup.nativeElement, { y: 14, opacity: 0 })
        .set(this.profileCard.nativeElement, { y: 22, opacity: 0 })
        .to(lines, { yPercent: 0, opacity: 1, stagger: 0.08 })
        .to(
          [this.heroSubtitle.nativeElement, this.heroDescription.nativeElement],
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.1 },
          '-=0.55',
        )
        .to(this.ctaGroup.nativeElement, { y: 0, opacity: 1, duration: 0.7 }, '-=0.45')
        .to(this.profileCard.nativeElement, { y: 0, opacity: 1, duration: 0.9 }, '-=0.75')
        .add(() => this.initMagneticButtons());

      this.animateAvatar();
    });
  }

  // ─── Ambient motion ───────────────────────────────────────────────

  private animateAvatar(): void {
    if (!this.avatarRef) return;

    this.avatarFloatTween = gsap.to(this.avatarRef.nativeElement, {
      y: -5,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1.2,
    });
  }

  /**
   * Nudges the CSS-driven light pools so they feel alive instead of
   * mechanically looping. Transform-only, so it stays on the compositor.
   */
  private animateBackground(): void {
    // CSS keyframes already provide the drift; nothing to do here unless
    // we later want pointer-reactive parallax. Kept as an extension point.
  }

  // ─── Magnetic buttons ─────────────────────────────────────────────

  private initMagneticButtons(): void {
    if (this.isTouchDevice || this.animationConfig.reducedMotion()) return;

    this.ctaButtons.forEach((btnRef) => this.applyMagneticEffect(btnRef.nativeElement));
  }

  private applyMagneticEffect(btn: HTMLButtonElement): void {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMove = (event: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      xTo((event.clientX - rect.left - rect.width / 2) * 0.16);
      yTo((event.clientY - rect.top - rect.height / 2) * 0.16);
    };

    const onLeave = () => {
      this.magneticTweens.push(
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' }),
      );
    };

    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);

    this.magneticCleanups.push(() => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    });
  }
}
