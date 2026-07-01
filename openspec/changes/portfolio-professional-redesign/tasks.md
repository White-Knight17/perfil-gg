# Tasks: Portfolio Professional Redesign

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1,360 (additions + deletions) |
| 400-line budget risk | High (4 slices, each ≤400) |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 |
| Delivery strategy | force-chained |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Animation Foundation | PR 1 → base: `feature/portfolio-redesign` | Lenis, AnimationConfig, 4 directives, theme fix |
| 2 | Preloader + Hero | PR 2 → base: PR 1 branch | Preloader component, hero GSAP timeline refactor |
| 3 | Scroll Animations | PR 3 → base: PR 2 branch | ScrollTrigger reveals, stagger cards, skill scrub, counters |
| 4 | Interactive Effects | PR 4 → base: PR 3 branch | 3D tilt, scroll spy, mobile menu, touch gestures |

---

## PR 1: Animation Foundation (~350 lines)

- [ ] 1.1 Install `@studio-freight/lenis` via `npm install`. Verify `package.json` updated.
- [ ] 1.2 Create `src/app/core/services/lenis.service.ts` — `LenisService` with `init()`, `destroy()`, `scrollTo()`, `start()`, `stop()`, RAF outside NgZone, ScrollTrigger sync via `scrollerProxy`, SSR guard via `isPlatformBrowser`.
- [ ] 1.3 Create `src/app/core/services/animation-config.service.ts` — `AnimationConfigService` detecting `prefers-reduced-motion`, exposing `duration(base)` and `stagger(base)` returning 0 when reduced.
- [ ] 1.4 Create `src/app/shared/directives/scroll-reveal.directive.ts` — standalone `[appScrollReveal]` with signal inputs `direction`, `delay`, `duration`, `distance`. GSAP `from` + ScrollTrigger (top 85%). SSR guard. Kill on destroy.
- [ ] 1.5 Create `src/app/shared/directives/text-reveal.directive.ts` — standalone `[appTextReveal]` splitting text into char spans, GSAP stagger reveal with ScrollTrigger. SSR guard. Kill on destroy.
- [ ] 1.6 Create `src/app/shared/directives/parallax.directive.ts` — standalone `[appParallax]` with `speed` and `direction` inputs. GSAP `fromTo` with scrub ScrollTrigger on parent. SSR guard. Kill on destroy.
- [ ] 1.7 Create `src/app/shared/directives/stagger-list.directive.ts` — standalone `[appStaggerList]`. GSAP timeline animating children with 80ms stagger on ScrollTrigger. SSR guard. Kill on destroy.
- [ ] 1.8 Fix Material theme: set `color-scheme: dark` in `src/styles.scss` or Material theme config.
- [ ] 1.9 Write unit tests: `AnimationConfigService` (mock `matchMedia`, verify `duration()`/`stagger()`), `LenisService` SSR guard (PLATFORM_ID='server', verify `init()` no-op).
- [ ] 1.10 Verify: `ng build --configuration production` passes, SSR build no errors, initial bundle <500KB.

## PR 2: Preloader + Hero (~300 lines)

- [ ] 2.1 Create `src/app/shared/components/preloader/preloader.ts` + `preloader.html` — full-screen overlay with "GG" avatar, GSAP timeline (scale/pulse loop), `animationComplete` output signal. SSR guard. Min 1.5s display via `setTimeout` + `Promise.all`.
- [ ] 2.2 Modify `src/app/app.ts` — inject `LenisService`, call `init()` in `ngAfterViewInit` with browser guard. Add `isLoaded = signal(false)`. Import `PreloaderComponent`.
- [ ] 2.3 Modify `src/app/app.html` — add `@if (!isLoaded())` preloader overlay. Wrap sections to render after load.
- [ ] 2.4 Refactor `src/app/home/home.ts` — replace global selectors (`.hero h1`) with `@ViewChild` + `ElementRef`. Build GSAP timeline triggered by parent `isLoaded` signal. Add `TextReveal` on h1, `Parallax` on background blobs.
- [ ] 2.5 Modify `src/app/home/home.html` — add `appTextReveal` on h1, `appParallax` on background divs, `#heroTitle` / `#heroSubtitle` template refs.
- [ ] 2.6 Wire preloader→hero transition: App sets `isLoaded.set(true)` after preloader completes, home listens and starts hero timeline.
- [ ] 2.7 Write integration test: preloader displays ≥1.5s, hero timeline starts after preloader exit.
- [ ] 2.8 Verify: preloader shows → animated GG → fades out → hero animates in → smooth scroll works.

## PR 3: Scroll Animations (~350 lines)

- [ ] 3.1 Create `src/app/shared/directives/counter-animation.directive.ts` — standalone `[appCounterAnimation]` with `target` input. GSAP `from(0)` to target on ScrollTrigger (once). SSR guard. Kill on destroy.
- [ ] 3.2 Modify `src/app/projects/projects.ts` — import `StaggerListDirective`. Call `ScrollTrigger.refresh()` after GitHub data loads (in subscribe `next`). Add `appStaggerList` to card grid container.
- [ ] 3.3 Modify `src/app/projects/projects.html` — add `appStaggerList` attribute on the card grid `div`. Add `appScrollReveal` on section heading.
- [ ] 3.4 Modify `src/app/skills/skills.ts` — import `ScrollRevealDirective`, `CounterAnimationDirective`. Add scroll-scrub logic for skill bars (GSAP `from` width 0% to target% with scrub ScrollTrigger).
- [ ] 3.5 Modify `src/app/skills/skills.html` — add `appScrollReveal` on section heading and skill category cards. Replace `[style.width.%]` with scrub-animated bars or add `appScrollReveal` wrappers.
- [ ] 3.6 Modify `src/app/contact/contact.ts` + `contact.html` — add `appScrollReveal` on section heading and form container.
- [ ] 3.7 Add GitHub stats section in `skills.html` or `projects.html` with `appCounterAnimation` on repo count, stars, forks metrics.
- [ ] 3.8 Write unit test: counter directive animates from 0 to target. Integration: ScrollTrigger fires on scroll for section reveals.
- [ ] 3.9 Verify: all 4 sections animate on scroll, skill bars scrub with scroll, counters count up once.

## PR 4: Interactive Effects + Mobile (~380 lines)

- [ ] 4.1 Create `src/app/shared/directives/tilt.directive.ts` — standalone `[appTilt]`. Mouse: `mousemove` → RAF outside NgZone → `rotateX/rotateY` (max 15deg). Gyroscope: `deviceorientation` → `gamma/beta` (max 10deg). Touch fallback: no-op. SSR guard. Kill RAF + listeners on destroy. `will-change: transform`.
- [ ] 4.2 Create `src/app/shared/directives/scroll-spy.directive.ts` — standalone `[appScrollSpy]` with `sectionIds` input. `IntersectionObserver` tracking visible section, emitting `activeSection` output. SSR guard. Disconnect on destroy.
- [ ] 4.3 Create `src/app/shared/components/mobile-menu/mobile-menu.ts` + `mobile-menu.html` — hamburger toggle button (visible <768px), full-screen overlay nav with GSAP timeline (slide-in + stagger links). Close on nav click, close on scroll. `LenisService.scrollTo()` on link tap.
- [ ] 4.4 Modify `src/app/app.ts` — add `ScrollSpyDirective`, `MobileMenuComponent`. Wire `activeSection` signal to nav link classes. Replace `scrollIntoView` nav clicks with `LenisService.scrollTo()`.
- [ ] 4.5 Modify `src/app/app.html` — add hamburger button in nav, `<app-mobile-menu>` component, `appScrollSpy` on main container, `[appTilt]` removed from nav (applied in projects).
- [ ] 4.6 Modify `src/app/projects/projects.ts` + `projects.html` — add `[appTilt]` on each project `mat-card`.
- [ ] 4.7 Migrate all nav link clicks to use `LenisService.scrollTo('#section')` instead of native `scrollIntoView`.
- [ ] 4.8 Write unit tests: tilt RAF applies transform, scroll spy observer registers sections. Integration: mobile menu open/close cycle.
- [ ] 4.9 Verify: cards tilt on hover (desktop), nav highlights active section, hamburger opens/closes on mobile, touch devices skip tilt.
