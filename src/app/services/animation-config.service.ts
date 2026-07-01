import { Injectable, Inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * AnimationConfigService — centralized animation settings with
 * reduced-motion support.
 *
 * - Detects `prefers-reduced-motion` media query (SSR-guarded)
 * - Exposes a `reducedMotion` Signal for reactive consumption
 * - Provides a `durationMultiplier` Signal (1 = normal, 0 = reduced motion)
 */
@Injectable({ providedIn: 'root' })
export class AnimationConfigService {
  /** Whether the user has requested reduced motion */
  readonly reducedMotion: WritableSignal<boolean>;

  /**
   * Duration multiplier for animations.
   * - 1 during normal operation
   * - 0 when reduced motion is preferred (instant skip)
   */
  readonly durationMultiplier: WritableSignal<number>;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.reducedMotion = signal(false);
    this.durationMultiplier = signal(1);

    if (isPlatformBrowser(platformId)) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion.set(mq.matches);
      this.durationMultiplier.set(mq.matches ? 0 : 1);

      // Listen for changes while the user is on the page
      mq.addEventListener('change', (event) => {
        this.reducedMotion.set(event.matches);
        this.durationMultiplier.set(event.matches ? 0 : 1);
      });
    }
  }
}
