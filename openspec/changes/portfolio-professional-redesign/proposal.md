# Proposal: Portfolio Professional Redesign

## Intent

Transform the portfolio from a basic Angular SPA (4 elementary GSAP `fromTo()` calls, no smooth scroll, no scroll-triggered effects, no preloader, no modern state management) into a professional, animation-driven showcase.

## Scope

### In Scope

- **Phase 1 — Foundation**: Lenis, reusable animation directives (ScrollReveal, TextReveal, Parallax, StaggerList), AnimationConfigService, Material theme fix, FontAwesome CDN→npm migration
- **Phase 2 — Hero + Preloader**: Branded "GG" preloader → hero GSAP timeline, text split, parallax layers
- **Phase 3 — Scroll Animations**: ScrollTrigger reveals, staggered project cards, skill bar scrub, animated counters
- **Phase 4 — Interactive Polish**: 3D card tilt, scroll spy nav, mobile hamburger with GSAP
- **Phase 5 — Architecture**: Signals, TanStack Angular Query, Reactive Forms

### Out of Scope

- Custom cursor, particle backgrounds, dark/light toggle, multi-page routing, CMS, test expansion

## Capabilities

### New Capabilities

- `animation-core`: Lenis service, ScrollTrigger sync, reusable directives, reduced-motion support
- `preloader`: Branded loading animation with hero transition
- `scroll-animations`: Scroll-triggered reveals, staggered lists, scrub skill bars, counters
- `interactive-effects`: 3D tilt, scroll spy nav, animated mobile menu

### Modified Capabilities

- `github-integration`: TanStack Angular Query (cache, retry, token support)
- `contact-form`: Template-driven → Reactive Forms with validation
- `theming`: Fix Material `color-scheme: light` → `dark`

## Approach

**Animation-First**: Build reusable directives in Phase 1, apply across sections in Phases 2–4. Architecture modernization in Phase 5 after visual work stabilizes. All GSAP/Lenis guarded with `isPlatformBrowser()` for SSR. ElementRef-based selectors only. Proper `ngOnDestroy` cleanup.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/home/` | Modified | Timeline, preloader, parallax |
| `src/app/projects/` | Modified | Stagger, 3D tilt, Signals |
| `src/app/skills/` | Modified | Scrub animations, counters |
| `src/app/contact/` | Modified | Reactive Forms |
| `src/app/app.ts`, `app.html` | Modified | Lenis init, scroll spy, mobile menu, preloader |
| `src/app/github.ts` | Modified | TanStack Query |
| `src/material-theme.scss` | Modified | `color-scheme: dark` |
| `src/app/core/` | New | LenisService, AnimationConfigService |
| `src/app/shared/animations/` | New | 4 reusable directives |
| `package.json` | Modified | Add lenis, tanstack query |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| SSR crash (GSAP/Lenis access `window`) | High | `isPlatformBrowser()` + dynamic imports |
| Bundle >500KB | Medium | Tree-shake GSAP; verify with `--stats-json` |
| Lenis vs `scrollIntoView()` conflict | High | Migrate all nav to `LenisService.scrollTo()` |
| GitHub API 60 req/hr | Medium | Token via `environment.ts` + TanStack caching |

## Rollback Plan

Each phase = isolated commit. Animation directives are additive (removal → static rendering). Lenis disableable without breaking native scroll. Phase 5 independently revertable.

## Dependencies

- `@studio-freight/lenis` (~5KB gzipped)
- `@tanstack/angular-query-experimental`
- GSAP ScrollTrigger (included in `gsap` 3.14.2)

## Success Criteria

- [ ] Lenis smooth scroll + ScrollTrigger sync active
- [ ] Preloader → hero transition on load
- [ ] All 4 sections have scroll-triggered animations
- [ ] Project cards: stagger entrance + 3D tilt hover
- [ ] Skill bars: scroll scrub animation
- [ ] Scroll spy nav highlighting
- [ ] Mobile hamburger menu with GSAP
- [ ] GitHub data via TanStack Query (loading/error states)
- [ ] Reactive Forms contact with validation
- [ ] `prefers-reduced-motion` respected
- [ ] SSR build passes, bundle <500KB

## Proposal Question Round

1. **Priority**: Phase 5 (architecture) equal priority to visual phases, or deferred to a separate change?
2. **GitHub token**: PAT ready for `environment.ts`, or unauthenticated with graceful degradation?
3. **Preloader branding**: Use existing "GG" avatar, or different brand asset?
4. **Mobile**: Specific mobile requirements beyond hamburger, or standard Tailwind breakpoints?
