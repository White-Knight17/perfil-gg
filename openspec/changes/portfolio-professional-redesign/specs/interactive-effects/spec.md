# Interactive Effects Specification

## Purpose

User interaction enhancements: 3D tilt on project cards, scroll spy navigation, animated mobile hamburger menu, and touch-specific gestures for premium mobile experience.

## Requirements

### Requirement: 3D Tilt on Project Cards

Project cards MUST respond to mouse movement with a 3D perspective tilt effect (rotateX/rotateY based on cursor position relative to card center).

#### Scenario: Mouse hover tilt

- GIVEN a project card is visible on desktop
- WHEN the user moves the mouse over the card
- THEN the card tilts with rotateX/rotateY proportional to cursor offset (max 15deg)

#### Scenario: Mouse leave reset

- GIVEN a card is tilted from hover
- WHEN the mouse leaves the card
- THEN the card smoothly returns to its neutral position (0deg rotation)

#### Scenario: Touch device — gyroscope

- GIVEN a mobile device with DeviceOrientation API
- WHEN the user tilts their device
- THEN the card tilts based on device gamma/beta angles (max 10deg)

#### Scenario: Touch device — no gyroscope

- GIVEN a mobile device without DeviceOrientation support
- WHEN the user interacts with a card
- THEN the tilt effect is disabled gracefully (no error, static card)

#### Scenario: Reduced motion

- GIVEN `prefers-reduced-motion: reduce` is active
- WHEN the user hovers over a card
- THEN no tilt animation occurs

### Requirement: Scroll Spy Navigation

The navigation bar MUST highlight the link corresponding to the currently visible section using `IntersectionObserver`.

#### Scenario: Section becomes active

- GIVEN the user scrolls to the Projects section
- WHEN the Projects section occupies the majority of the viewport
- THEN the "Proyectos" nav link receives the active class (highlighted style)

#### Scenario: Smooth scroll on nav click

- GIVEN the user clicks a nav link
- WHEN the click fires
- THEN LenisService.scrollTo() smoothly scrolls to the target section (NOT native `scrollIntoView`)

#### Scenario: SSR safety

- GIVEN the app renders on the server
- WHEN the scroll spy initializes
- THEN no IntersectionObserver or DOM queries execute

### Requirement: Mobile Hamburger Menu

A hamburger menu button MUST be visible on mobile (< 768px) and toggle a full-screen or slide-in navigation overlay with GSAP animation.

#### Scenario: Menu open

- GIVEN the viewport is < 768px wide
- WHEN the user taps the hamburger button
- THEN the menu overlay animates in with GSAP (slide or fade) and nav links are accessible

#### Scenario: Menu close

- GIVEN the mobile menu is open
- WHEN the user taps a nav link or the close button
- THEN the menu animates out AND LenisService scrolls to the target section

#### Scenario: Menu close on scroll

- GIVEN the mobile menu is open
- WHEN the user scrolls the page
- THEN the menu closes automatically

### Requirement: Touch Gestures

Mobile interactions MUST be optimized with touch-specific behavior: swipe to navigate between sections, tap-aware card interactions, and no hover-dependent effects on touch devices.

#### Scenario: Swipe navigation

- GIVEN the user is on a mobile device
- WHEN the user swipes up or down on the page
- THEN the smooth scroll responds with touch-appropriate momentum (Lenis touchMultiplier)

#### Scenario: No hover effects on touch

- GIVEN a touch-only device (no pointer: fine)
- WHEN the user interacts with project cards
- THEN hover-dependent effects (3D tilt) are not triggered; tap provides feedback instead

### Requirement: Cleanup and Performance

All IntersectionObserver instances, event listeners, and GSAP animations MUST be cleaned up on component destroy. Tilt effect MUST use `requestAnimationFrame` for smooth 60fps rendering.

#### Scenario: Observer cleanup

- GIVEN scroll spy is active
- WHEN the component is destroyed
- THEN all IntersectionObserver instances are disconnected

#### Scenario: Tilt performance

- GIVEN the 3D tilt effect is active on a card
- WHEN the mouse moves rapidly across the card
- THEN the tilt updates at 60fps using requestAnimationFrame (no layout thrashing)
