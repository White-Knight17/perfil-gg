# Preloader Specification

## Purpose

Branded loading experience using the existing "GG" avatar with a GSAP animation sequence that transitions seamlessly into the hero section.

## Requirements

### Requirement: Preloader Display

The system MUST display a full-screen preloader overlay on initial page load, centered on the existing "GG" avatar asset with an animated entrance.

#### Scenario: Initial load

- GIVEN the user navigates to the portfolio for the first time
- WHEN the page begins loading
- THEN a full-screen overlay appears with the "GG" avatar centered and animating

#### Scenario: SSR safety

- GIVEN the app renders on the server
- WHEN the preloader component initializes
- THEN no animation code executes and a static fallback renders (or nothing)

### Requirement: Preloader Animation

The system MUST animate the "GG" avatar with a GSAP timeline (scale, rotation, or pulse effect) while the page loads.

#### Scenario: Avatar animation plays

- GIVEN the preloader is visible in the browser
- WHEN the component initializes
- THEN the "GG" avatar plays a looping or entrance animation via GSAP timeline

### Requirement: Preloader to Hero Transition

The system MUST transition from the preloader to the hero section once the page is fully loaded. The preloader overlay MUST fade/scale out and the hero GSAP timeline MUST begin.

#### Scenario: Successful transition

- GIVEN the preloader animation is playing and the page has finished initial render
- WHEN the page is ready (AfterViewInit + minimum display time)
- THEN the preloader overlay animates out AND the hero section timeline begins

#### Scenario: Minimum display time

- GIVEN the page loads very quickly (< 500ms)
- WHEN the page is ready before minimum display time
- THEN the preloader remains visible for at least 1.5s before transitioning

### Requirement: Reduced Motion Preloader

When `prefers-reduced-motion` is active, the preloader MUST show the "GG" avatar statically and transition to the hero without animation.

#### Scenario: Reduced motion active

- GIVEN `prefers-reduced-motion: reduce` is set
- WHEN the preloader initializes
- THEN the avatar displays without animation and transitions instantly to the hero

### Requirement: Preloader Cleanup

The preloader overlay MUST be removed from the DOM after the transition completes to avoid blocking pointer events or consuming memory.

#### Scenario: DOM cleanup

- GIVEN the preloader-to-hero transition has completed
- WHEN the exit animation finishes
- THEN the preloader element is removed from the DOM (or set to `display: none`)
