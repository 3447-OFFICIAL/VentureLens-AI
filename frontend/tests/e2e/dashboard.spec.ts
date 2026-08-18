import { test, expect } from '@playwright/test';

test.describe('VentureLens AI Dashboard', () => {
  test('should display the login page or main dashboard structure', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/VentureLens/i);
  });
});
