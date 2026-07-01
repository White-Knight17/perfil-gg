import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * LenisService — smooth scroll engine with SSR guards.
 *
 * - init() must be called explicitly from App.ngAfterViewInit
 * - Exposes the Lenis instance via `instance` getter for ScrollTrigger sync
 * - Automatically syncs GSAP ScrollTrigger with Lenis on init
 * - All scroll operations run outside Angular zone for performance
 */
@Injectable({ providedIn: 'root' })
export class LenisService {
  private lenis: Lenis | null = null;
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly ngZone: NgZone,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /** Get the raw Lenis instance for advanced ScrollTrigger integration */
  get instance(): Lenis | null {
    return this.lenis;
  }

  /** Initialize Lenis — must be called from ngAfterViewInit (browser only) */
  init(): void {
    if (!this.isBrowser) return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Run the Lenis animation frame loop outside Angular's zone
    this.ngZone.runOutsideAngular(() => {
      const raf = (time: number) => {
        this.lenis?.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    });

    this.syncWithGsap();
  }

  /**
   * Programmatic smooth scroll to a target element or CSS selector.
   *
   * @param target  CSS selector string or HTMLElement
   * @param options Optional offset and duration overrides
   */
  scrollTo(
    target: string | HTMLElement,
    options?: { offset?: number; duration?: number },
  ): void {
    if (!this.lenis) return;

    this.ngZone.runOutsideAngular(() => {
      this.lenis!.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    });
  }

  /** Cleanup — call in ngOnDestroy of the root component */
  destroy(): void {
    this.lenis?.destroy();
    this.lenis = null;
  }

  /**
   * Sync GSAP ScrollTrigger with Lenis so all scroll-based animations
   * use Lenis's smooth scroll data instead of native scroll.
   */
  private syncWithGsap(): void {
    if (!this.lenis) return;
    const lenisRef = this.lenis;

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenisRef.scrollTo(value as number, { immediate: true });
        }
        return lenisRef.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    lenisRef.on('scroll', ScrollTrigger.update);
  }
}
