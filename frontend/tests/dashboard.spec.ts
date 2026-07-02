import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  test('should load the homepage and check the title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/VentureLens/i);
  });

  test('should navigate through sidebar tabs on the dashboard', async ({ page }) => {
    // If mock auth is active, bypass authentication step
    await page.goto('/dashboard');
    
    // Check if the dashboard welcome heading is visible
    const heading = page.locator('h2');
    await expect(heading).toContainText(/Arjun/i);
    
    // Click on Companies and verify path/view change
    await page.click('button:has-text("Companies")');
    await expect(page.locator('h4:has-text("Startups Under Review")')).toBeVisible();
  });
});
