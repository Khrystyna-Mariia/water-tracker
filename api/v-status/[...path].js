export default async function handler(req, res) {
  // Отримуємо частину після /api/v-status/
  // Наприклад, якщо запит /api/v-status/e/?ip=0, то urlPath буде /e/?ip=0
  const urlPath = req.url.split('/api/v-status')[1];
  const targetUrl = `https://eu.i.posthog.com${urlPath}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': req.headers['x-forwarded-for'] || '',
      },
      // Для POST запитів передаємо тіло
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Internal Proxy Error' });
  }
}