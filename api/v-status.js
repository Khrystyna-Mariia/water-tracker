export default async function handler(req, res) {
  // Отримуємо параметри запиту (наприклад, ?ip=0...)
  const { url } = req;
  const posthogPath = url.replace('/api/v-status', '');
  
  // Формуємо повну адресу до PostHog
  const targetUrl = `https://eu.i.posthog.com${posthogPath || '/'}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': req.headers['x-forwarded-for'] || '',
      },
      // Передаємо тіло запиту, якщо це POST
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}