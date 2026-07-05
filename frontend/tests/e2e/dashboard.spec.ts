import { test, expect } from '@playwright/test';

test.describe('VentureLens AI Dashboard', () => {
  test.beforeEach(async ({}) => {
    // Mock login or intercept API calls here
    // await page.goto('http://localhost:3000/auth/login');
  });

  test('should display the main pipeline dashboard', async ({}) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Check if the sidebar and main navigation exist
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByText('Deal Pipeline')).toBeVisible();
  });

  test('should open the AI Copilot modal', async ({}) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Simulate opening the global search / AI command bar
    await page.keyboard.press('Control+K');
    
    // Wait for the AI interface to appear
    const searchInput = page.getByPlaceholder('Ask AI Copilot or search...');
    await expect(searchInput).toBeVisible();
  });
});
