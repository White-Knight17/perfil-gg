import { Injectable, signal } from '@angular/core';

/**
 * PreloaderService — shared state between Preloader and Home components.
 *
 * - Preloader calls `complete()` after its animation finishes (min 1.5s).
 * - Home reads `done()` signal to start its hero timeline.
 * - `reset()` is available for hot-reload scenarios.
 */
@Injectable({ providedIn: 'root' })
export class PreloaderService {
  private readonly _done = signal(false);

  /** Readonly signal — true once preloader has finished */
  readonly done = this._done.asReadonly();

  /** Mark preloader as complete — triggers hero animations */
  complete(): void {
    this._done.set(true);
  }

  /** Reset for re-initialization scenarios (e.g. HMR) */
  reset(): void {
    this._done.set(false);
  }
}
