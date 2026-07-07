import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TiltDirective } from './tilt.directive';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(() => ({ kill: vi.fn() })),
    from: vi.fn(() => ({ kill: vi.fn() })),
    fromTo: vi.fn(() => ({ kill: vi.fn() })),
    set: vi.fn(),
    quickTo: () => vi.fn(),
    killTweensOf: vi.fn(),
    timeline: () => ({ to: vi.fn().mockReturnThis(), kill: vi.fn() }),
  },
}));

@Component({
  template: `<div appTilt [maxTilt]="10" [perspective]="1000" style="width:200px;height:200px;"></div>`,
  imports: [TiltDirective],
  standalone: true,
})
class TestHost {}

describe('TiltDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });
  it('should attach to host element', () => expect(fixture.nativeElement.querySelector('[appTilt]')).toBeTruthy());
  it('should not throw on creation', () => expect(() => fixture.detectChanges()).not.toThrow());
});
