import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserMockup } from './browser-mockup';

// Host component to test ng-content projection
@Component({
  template: `
    <app-browser-mockup url="https://example.com/">
      <div class="projection-test">Projected Content</div>
    </app-browser-mockup>
  `,
  imports: [BrowserMockup],
  standalone: true,
})
class TestHostComponent {}

describe('BrowserMockup', () => {
  describe('standalone', () => {
    let component: BrowserMockup;
    let fixture: ComponentFixture<BrowserMockup>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BrowserMockup],
        schemas: [NO_ERRORS_SCHEMA], // Skip TiltDirective validation
      }).compileComponents();

      fixture = TestBed.createComponent(BrowserMockup);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render the provided URL in the address bar', () => {
      fixture.componentRef.setInput('url', 'https://example.com/');
      fixture.detectChanges();

      const addressBar: HTMLElement = fixture.nativeElement.querySelector('.address-bar');
      expect(addressBar).toBeTruthy();
      expect(addressBar.textContent?.trim()).toBe('https://example.com/');
    });

    it('should have browser mockup structure (header, traffic lights, content)', () => {
      fixture.componentRef.setInput('url', 'https://test.dev');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.browser-mockup')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.browser-header')).toBeTruthy();
      expect(fixture.nativeElement.querySelectorAll('.dot').length).toBe(3);
      expect(fixture.nativeElement.querySelector('.address-bar')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.browser-content')).toBeTruthy();
    });
  });

  describe('with projected content', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
    });

    it('should render projected content inside browser-content', () => {
      const projected = fixture.nativeElement.querySelector('.projection-test');
      expect(projected).toBeTruthy();
      expect(projected.textContent).toBe('Projected Content');
    });

    it('should render the URL passed from host', () => {
      const addressBar = fixture.nativeElement.querySelector('.address-bar');
      expect(addressBar.textContent?.trim()).toBe('https://example.com/');
    });
  });
});
