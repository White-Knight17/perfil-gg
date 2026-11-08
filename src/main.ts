import { bootstrapApplication } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Register ScrollTrigger once, before any directive or component creates a
// tween. Without this, `scrollTrigger` configs are silently ignored and the
// reveal animations play immediately on load instead of on scroll.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
