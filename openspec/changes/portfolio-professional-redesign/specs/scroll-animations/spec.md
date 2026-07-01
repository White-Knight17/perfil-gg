# Scroll Animations Specification

## Purpose

Scroll-triggered visual effects for all page sections: section reveals, staggered project cards, scrub-animated skill bars, and counting stat counters for GitHub metrics.

## Requirements

### Requirement: Section ScrollTrigger Reveals

Each major section (Home, Projects, Skills, Contact) MUST animate into view when scrolled into the viewport using GSAP ScrollTrigger.

#### Scenario: Section enters viewport

- GIVEN a section is below the fold
- WHEN the user scrolls and the section's top reaches 85% of viewport height
- THEN the section content fades in and slides up with configurable duration

#### Scenario: Scroll back

- GIVEN a section has been revealed
- WHEN the user scrolls back above the trigger point
- THEN the section MAY reverse its animation (configurable via `toggleActions`)

### Requirement: Staggered Project Card Entrance

Project cards MUST enter with a staggered animation when the Projects section scrolls into view.

#### Scenario: Cards stagger in

- GIVEN the Projects section is scrolled into view
- WHEN ScrollTrigger fires
- THEN each project card animates in sequence with 80-100ms stagger (opacity + translateY)

#### Scenario: Cards already visible

- GIVEN the user loads the page and Projects section is already in viewport
- WHEN the page finishes loading
- THEN cards animate immediately without requiring scroll

### Requirement: Skill Bar Scrub Animation

Skill bars MUST fill proportionally to their level value as the user scrolls through the Skills section. Animation progress MUST be linked to scroll position (scrub).

#### Scenario: Scroll-scrub fill

- GIVEN the Skills section is in view
- WHEN the user scrolls through the section
- THEN each skill bar width animates from 0% to its target level%, synced to scroll position

#### Scenario: Reduced motion

- GIVEN `prefers-reduced-motion: reduce` is active
- WHEN the Skills section is in view
- THEN skill bars render at their final width immediately without animation

### Requirement: Animated Stat Counters

GitHub metrics (total repos, stars, forks) MUST count up from 0 to their actual value when scrolled into view.

#### Scenario: Counter animation

- GIVEN the stats section scrolls into view
- WHEN ScrollTrigger fires
- THEN each counter animates from 0 to its target number over ~1.5s with easing

#### Scenario: Counter fires once

- GIVEN a counter has already animated
- WHEN the user scrolls away and back
- THEN the counter does NOT replay (toggleActions: play none none none)

### Requirement: ScrollTrigger Performance

All ScrollTrigger instances MUST be properly cleaned up on component destroy. ScrollTrigger refresh MUST be called after dynamic content loads (e.g., GitHub data arrives).

#### Scenario: Dynamic content refresh

- GIVEN project cards are rendered after GitHub API response
- WHEN the DOM updates with new cards
- THEN `ScrollTrigger.refresh()` is called to recalculate trigger positions

#### Scenario: Cleanup on destroy

- GIVEN scroll animations are active
- WHEN the component is destroyed
- THEN all ScrollTrigger instances are killed
