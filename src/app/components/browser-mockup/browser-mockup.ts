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
      perspective: 1000px;
    }

    .browser-mockup {
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .browser-header {
      background: #0f172a;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .traffic-lights {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .dot.red { background: #ef4444; }
    .dot.yellow { background: #eab308; }
    .dot.green { background: #22c55e; }

    .address-bar {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      color: #94a3b8;
      font-family: 'JetBrains Mono', monospace;
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
      background: #0f172a;
    }
  `]
})
export class BrowserMockup {
  @Input() url: string = '';
}
