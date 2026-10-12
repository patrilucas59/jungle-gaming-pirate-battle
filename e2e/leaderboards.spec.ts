import test, { expect } from "playwright/test";

test('ranking paginates and history shows the empty state', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Page 1 of 3')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Page 2 of 3')).toBeVisible();

  await page.getByRole('tab', { name: 'Match History' }).click();
  await expect(page.getByText('No matches played yet.')).toBeVisible();
});

test('ranking shows an error with a retry action when the API fails', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'pirate-battle:mock-scenario:v1',
      JSON.stringify('server-error'),
    );
  });
  await page.goto('/');

  await expect(page.getByText('Could not load the ranking.')).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});