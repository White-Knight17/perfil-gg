/**
 * Shared test utilities — mocks browser APIs that are unavailable in jsdom.
 *
 * Usage (at top of describe):
 *   import { setupBrowserMocks } from '../test-utils';
 *   setupBrowserMocks();
 */

export function setupBrowserMocks(): void {
  // Mock window.matchMedia (used by AnimationConfigService)
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });

  // Mock ResizeObserver (used by Lenis)
  globalThis.ResizeObserver = class {
    observe() { return undefined; }
    unobserve() { return undefined; }
    disconnect() { return undefined; }
  } as unknown as typeof ResizeObserver;

  // Mock IntersectionObserver (used by scroll spy)
  globalThis.IntersectionObserver = class {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) { /* no-op */ }
    observe() { return undefined; }
    unobserve() { return undefined; }
    disconnect() { return undefined; }
    takeRecords() { return []; }
  } as unknown as typeof IntersectionObserver;

  // Mock SVGElement.animate (used by GSAP)
  if (typeof SVGElement !== 'undefined' && !SVGElement.prototype.animate) {
    SVGElement.prototype.animate = () => ({ play: () => undefined, pause: () => undefined }) as unknown as Animation;
  }
}
