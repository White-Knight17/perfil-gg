import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollRevealDirective } from './scroll-reveal.directive';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

vi.mock('gsap', () => ({
  gsap: { registerPlugin: vi.fn(), from: vi.fn(() => ({ kill: vi.fn() })), to: vi.fn(() => ({ kill: vi.fn() })), fromTo: vi.fn(() => ({ kill: vi.fn(), scrollTrigger: { kill: vi.fn() } })), set: vi.fn(), timeline: () => ({ to: vi.fn().mockReturnThis(), from: vi.fn().mockReturnThis(), add: vi.fn().mockReturnThis(), kill: vi.fn() }) },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { create: vi.fn(() => ({ kill: vi.fn() })) } }));

@Component({ template: `<div appScrollReveal [direction]="'up'" [duration]="0.8" [delay]="0.1"></div>`, imports: [ScrollRevealDirective], standalone: true })
class TestHost {}

describe('ScrollRevealDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });
  it('should attach to host', () => expect(fixture.nativeElement.querySelector('[appScrollReveal]')).toBeTruthy());
  it('should not throw', () => expect(() => fixture.detectChanges()).not.toThrow());
});
