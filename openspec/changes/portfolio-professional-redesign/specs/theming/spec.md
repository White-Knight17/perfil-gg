# Theming Specification

## Purpose

Fix the Angular Material theme to use dark color scheme, resolving the current `color-scheme: light` mismatch with the dark-themed portfolio design.

## Requirements

### Requirement: Dark Color Scheme

The Angular Material theme configuration MUST set `color-scheme: dark` to match the portfolio's dark visual design (gray-900 backgrounds, light text).

#### Scenario: Material components render dark

- GIVEN the app loads with the updated theme
- WHEN Angular Material components (buttons, cards, icons) render
- THEN they use dark-theme colors (dark surfaces, light text) consistent with the Tailwind dark palette

#### Scenario: No flash of light theme

- GIVEN the page loads (including SSR)
- WHEN the initial render occurs
- THEN no light-themed Material components flash before dark styles apply

### Requirement: Theme Consistency

All Material component colors MUST be visually consistent with the existing Tailwind-based dark palette (gray-900, gray-800, gray-700 surfaces).

#### Scenario: Button colors match

- GIVEN a Material button (MatButton) renders next to a Tailwind-styled element
- WHEN both are visible
- THEN the button background, text, and ripple colors harmonize with the dark Tailwind palette
