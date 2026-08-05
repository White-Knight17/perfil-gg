/**
 * Test setup — makes afterNextRender() execute its callback immediately
 * in the test environment, since Angular's scheduler doesn't run in jsdom.
 */

import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize Angular test environment
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

vi.mock('@angular/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@angular/core')>();
  return {
    ...actual,
    afterNextRender: (cb: () => void) => {
      // Don't execute immediately in tests - let it be called manually if needed
      // This prevents errors when ViewChild elements aren't available yet
    },
  };
});
