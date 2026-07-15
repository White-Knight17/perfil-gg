/**
 * Test setup — makes afterNextRender() execute its callback immediately
 * in the test environment, since Angular's scheduler doesn't run in jsdom.
 */

import { vi } from 'vitest';

vi.mock('@angular/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@angular/core')>();
  return {
    ...actual,
    afterNextRender: (cb: () => void) => {
      // Execute immediately in tests instead of scheduling for next render
      cb();
    },
  };
});
