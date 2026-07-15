import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  afterNextRender,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationConfigService } from '../services/animation-config.service';

/**
 * TextRevealDirective — splits text content into individual character
 * `<span>` elements and animates them with a staggered reveal on scroll.
 *
 * Usage:
 * ```html
 * <h1 appTextReveal [stagger]="0.03" [duration]="1">
 *   Each letter reveals one by one
 * </h1>
 * ```
 */
@Directive({
  selector: '[appTextReveal]',
  standalone: true,
})
export class TextRevealDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly animationConfig = inject(AnimationConfigService);

  /** Seconds between each character animation */
  readonly stagger = input(0.02);

  /** Duration of each character animation (seconds) */
  readonly duration = input(0.8);

  private animation?: gsap.core.Tween;

  constructor() {
    afterNextRender(() => {
      if (this.animationConfig.reducedMotion()) {
      // Ensure text is visible when animations are disabled
      this.el.nativeElement.style.opacity = '1';
      return;
    }

    const text = this.el.nativeElement.textContent as string;
    this.el.nativeElement.innerHTML = '';

    // Wrap each character in its own span
    for (const char of text) {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      this.el.nativeElement.appendChild(span);
    }

    // Use set + to instead of from for robustness with SSR hydration
    gsap.set(this.el.nativeElement.children, { opacity: 0, y: 20, rotationX: -90 });
    this.animation = gsap.to(this.el.nativeElement.children, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      stagger: this.stagger(),
      duration: this.duration(),
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top 90%',
        scroller: document.body, // Required: Lenis uses body as scroller proxy
      },
      });
    });
  }

  ngOnDestroy(): void {
    this.animation?.kill();
  }
}
