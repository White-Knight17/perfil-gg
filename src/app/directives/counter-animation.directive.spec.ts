import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterAnimationDirective } from './counter-animation.directive';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

vi.mock('gsap', () => ({
  gsap: { registerPlugin: vi.fn(), to: vi.fn(() => ({ kill: vi.fn() })), from: vi.fn(() => ({ kill: vi.fn() })), fromTo: vi.fn(() => ({ kill: vi.fn(), scrollTrigger: { kill: vi.fn() } })), set: vi.fn(), timeline: () => ({ to: vi.fn().mockReturnThis(), from: vi.fn().mockReturnThis(), fromTo: vi.fn().mockReturnThis(), add: vi.fn().mockReturnThis(), kill: vi.fn() }) },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { create: vi.fn(() => ({ kill: vi.fn() })) } }));

@Component({ template: `<span appCounterAnimation [duration]="2">100</span>`, imports: [CounterAnimationDirective], standalone: true })
class TestHost {}

describe('CounterAnimationDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });
  it('should attach', () => expect(fixture.nativeElement.querySelector('[appCounterAnimation]')).toBeTruthy());
  it('should not throw', () => expect(() => fixture.detectChanges()).not.toThrow());
});
