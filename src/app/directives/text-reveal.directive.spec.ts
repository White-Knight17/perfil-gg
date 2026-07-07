import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextRevealDirective } from './text-reveal.directive';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    from: vi.fn(() => ({ kill: vi.fn() })),
    to: vi.fn(),
    fromTo: vi.fn(() => ({ kill: vi.fn() })),
    set: vi.fn(),
    timeline: () => ({ to: vi.fn().mockReturnThis(), add: vi.fn().mockReturnThis(), kill: vi.fn() }),
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { create: vi.fn(() => ({ kill: vi.fn() })) } }));

@Component({ template: `<h2 appTextReveal [stagger]="0.05">Hello World</h2>`, imports: [TextRevealDirective], standalone: true })
class TestHost {}

describe('TextRevealDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });
  it('should attach to host', () => expect(fixture.nativeElement.querySelector('[appTextReveal]')).toBeTruthy());
  it('should not throw', () => expect(() => fixture.detectChanges()).not.toThrow());
});
