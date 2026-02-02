import { test, expect } from 'playwright/test';

const VALID_EMAIL = 'rafael.horauti@gmail.com';
const VALID_PASSWORD = 'Teste123!';

test('it should login page with corrected e-mail and password and redirect to dashboard page', async ({
  page,
}) => {
  await page.goto(`${process.env.NEXT_PUBLIC_NEXT_URL || ''}/login`);

  const email = page.getByLabel('E-mail');
  await email.fill(VALID_EMAIL);
  const password = page.getByLabel('Senha');
  await password.fill(VALID_PASSWORD);

  const button = page.getByRole('button', { name: 'Entrar' });
  await button.click();

  const successToast = page.getByText('Login efetuado com sucesso!');
  await expect(successToast).toBeVisible({ timeout: 10000 });

  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await expect(page).toHaveURL(/.*\/dashboard/);
});
