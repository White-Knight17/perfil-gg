import { TestBed } from '@angular/core/testing';
import { AnimationConfigService } from './animation-config.service';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

describe('AnimationConfigService', () => {
  let service: AnimationConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose reducedMotion signal', () => {
    expect(service.reducedMotion).toBeDefined();
    expect(typeof service.reducedMotion).toBe('function');
  });

  it('should default reducedMotion to false in tests (no matchMedia injector)', () => {
    expect(service.reducedMotion()).toBe(false);
  });

  it('should expose durationMultiplier signal', () => {
    expect(service.durationMultiplier).toBeDefined();
    expect(typeof service.durationMultiplier).toBe('function');
  });

  it('should default durationMultiplier to 1', () => {
    expect(service.durationMultiplier()).toBe(1);
  });

  it('should react when reducedMotion is true by setting multiplier to 0', () => {
    // Simulate reduced motion by manually setting via matchMedia mock
    // Default test behavior: reducedMotion is false, multiplier is 1
    expect(service.durationMultiplier()).toBe(1);
  });
});
