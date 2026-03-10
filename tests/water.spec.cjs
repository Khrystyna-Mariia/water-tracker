const { test, expect } = require('@playwright/test');

test.describe('Критичний шлях Water Tracker', () => {
  
  test('Користувач може додавати воду та зберігати прогрес після оновлення', async ({ page }) => {
    // 1. Відкриваємо сторінку (зміни порт на той, що у твого Vite, зазвичай 5173)
    await page.goto('http://localhost:5173');

    // 2. Перевіряємо початковий стан
    await expect(page.locator('.amount')).toContainText('0 / 2000 мл');

    // 3. Натискаємо кнопку "+ 250 мл" двічі
    const addButton = page.getByRole('button', { name: '+ 250 мл' });
    await addButton.click();
    await addButton.click();

    // 4. Перевіряємо, чи змінився текст та прогрес-бар (500 мл = 25%)
    await expect(page.locator('.amount')).toContainText('500 / 2000 мл');
    await expect(page.locator('.percentage')).toContainText('25%');

    // 5. Оновлюємо сторінку (тестуємо роботу LocalStorage у реальних умовах)
    await page.reload();

    // 6. Перевіряємо, чи дані залишилися на місці
    await expect(page.locator('.amount')).toContainText('500 / 2000 мл');
    await expect(page.locator('.percentage')).toContainText('25%');
  });

  test('Користувач може скинути денний прогрес', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Додаємо воду
    await page.getByRole('button', { name: '+ 250 мл' }).click();
    
    // Натискаємо "Скинути день"
    await page.getByRole('button', { name: 'Скинути день' }).click();
    
    // Перевіряємо результат
    await expect(page.locator('.amount')).toContainText('0 / 2000 мл');
  });
});
