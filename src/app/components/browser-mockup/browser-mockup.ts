import { Component, Input } from '@angular/core';
import { TiltDirective } from '../../directives/tilt.directive';

@Component({
  selector: 'app-browser-mockup',
  standalone: true,
  imports: [TiltDirective],
  template: `
    <div class="browser-mockup" appTilt [maxTilt]="5">
      <div class="browser-header">
        <div class="traffic-lights">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="address-bar">{{ url }}</div>
      </div>
      <div class="browser-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      perspective: 1200px;
    }

    .browser-mockup {
      background: #0b0d12;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid var(--color-line-strong);
      box-shadow:
        0 40px 90px -45px rgba(0, 0, 0, 0.95),
        0 0 0 1px rgba(255, 255, 255, 0.02);
    }

    .browser-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: #0e1116;
      border-bottom: 1px solid var(--color-line);
    }

    .traffic-lights {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      opacity: 0.9;
    }

    .dot.red { background: #e06c75; }
    .dot.yellow { background: #e5c07b; }
    .dot.green { background: #98c379; }

    .address-bar {
      flex: 1;
      min-width: 0;
      padding: 5px 10px;
      border: 1px solid var(--color-line);
      border-radius: 6px;
      background: #ffffff08;
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--color-faint);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .browser-content {
      position: relative;
      overflow: hidden;
    }

    .browser-content img {
      width: 100%;
      max-height: 60vh;
      object-fit: contain;
      display: block;
      background: #0b0d12;
    }
  `]
})
export class BrowserMockup {
  @Input() url: string = '';
}
