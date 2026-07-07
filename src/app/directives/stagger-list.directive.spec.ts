import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaggerListDirective } from './stagger-list.directive';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

vi.mock('gsap', () => ({
  gsap: { registerPlugin: vi.fn(), from: vi.fn(() => ({ kill: vi.fn() })), to: vi.fn(() => ({ kill: vi.fn() })), fromTo: vi.fn(() => ({ kill: vi.fn() })), set: vi.fn(), timeline: () => ({ to: vi.fn().mockReturnThis(), from: vi.fn().mockReturnThis(), fromTo: vi.fn().mockReturnThis(), add: vi.fn().mockReturnThis(), kill: vi.fn() }) },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { create: vi.fn(() => ({ kill: vi.fn() })) } }));

@Component({
  template: `<div appStaggerList [stagger]="0.15" animation="fade"><div>A</div><div>B</div><div>C</div></div>`,
  imports: [StaggerListDirective],
  standalone: true,
})
class TestHost {}

describe('StaggerListDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });
  it('should attach', () => expect(fixture.nativeElement.querySelector('[appStaggerList]')).toBeTruthy());
  it('has children', () => expect(fixture.nativeElement.querySelector('[appStaggerList]').children.length).toBe(3));
  it('should not throw', () => expect(() => fixture.detectChanges()).not.toThrow());
});
