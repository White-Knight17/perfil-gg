import { TestBed } from '@angular/core/testing';
import { PreloaderService } from './preloader.service';

describe('PreloaderService', () => {
  let service: PreloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with done() returning false', () => {
    expect(service.done()).toBe(false);
  });

  it('should return true after complete() is called', () => {
    service.complete();
    expect(service.done()).toBe(true);
  });

  it('should return false after reset() is called following complete()', () => {
    service.complete();
    expect(service.done()).toBe(true);

    service.reset();
    expect(service.done()).toBe(false);
  });

  it('complete() should be idempotent — calling twice keeps done = true', () => {
    service.complete();
    expect(service.done()).toBe(true);

    service.complete();
    expect(service.done()).toBe(true);
  });

  it('should have a Signal-based done property', () => {
    // done is an asReadonly signal, should be a function
    expect(typeof service.done).toBe('function');
  });
});
