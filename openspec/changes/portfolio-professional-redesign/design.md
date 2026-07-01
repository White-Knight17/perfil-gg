# Design: Portfolio Professional Redesign

## Technical Approach

Layered animation infrastructure over the existing single-page Angular 21 app. A `core/` layer provides LenisService and AnimationConfigService. A `shared/directives/` layer provides 4 reusable GSAP directives. Feature components (home, projects, skills, contact) consume these via dependency injection and attribute directives — no global CSS selectors. All browser-only code guarded by `isPlatformBrowser()`. GSAP ScrollTrigger synced to Lenis via `scrollerProxy`. Delivery via 4 chained PRs on a feature branch, each ≤400 lines.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice |
|----------|---------|----------|--------|
| GSAP import strategy | Static `import gsap` vs dynamic `import('gsap')` | Static is simpler but risks SSR bundle bloat; dynamic adds complexity but keeps server bundle clean | **Dynamic import** for ScrollTrigger plugin only; base `gsap` static (already tree-shaken, ~23KB gzipped) |
| Lenis init location | `App.ngAfterViewInit` vs `LenisService` constructor vs explicit `init()` | Constructor auto-runs (bad for SSR); explicit init gives control | **Explicit `init()`** called from `App.ngAfterViewInit` with `isPlatformBrowser` guard |
| Directive SSR guard | Guard in each directive vs base class vs service | Per-directive is repetitive but explicit; base class DRY but adds inheritance | **Per-directive guard** — each directive checks `isPlatformBrowser` in `ngAfterViewInit` and returns early. Simple, no inheritance |
| Preloader → hero coordination | Shared service signal vs parent component state vs event emitter | Service adds indirection; parent state is simplest for single-page | **Parent (App) signal** — `isLoaded = signal(false)`. Preloader watches, hero timeline starts on `true` |
| Scroll spy mechanism | GSAP ScrollTrigger vs IntersectionObserver | ScrollTrigger already loaded but heavier; IO is native, lightweight, purpose-built | **IntersectionObserver** in a `ScrollSpyDirective` — native API, no GSAP dependency |
| 3D tilt performance | CSS transforms via GSAP vs raw `requestAnimationFrame` + `transform` | GSAP adds overhead per frame; raw RAF + transform is minimal | **Raw RAF outside NgZone** with `element.style.transform` — 60fps guaranteed |
| Mobile menu animation | Angular animations vs GSAP timeline | Angular animations declarative but limited for complex sequences; GSAP gives full control | **GSAP timeline** — matches rest of animation stack, consistent cleanup pattern |
| PR chain strategy | Stacked to main vs feature branch chain | Stacked lands independently but this feature requires integration | **Feature branch chain** with tracker PR — all 4 slices integrate before merging to main |

## Directory Structure

```
src/app/
├── core/
│   └── services/
│       ├── lenis.service.ts          # LenisService — smooth scroll + ScrollTrigger sync
│       └── animation-config.service.ts # AnimationConfigService — prefers-reduced-motion
├── shared/
│   ├── directives/
│   │   ├── scroll-reveal.directive.ts
│   │   ├── text-reveal.directive.ts
│   │   ├── parallax.directive.ts
│   │   ├── stagger-list.directive.ts
│   │   ├── tilt.directive.ts         # 3D tilt (mouse + gyroscope)
│   │   └── scroll-spy.directive.ts   # IntersectionObserver nav spy
│   └── components/
│       ├── preloader/
│       │   ├── preloader.ts
│       │   └── preloader.html
│       └── mobile-menu/
│           ├── mobile-menu.ts
│           └── mobile-menu.html
├── app.ts                            # Modified: Lenis init, preloader, scroll spy, mobile menu
├── app.html                          # Modified: preloader overlay, mobile hamburger, scroll spy
├── home/home.ts                      # Modified: ElementRef-based GSAP, TextReveal, Parallax
├── projects/projects.ts              # Modified: StaggerList, Tilt, ScrollTrigger.refresh()
├── skills/skills.ts                  # Modified: scrub animation, stat counters
├── contact/contact.ts                # Modified: ScrollReveal
└── footer/                           # (if exists) ScrollReveal
```

## Animation Pipeline

```
Component.ngAfterViewInit()
  │
  ├─ isPlatformBrowser? ──NO──→ return (SSR: static render)
  │
  ├─ AnimationConfigService.prefersReducedMotion?
  │     YES → duration(0), stagger(0) → instant render
  │     NO  → normal durations
  │
  ├─ Apply directive (e.g., ScrollRevealDirective)
  │     │
  │     ├─ gsap.from(el, { scrollTrigger: {...} })
  │     │
  │     └─ Store tween/timeline reference
  │
  └─ Component.ngOnDestroy()
        └─ tween.kill() + ScrollTrigger.kill()
```

## SSR Strategy

- **Guard pattern**: Every service/directive injects `PLATFORM_ID` and checks `isPlatformBrowser()` before accessing `window`, `document`, `Lenis`, `ScrollTrigger`, or `IntersectionObserver`.
- **Dynamic import**: `ScrollTrigger` plugin registered via `import('gsap/ScrollTrigger')` inside browser guard — prevents SSR bundle from executing GSAP plugin code.
- **Lenis**: Constructor never called on server. `LenisService.init()` is a no-op when `!isPlatformBrowser`.
- **Preloader**: Renders nothing on server (`@if (isBrowser)` wrapper).
- **Prerender compatibility**: App uses `RenderMode.Prerender`. Static HTML renders correctly; animations activate on client hydration.

## Performance Strategy

| Technique | Where | Why |
|-----------|-------|-----|
| `NgZone.runOutsideAngular` | Lenis RAF, tilt RAF, parallax scrub | Prevents 60fps change detection storms |
| `will-change: transform` | Tilt cards, parallax elements | GPU compositing hint for smooth transforms |
| `ElementRef` only | All directives | No `document.querySelector` — avoids layout thrashing from global searches |
| `ScrollTrigger.refresh()` | After GitHub data loads | Recalculates trigger positions for dynamic content |
| Kill on destroy | Every directive `ngOnDestroy` | Prevents memory leaks from orphaned tweens |
| `requestAnimationFrame` batching | Tilt directive | Coalesces mousemove events to one transform per frame |

## Chained PR Slicing (Feature Branch Chain)

```
main ──────────────────────────────────────────────────────
  \
   feature/portfolio-redesign (tracker, draft)
     \
      ├─ PR #1: animation-foundation  → targets feature/portfolio-redesign
      ├─ PR #2: preloader-hero        → targets pr-1 branch
      ├─ PR #3: scroll-animations     → targets pr-2 branch
      └─ PR #4: interactive-effects   → targets pr-3 branch
```

### PR #1: Animation Foundation (~350 lines)

| What | Details |
|------|---------|
| **New files** | `lenis.service.ts`, `animation-config.service.ts`, 4 directives, CSS utility classes |
| **Modified** | `package.json` (add lenis), `material-theme.scss` (color-scheme: dark) |
| **Tests** | Unit: AnimationConfigService (reduced motion mock), LenisService (SSR guard) |
| **Verification** | `ng build` passes, SSR build no errors, bundle <500KB |
| **Rollback** | Remove core/ and shared/directives/ — app renders statically |

### PR #2: Preloader + Hero (~300 lines)

| What | Details |
|------|---------|
| **New files** | `preloader/` component (ts + html + css) |
| **Modified** | `app.ts` (init Lenis, preloader state), `app.html` (preloader overlay), `home.ts` (ElementRef GSAP, TextReveal, Parallax on background layers) |
| **Tests** | Integration: preloader min 1.5s display, hero timeline starts after preloader |
| **Verification** | Preloader shows → transitions to hero → scroll works |
| **Rollback** | Remove preloader component, revert home.ts to current GSAP |

### PR #3: Scroll Animations (~350 lines)

| What | Details |
|------|---------|
| **New files** | Stat counter component/directive |
| **Modified** | `projects.ts` (StaggerList + ScrollTrigger.refresh), `skills.ts` (scrub bars, counters), `contact.ts` (ScrollReveal), section templates (add directive attributes) |
| **Tests** | Unit: counter animation, Integration: ScrollTrigger fires on scroll |
| **Verification** | All 4 sections animate on scroll, skill bars scrub, counters count up |
| **Rollback** | Remove directive attributes from templates — static rendering |

### PR #4: Interactive Effects + Mobile (~380 lines)

| What | Details |
|------|---------|
| **New files** | `tilt.directive.ts`, `scroll-spy.directive.ts`, `mobile-menu/` component |
| **Modified** | `app.ts` (scroll spy, mobile menu), `app.html` (hamburger button, mobile menu), `projects.ts` (tilt on cards), nav links (LenisService.scrollTo) |
| **Tests** | Unit: tilt RAF, scroll spy observer, Integration: mobile menu open/close |
| **Verification** | Cards tilt on hover, nav highlights on scroll, hamburger works on mobile |
| **Rollback** | Remove tilt/scroll-spy directives, revert nav to current anchor links |

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Unit | AnimationConfigService | Mock `matchMedia`, verify `duration()` returns 0 or base |
| Unit | LenisService SSR guard | Test with `PLATFORM_ID = 'server'`, verify `init()` is no-op |
| Unit | Tilt directive RAF | Mock `requestAnimationFrame`, verify transform applied |
| Unit | Scroll spy directive | Mock `IntersectionObserver`, verify callback registration |
| Integration | Directive lifecycle | Create host component, verify GSAP tween created and killed |
| Integration | Preloader timing | Verify min 1.5s display with fake timer |
| E2E | Scroll animations | Playwright: scroll to section, verify element becomes visible |

## Migration Plan

1. **PR #1 first** — foundation must land before any animation usage
2. **PR #2 depends on PR #1** — preloader uses LenisService, hero uses directives
3. **PR #3 depends on PR #1** — applies directives from foundation
4. **PR #4 depends on PR #1 + #3** — tilt directive follows same patterns as foundation directives
5. **Home.ts refactor**: Replace global selectors (`.hero h1`) with `@ViewChild` + `ElementRef` in PR #2
6. **Nav migration**: Replace `scrollIntoView` with `LenisService.scrollTo()` in PR #4
7. **No breaking changes**: Each PR is additive — removing new code returns to current static state

## Open Questions

- [ ] GitHub PAT for `environment.ts` — use token or unauthenticated with graceful degradation?
- [ ] Preloader "GG" avatar — reuse existing gradient circle from `home.html` or separate asset?
