import {
  Directive,
  ElementRef,
  inject,
  input,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationConfigService } from '../services/animation-config.service';

/**
 * ScrollRevealDirective — animates element opacity and translation
 * when it scrolls into the viewport.
 *
 * Usage:
 * ```html
 * <div appScrollReveal direction="left" [delay]="0.2" [duration]="1">
 *   Content fades in from the left
 * </div>
 * ```
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly animationConfig = inject(AnimationConfigService);

  /** Direction from which the element enters */
  readonly direction = input<'up' | 'down' | 'left' | 'right'>('up');

  /** Delay before the animation starts (seconds) */
  readonly delay = input(0);

  /** Duration of the reveal animation (seconds) */
  readonly duration = input(0.8);

  /** Distance the element travels (pixels) */
  readonly distance = input(50);

  private animation?: gsap.core.Tween;
  private scrollTriggerInstance?: ScrollTrigger;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.animationConfig.reducedMotion()) return;

    const transforms: Record<string, { x?: number; y?: number }> = {
      up: { y: this.distance() },
      down: { y: -this.distance() },
      left: { x: this.distance() },
      right: { x: -this.distance() },
    };

    this.animation = gsap.from(this.el.nativeElement, {
      ...transforms[this.direction()],
      opacity: 0,
      duration: this.duration(),
      delay: this.delay(),
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top 85%',
        end: 'top 30%',
        toggleActions: 'play none none reverse',
        scroller: document.body, // Required: Lenis uses body as scroller proxy
      },
    });

    this.scrollTriggerInstance = this.animation.scrollTrigger as ScrollTrigger;
  }

  ngOnDestroy(): void {
    this.animation?.kill();
    this.scrollTriggerInstance?.kill();
  }
}
