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

/** Supported stagger animation presets */
export type StaggerAnimation = 'fade' | 'slide-up' | 'slide-left';

/**
 * StaggerListDirective — animates each child element of the host
 * with a staggered reveal when the host scrolls into view.
 *
 * Usage:
 * ```html
 * <ul appStaggerList [stagger]="0.08" animation="slide-up">
 *   <li *ngFor="let item of items">{{ item }}</li>
 * </ul>
 * ```
 */
@Directive({
  selector: '[appStaggerList]',
  standalone: true,
})
export class StaggerListDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly animationConfig = inject(AnimationConfigService);

  /** Seconds between each child animation */
  readonly stagger = input(0.1);

  /** Animation preset */
  readonly animation = input<StaggerAnimation>('fade');

  private timeline?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.animationConfig.reducedMotion()) {
      // Ensure children are visible when animations are disabled
      Array.from(this.el.nativeElement.children as HTMLCollectionOf<HTMLElement>).forEach(
        (child) => {
          child.style.opacity = '1';
          child.style.transform = 'none';
        },
      );
      return;
    }

    const fromVars: Record<StaggerAnimation, gsap.TweenVars> = {
      fade: { opacity: 0 },
      'slide-up': { opacity: 0, y: 30 },
      'slide-left': { opacity: 0, x: -30 },
    };

    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top 85%',
      },
      defaults: { duration: 0.5, ease: 'power3.out' },
    });

    this.timeline.from(this.el.nativeElement.children, {
      ...fromVars[this.animation()],
      stagger: this.stagger(),
    });
  }

  ngOnDestroy(): void {
    this.timeline?.kill();
  }
}
