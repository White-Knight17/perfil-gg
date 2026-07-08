import {
  Component,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  NgZone,
  HostListener,
  effect,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home } from './home/home';
import { Projects } from './projects/projects';
import { Skills } from './skills/skills';
import { Contact } from './contact/contact';
import { Showcase } from './showcase/showcase';
import { Preloader } from './preloader/preloader';
import { LenisService } from './services/lenis.service';
import { PreloaderService } from './services/preloader.service';

/**
 * App root — orchestrates preloader → main content transition,
 * nav scroll spy, and mobile hamburger menu.
 *
 * - Preloader covers viewport initially
 * - When PreloaderService.done is true:
 *   1. Preloader is hidden
 *   2. Main content becomes visible with opacity transition
 *   3. Lenis is initialized (smooth scroll)
 * - IntersectionObserver-based scroll spy highlights the active nav link
 * - Mobile hamburger menu with GSAP slide-in and scroll lock
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Preloader, Home, Projects, Skills, Contact, Showcase],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  /** Currently visible section ID for nav highlight */
  protected activeSection = 'home';

  /** Mobile hamburger menu open state */
  protected mobileMenuOpen = false;

  /** Preloader completion state — gates .site-content rendering */
  protected preloaderDone = signal(false);

  private readonly isBrowser: boolean;
  private initialized = false;
  private safetyTimer?: ReturnType<typeof setTimeout>;
  private intersectionObserver?: IntersectionObserver;
  private preloaderEffect?: ReturnType<typeof effect>;

  /** Section IDs to spy on, in visual order */
  private readonly sectionIds = ['home', 'projects', 'skills', 'contact'];

  // ---------------------------------------------------------------------------
  // Mobile menu template refs
  // ---------------------------------------------------------------------------

  @ViewChild('hamburgerBar1') private hamburgerBar1!: ElementRef<HTMLElement>;
  @ViewChild('hamburgerBar2') private hamburgerBar2!: ElementRef<HTMLElement>;
  @ViewChild('hamburgerBar3') private hamburgerBar3!: ElementRef<HTMLElement>;
  @ViewChild('mobileMenuPanel') private mobileMenuPanel!: ElementRef<HTMLElement>;
  @ViewChild('mobileMenuOverlay') private mobileMenuOverlay!: ElementRef<HTMLElement>;
  @ViewChildren('mobileMenuItem') private mobileMenuItems!: QueryList<ElementRef<HTMLElement>>;

  // ---------------------------------------------------------------------------
  // GSAP timelines
  // ---------------------------------------------------------------------------

  private hamburgerTimeline?: gsap.core.Timeline;
  private mobileMenuTimeline?: gsap.core.Timeline;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly lenisService: LenisService,
    private readonly preloaderService: PreloaderService,
    private readonly ngZone: NgZone,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    if (this.initialized) return;
    this.initialized = true;

    // Watch preloader completion reactively
    this.preloaderEffect = effect(() => {
      if (this.preloaderService.done()) {
        this.onPreloaderDone();
      }
    });

    // Safety timeout: force init after 5s even if preloader never completes
    this.safetyTimer = setTimeout(() => {
      this.onPreloaderDone();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.safetyTimer) clearTimeout(this.safetyTimer);
    this.preloaderEffect?.destroy();
    this.intersectionObserver?.disconnect();

    // Mobile menu cleanup
    this.killMobileMenuAnimations();
    if (this.mobileMenuOpen && this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  /**
   * Smooth-scroll to a section using Lenis when available,
   * with native scrollIntoView fallback.
   */
  protected scrollTo(event: Event, sectionId: string): void {
    event.preventDefault();
    // Try Lenis smooth scroll first; fall back to native
    if (this.lenisService.instance) {
      this.lenisService.scrollTo(`#${sectionId}`, { offset: -80 });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ---------------------------------------------------------------------------
  // Mobile menu
  // ---------------------------------------------------------------------------

  protected toggleMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  protected openMobileMenu(): void {
    if (!this.isBrowser) return;
    this.mobileMenuOpen = true;

    // Scroll lock
    document.body.style.overflow = 'hidden';

    // Run GSAP outside Angular zone for performance
    this.ngZone.runOutsideAngular(() => {
      this.animateHamburger(true);
      this.animateMobileMenu(true);
    });
  }

  protected closeMobileMenu(): void {
    if (!this.isBrowser) return;
    this.mobileMenuOpen = false;

    // Re-enable scroll
    document.body.style.overflow = '';

    // Run GSAP outside Angular zone for performance
    this.ngZone.runOutsideAngular(() => {
      this.animateHamburger(false);
      this.animateMobileMenu(false);
    });
  }

  /**
   * Animate hamburger bars → X (open) or X → bars (close).
   */
  private animateHamburger(open: boolean): void {
    this.hamburgerTimeline?.kill();
    this.hamburgerTimeline = gsap.timeline();

    const bar1 = this.hamburgerBar1.nativeElement;
    const bar2 = this.hamburgerBar2.nativeElement;
    const bar3 = this.hamburgerBar3.nativeElement;

    if (open) {
      this.hamburgerTimeline
        .to(bar1, { rotate: 45, y: 7, duration: 0.3, ease: 'power2.out' }, 0)
        .to(bar2, { opacity: 0, duration: 0.2, ease: 'power2.out' }, 0)
        .to(bar3, { rotate: -45, y: -7, duration: 0.3, ease: 'power2.out' }, 0);
    } else {
      this.hamburgerTimeline
        .to(bar1, { rotate: 0, y: 0, duration: 0.3, ease: 'power2.out' }, 0)
        .to(bar2, { opacity: 1, duration: 0.2, ease: 'power2.out' }, 0)
        .to(bar3, { rotate: 0, y: 0, duration: 0.3, ease: 'power2.out' }, 0);
    }
  }

  /**
   * Animate mobile menu panel slide-in/out with staggered items and overlay.
   */
  private animateMobileMenu(open: boolean): void {
    this.mobileMenuTimeline?.kill();
    this.mobileMenuTimeline = gsap.timeline();

    const panel = this.mobileMenuPanel.nativeElement;
    const overlayEl = this.mobileMenuOverlay.nativeElement;
    const items = this.mobileMenuItems.toArray().map((ref) => ref.nativeElement);

    if (open) {
      // Show overlay (hidden by default), slide panel in, stagger items
      this.mobileMenuTimeline
        .set(overlayEl, { display: 'block' })
        .to(overlayEl, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0)
        .to(panel, { x: '0%', duration: 0.4, ease: 'power3.out' }, 0)
        .fromTo(
          items,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.08,
            duration: 0.35,
            ease: 'power2.out',
          },
          0.12,
        );
    } else {
      // Fade items out, slide panel right, fade overlay
      this.mobileMenuTimeline
        .to(items, {
          opacity: 0,
          x: 20,
          stagger: 0.04,
          duration: 0.15,
          ease: 'power2.in',
        }, 0)
        .to(panel, { x: '100%', duration: 0.3, ease: 'power3.in' }, 0.1)
        .to(overlayEl, { opacity: 0, duration: 0.2, ease: 'power2.out' }, 0)
        .set(overlayEl, { display: 'none' });
    }
  }

  private killMobileMenuAnimations(): void {
    this.hamburgerTimeline?.kill();
    this.mobileMenuTimeline?.kill();
  }

  // ---------------------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------------------

  @HostListener('document:keydown.escape')
  protected onEscapePress(): void {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // ---------------------------------------------------------------------------
  // Preloader → Lenis init
  // ---------------------------------------------------------------------------

  private onPreloaderDone(): void {
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
      this.safetyTimer = undefined;
    }

    // Init Lenis BEFORE rendering content so ScrollTriggers use the scrollerProxy
    this.lenisService.init();

    // Render main content — children will create ScrollTriggers after this
    this.preloaderDone.set(true);

    // Refresh ScrollTrigger positions and init scroll spy after Angular renders the DOM
    setTimeout(() => {
      ScrollTrigger.refresh();
      this.initScrollSpy();
    }, 150);
  }

  /**
   * Set up IntersectionObserver to track which section is visible.
   * Updates {@link activeSection} which drives the `.active` CSS class
   * on nav links via [class.active].
   */
  private initScrollSpy(): void {
    const sections = this.sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let maxRatio = 0;
        let maxId = this.activeSection;

        for (const entry of entries) {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxId = entry.target.id;
          }
        }

        if (maxRatio > 0) {
          this.activeSection = maxId;
        }
      },
      {
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0.3, 0.5, 0.7],
      },
    );

    sections.forEach((section) => this.intersectionObserver!.observe(section));
  }
}
