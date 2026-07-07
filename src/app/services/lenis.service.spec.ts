import { TestBed } from '@angular/core/testing';
import { LenisService } from './lenis.service';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

describe('LenisService', () => {
  let service: LenisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LenisService);
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('should have scrollTo method', () => expect(typeof service.scrollTo).toBe('function'));
  it('should have init method', () => expect(typeof service.init).toBe('function'));
  it('should have destroy method', () => expect(typeof service.destroy).toBe('function'));

  it('init() should not throw (with browser mocks available)', () => {
    expect(() => service.init()).not.toThrow();
  });

  it('destroy() should not throw when called without init', () => {
    expect(() => service.destroy()).not.toThrow();
  });
});
