import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParallaxDirective } from './parallax.directive';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

vi.mock('gsap', () => ({
  gsap: { registerPlugin: vi.fn(), to: vi.fn(() => ({ kill: vi.fn() })), from: vi.fn(), fromTo: vi.fn(() => ({ kill: vi.fn() })), set: vi.fn(), timeline: () => ({ to: vi.fn().mockReturnThis(), kill: vi.fn() }) },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { create: vi.fn(() => ({ kill: vi.fn() })) } }));

@Component({ template: `<div appParallax [speed]="0.3" direction="up"></div>`, imports: [ParallaxDirective], standalone: true })
class TestHost {}

describe('ParallaxDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });
  it('should attach', () => expect(fixture.nativeElement.querySelector('[appParallax]')).toBeTruthy());
  it('should not throw', () => expect(() => fixture.detectChanges()).not.toThrow());
});
