import test, { expect } from "playwright/test";

test('options validate input and persist after reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Options' }).click();

  const duration = page.getByLabel('Game session time (seconds)');
  const spawn = page.getByLabel('Enemy spawn time (seconds)');

  await duration.fill('30');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(
    page.getByText('Enter a whole number of seconds between 60 and 180.'),
  ).toBeVisible();

  await duration.fill('60');
  await spawn.fill('2');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Options saved.', { exact: false })).toBeVisible();

  await page.reload();
  await page.getByRole('button', { name: 'Options' }).click();
  await expect(page.getByLabel('Game session time (seconds)')).toHaveValue('60');
  await expect(page.getByLabel('Enemy spawn time (seconds)')).toHaveValue('2');
});