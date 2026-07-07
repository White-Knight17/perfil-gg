import {
  Directive,
  ElementRef,
  inject,
  input,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationConfigService } from '../services/animation-config.service';

/**
 * ParallaxDirective — smooth parallax scrolling effect using GSAP
 * ScrollTrigger with scrub.
 *
 * Runs entirely outside Angular zone for performance.
 *
 * Usage:
 * ```html
 * <section class="relative h-[600px] overflow-hidden">
 *   <img appParallax [speed]="0.3" direction="up" src="bg.jpg"
 *        class="absolute inset-0 object-cover" />
 * </section>
 * ```
 */
@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly animationConfig = inject(AnimationConfigService);

  /** Parallax speed multiplier (0 = static, negative = opposite direction) */
  readonly speed = input(0.3);

  /** Direction of parallax movement */
  readonly direction = input<'up' | 'down'>('up');

  private animation?: gsap.core.Tween;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.animationConfig.reducedMotion()) return;

    this.ngZone.runOutsideAngular(() => {
      const yValue =
        this.direction() === 'up'
          ? this.speed() * 100
          : -(this.speed() * 100);

      this.animation = gsap.fromTo(
        this.el.nativeElement,
        { y: 0 },
        {
          y: yValue,
          ease: 'none',
          scrollTrigger: {
            trigger: this.el.nativeElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            scroller: document.body, // Required: Lenis uses body as scroller proxy
          },
        },
      );
    });
  }

  ngOnDestroy(): void {
    this.animation?.kill();
  }
}
