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
 * CounterAnimationDirective — animates a number from 0 to the element's
 * parsed textContent value when it scrolls into view.
 *
 * Usage:
 * ```html
 * <span appCounterAnimation [duration]="2" prefix="+" suffix="K">
 *   150
 * </span>
 * ```
 */
@Directive({
  selector: '[appCounterAnimation]',
  standalone: true,
})
export class CounterAnimationDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly animationConfig = inject(AnimationConfigService);

  /** Animation duration in seconds */
  readonly duration = input(2);

  /** Text prepended to the number (e.g. '+') */
  readonly prefix = input('');

  /** Text appended to the number (e.g. 'K', '%') */
  readonly suffix = input('');

  private animation?: gsap.core.Tween;
  private scrollTriggerInstance?: ScrollTrigger;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const targetValue = parseInt(this.el.nativeElement.textContent, 10);
    if (isNaN(targetValue)) return;

    // Set initial display to 0 (with prefix/suffix)
    this.el.nativeElement.textContent = `${this.prefix()}0${this.suffix()}`;

    if (this.animationConfig.reducedMotion()) {
      // Jump directly to final value
      this.el.nativeElement.textContent = `${this.prefix()}${targetValue}${this.suffix()}`;
      return;
    }

    const counter = { value: 0 };

    this.animation = gsap.to(counter, {
      value: targetValue,
      duration: this.duration(),
      ease: 'power3.out',
      onUpdate: () => {
        this.el.nativeElement.textContent = `${this.prefix()}${Math.round(counter.value)}${this.suffix()}`;
      },
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top 90%',
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
