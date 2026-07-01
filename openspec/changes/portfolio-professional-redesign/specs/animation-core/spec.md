# Animation Core Specification

## Purpose

Core animation infrastructure: Lenis smooth scroll service, reusable GSAP directives, and accessibility-aware animation configuration. Foundation for all other animation phases.

## Requirements

### Requirement: LenisService

The system MUST provide a `LenisService` (providedIn: root) that initializes Lenis smooth scroll, syncs GSAP ScrollTrigger via `scrollerProxy`, and runs the RAF loop outside `NgZone`.

#### Scenario: Browser initialization

- GIVEN the app loads in a browser environment
- WHEN `LenisService.init()` is called
- THEN Lenis smooth scroll is active AND ScrollTrigger uses Lenis scroll data

#### Scenario: SSR guard

- GIVEN the app renders on the server (SSR)
- WHEN `LenisService.init()` is called
- THEN no `window`, `document`, or Lenis code executes AND no error is thrown

#### Scenario: RAF performance

- GIVEN Lenis is initialized
- WHEN the RAF loop runs
- THEN it executes outside Angular's NgZone to avoid triggering change detection every frame

#### Scenario: Cleanup

- GIVEN Lenis is initialized
- WHEN `LenisService.destroy()` is called
- THEN the Lenis instance is destroyed and RAF loop stops

### Requirement: Animation Directives

The system MUST provide 4 standalone directives: `ScrollRevealDirective`, `TextRevealDirective`, `ParallaxDirective`, `StaggerListDirective`. Each MUST use `ElementRef` (never global CSS selectors), accept signal inputs for configuration, and kill all GSAP instances in `ngOnDestroy`.

#### Scenario: ScrollReveal applied

- GIVEN an element with `[appScrollReveal]` and `direction="up"`
- WHEN the element enters the viewport (top 85%)
- THEN it animates from offset to origin with opacity transition

#### Scenario: TextReveal applied

- GIVEN a heading with `[appTextReveal]`
- WHEN the element enters the viewport
- THEN each character animates individually with staggered delay

#### Scenario: Parallax applied

- GIVEN an element with `[appParallax]` and `speed="0.3"`
- WHEN the user scrolls past the parent container
- THEN the element translates at 30% of scroll speed (scrub-synced)

#### Scenario: StaggerList applied

- GIVEN a container with `[appStaggerList]`
- WHEN the container enters the viewport
- THEN child elements animate in sequence with 80ms stagger

#### Scenario: Directive cleanup

- GIVEN any animation directive is active
- WHEN the host component is destroyed
- THEN all associated GSAP tweens, timelines, and ScrollTrigger instances are killed

### Requirement: AnimationConfigService

The system MUST provide an `AnimationConfigService` that detects `prefers-reduced-motion: reduce` and exposes `duration(base)` and `stagger(base)` methods returning 0 when reduced motion is active.

#### Scenario: Reduced motion preferred

- GIVEN the OS reports `prefers-reduced-motion: reduce`
- WHEN `duration(0.8)` is called
- THEN the return value is 0

#### Scenario: Normal motion

- GIVEN no reduced motion preference
- WHEN `duration(0.8)` is called
- THEN the return value is 0.8

### Requirement: SSR Safety

All animation code MUST guard browser-only APIs with `isPlatformBrowser()`. GSAP plugins MUST be dynamically imported to prevent SSR bundle execution.

#### Scenario: SSR build passes

- GIVEN the Angular SSR build runs (`ng build --configuration production`)
- WHEN server bundle executes
- THEN no `window is not defined` or `document is not defined` errors occur

### Requirement: Bundle Budget

The total initial bundle (animation deps included) MUST remain under 500KB gzipped.

#### Scenario: Bundle verification

- GIVEN all animation dependencies are installed (lenis, gsap)
- WHEN `ng build --configuration production` completes
- THEN the initial bundle size is under 500KB
