import { expect, test } from '@playwright/test';

test('match starts and pause freezes the timer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Play' }).click();

  const hud = page.getByRole('region', { name: 'Match status' });
  const timeLeft = hud.locator('dd').nth(2);
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(timeLeft).toHaveText(/^\d:\d\d$/);

  const running = (await timeLeft.textContent()) ?? '';
  await expect(timeLeft).not.toHaveText(running, { timeout: 5_000 });

  await page.keyboard.press('p');
  const dialog = page.getByRole('dialog', { name: 'Paused' });
  await expect(dialog).toBeVisible();

  const frozen = (await timeLeft.textContent()) ?? '';
  await page.waitForTimeout(2_500);
  await expect(timeLeft).toHaveText(frozen);

  await dialog.getByRole('button', { name: 'Resume' }).click();
  await expect(dialog).toBeHidden();
  await expect(timeLeft).not.toHaveText(frozen, { timeout: 5_000 });
});