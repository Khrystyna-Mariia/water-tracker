const { test, expect } = require('@playwright/test');

test.describe('E2E: Custom Water Tracker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Перевіряємо, чи ми на сторінці логіну
    const loginHeader = page.getByText('🌊 Вхід у систему');
    
    if (await loginHeader.isVisible()) {
      // Заповнюємо форму входу
      await page.getByPlaceholder("Ваше ім'я").fill('Khrystyna');
      await page.getByPlaceholder("Ваш Email").fill('khrystyna@example.com');
      await page.getByRole('button', { name: 'Увійти' }).click();
    }

    // Чекаємо, поки з'явиться головний інтерфейс (заголовок програми)
    await expect(page.getByText('🌊 Water Balance')).toBeVisible();
  });
  
  test('Користувач може вводити довільну кількість та зберігати її', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const input = page.locator('.water-input');
    const addButton = page.getByRole('button', { name: '+ Додати' });

    // 1. Вводимо 600 мл
    await input.fill('600');
    await addButton.click();

    // Перевіряємо загальну суму
    await expect(page.locator('.amount')).toContainText('600 / 2000 мл');
    
    await expect(page.locator('.glasses-count')).toContainText('Випито склянок: 2');

    // 2. Оновлюємо сторінку — перевіряємо LocalStorage
    await page.reload();
    await expect(page.locator('.amount')).toContainText('600 / 2000 мл');
    await expect(input).toHaveValue('600');
  });

  test('Кнопка видалення працює з динамічним значенням', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const input = page.locator('.water-input');
    const addButton = page.getByRole('button', { name: '+ Додати' });
    const removeButton = page.getByRole('button', { name: '- Видалити' });

    // Додаємо 1000
    await input.fill('1000');
    await addButton.click();

    // Видаляємо 500
    await input.fill('500');
    await removeButton.click();

    await expect(page.locator('.amount')).toContainText('500 / 2000 мл');
  });
});