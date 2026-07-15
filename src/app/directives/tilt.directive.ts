import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  NgZone,
  afterNextRender,
} from '@angular/core';
import { gsap } from 'gsap';

/**
 * TiltDirective — applies 3D perspective tilt on hover (desktop)
 * and device orientation (mobile/tablet).
 *
 * Examples:
 * ```html
 * <mat-card appTilt [maxTilt]="15" [perspective]="800">
 *   Card with 3D hover tilt
 * </mat-card>
 * ```
 *
 * Performance:
 * - Runs OUTSIDE NgZone via ngZone.runOutsideAngular()
 * - Uses GSAP .to() with `overwrite: 'auto'` for smooth mouse follow
 * - All GSAP instances killed in ngOnDestroy
 * - All event listeners cleaned up in ngOnDestroy
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly ngZone = inject(NgZone);

  /** Max rotation in degrees (default: 10) */
  readonly maxTilt = input(10);

  /** CSS perspective value in px (default: 1000) */
  readonly perspective = input(1000);

  /** Scale factor on hover (default: 1.02) */
  readonly scale = input(1.02);

  /** Transition speed in ms for return to neutral (default: 500) */
  readonly speed = input(500);

  private element!: HTMLElement;

  /** Bound handlers — stored for cleanup */
  private boundMouseMove!: (e: MouseEvent) => void;
  private boundMouseLeave!: () => void;
  private boundOrientation!: (e: DeviceOrientationEvent) => void;

  /** GSAP tween for mouse-leave return animation */
  private leaveAnimation?: gsap.core.Tween;

  constructor() {
    afterNextRender(() => {
      this.element = this.el.nativeElement;

      this.ngZone.runOutsideAngular(() => {
        this.initTilt();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------

  private initTilt(): void {
    // Enable 3D transforms
    this.element.style.transformStyle = 'preserve-3d';

    // Mouse handlers
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseLeave = this.onMouseLeave.bind(this);
    this.element.addEventListener('mousemove', this.boundMouseMove);
    this.element.addEventListener('mouseleave', this.boundMouseLeave);

    // Device orientation (mobile gyroscope)
    this.initDeviceOrientation();
  }

  // ---------------------------------------------------------------------------
  // Mouse handlers
  // ---------------------------------------------------------------------------

  private onMouseMove(e: MouseEvent): void {
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize cursor position to -1..1
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    const rotateY = deltaX * this.maxTilt();
    const rotateX = -deltaY * this.maxTilt();

    // Kill any ongoing leave animation
    this.leaveAnimation?.kill();

    // GSAP to() with overwrite: 'auto' for smooth mouse follow
    // Use transformPerspective to set CSS perspective without conflicting
    // with GSAP's internal rotationX/rotationY transform management.
    gsap.to(this.element, {
      rotationX: rotateX,
      rotationY: rotateY,
      scale: this.scale(),
      transformPerspective: this.perspective(),
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  private onMouseLeave(): void {
    this.leaveAnimation = gsap.to(this.element, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      transformPerspective: this.perspective(),
      duration: this.speed() / 1000,
      ease: 'power2.out',
      onComplete: () => {
        // Clean up inline transform so CSS hover styles can take over
        this.element.style.transform = '';
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Device Orientation (mobile gyroscope)
  // ---------------------------------------------------------------------------

  private initDeviceOrientation(): void {
    if (typeof DeviceOrientationEvent === 'undefined') return;

    this.boundOrientation = this.onDeviceOrientation.bind(this);
    window.addEventListener('deviceorientation', this.boundOrientation);
  }

  private onDeviceOrientation(e: DeviceOrientationEvent): void {
    if (e.beta === null || e.gamma === null) return;

    // beta: front-to-back tilt (-180 to 180), gamma: left-to-right (-90 to 90)
    // At beta=45 the device is roughly "flat" — use that as neutral
    const tiltX = Math.max(
      -this.maxTilt(),
      Math.min(this.maxTilt(), ((e.beta - 45) / 45) * (this.maxTilt() * 0.6)),
    );
    const tiltY = Math.max(
      -this.maxTilt(),
      Math.min(this.maxTilt(), (e.gamma / 45) * (this.maxTilt() * 0.6)),
    );

    gsap.to(this.element, {
      rotationX: tiltX,
      rotationY: tiltY,
      transformPerspective: this.perspective(),
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  ngOnDestroy(): void {
    if (!this.element) return; // afterNextRender hasn't fired yet (SSR/prerender)
    this.element.removeEventListener('mousemove', this.boundMouseMove);
    this.element.removeEventListener('mouseleave', this.boundMouseLeave);
    window.removeEventListener('deviceorientation', this.boundOrientation);

    this.leaveAnimation?.kill();
    gsap.killTweensOf(this.element);
  }
}
