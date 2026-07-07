import { test, expect } from '@playwright/test';

test.describe('Portfolio Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/German Giorgio/);
  });

  test('should display the preloader on initial load', async ({ page }) => {
    // Preloader should be visible immediately
    const preloader = page.locator('app-preloader');
    await expect(preloader).toBeAttached();
  });

  test('should show main content after preloader', async ({ page }) => {
    // Wait for the preloader to complete and content to appear
    // The preloader takes ~1.5s min + 0.6s outro = ~2.1s
    const nav = page.locator('nav[aria-label="Principal"]');
    await expect(nav).toBeAttached({ timeout: 8000 });
  });

  test('should have main navigation links', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Principal"]');
    await expect(nav).toBeAttached({ timeout: 8000 });

    await expect(page.locator('text=Inicio')).toBeAttached();
    await expect(page.locator('text=Proyectos')).toBeAttached();
    await expect(page.locator('text=Habilidades')).toBeAttached();
    await expect(page.locator('text=Contacto')).toBeAttached();
  });

  test('should display the hero section', async ({ page }) => {
    const hero = page.locator('app-home');
    await expect(hero).toBeAttached({ timeout: 8000 });

    // Hero should have the main heading
    await expect(page.locator('text=Desarrollador')).toBeAttached();
    await expect(page.locator('text=Full-Stack')).toBeAttached();
  });

  test('should display the projects section with GitHub data', async ({ page }) => {
    const projects = page.locator('app-projects');
    await expect(projects).toBeAttached({ timeout: 8000 });

    // Should show the section heading
    await expect(page.locator('text=Proyectos/Portfolio')).toBeAttached();
  });

  test('should display the skills section', async ({ page }) => {
    const skills = page.locator('app-skills');
    await expect(skills).toBeAttached({ timeout: 8000 });

    await expect(page.locator('text=Mis Habilidades Técnicas')).toBeAttached();
    await expect(page.locator('text=Frontend')).toBeAttached();
    await expect(page.locator('text=Backend')).toBeAttached();
  });

  test('should display the contact section', async ({ page }) => {
    const contact = page.locator('app-contact');
    await expect(contact).toBeAttached({ timeout: 8000 });

    await expect(page.locator('text=Trabajemos Juntos')).toBeAttached();

    // Form should have required fields
    await expect(page.locator('input#name')).toBeAttached();
    await expect(page.locator('input#email')).toBeAttached();
    await expect(page.locator('input#subject')).toBeAttached();
    await expect(page.locator('textarea#message')).toBeAttached();
    await expect(page.locator('button[type="submit"]')).toBeAttached();
  });

  test('should display the showcase section with browser mockup', async ({ page }) => {
    const showcase = page.locator('app-showcase');
    await expect(showcase).toBeAttached({ timeout: 8000 });

    await expect(page.locator('text=Proyectos Destacados')).toBeAttached();
    await expect(page.locator('app-browser-mockup')).toBeAttached();
  });

  test('should have footer with social links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeAttached({ timeout: 8000 });

    await expect(page.locator('text=LinkedIn')).toBeAttached();
    await expect(page.locator('text=WhatsApp')).toBeAttached();
  });

  test('should have skip-to-content link for accessibility', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeAttached({ timeout: 8000 });
    await expect(skipLink).toHaveText('Saltar al contenido principal');
  });

  test.describe('Responsive behavior', () => {
    test('should show hamburger menu on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });

      // Hamburger button should exist on mobile
      const hamburger = page.locator('.hamburger-btn');
      await expect(hamburger).toBeAttached({ timeout: 8000 });
    });

    test('should open mobile menu on hamburger click', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });

      const hamburger = page.locator('.hamburger-btn');
      await expect(hamburger).toBeAttached({ timeout: 8000 });

      await hamburger.click();

      // Mobile menu panel should appear
      const panel = page.locator('.mobile-menu-panel');
      await expect(panel).toBeAttached();
    });
  });
});
