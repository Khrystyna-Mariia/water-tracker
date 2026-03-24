export default async function handler(req, res) {
  // PostHog SDK додає шлях після /v-status, наприклад /e/ або /decide/
  // Ми отримуємо повний URL і замінюємо наш проксі-шлях на оригінальний
  const targetPath = req.url.replace('/api/v-status', '');
  const targetUrl = `https://eu.i.posthog.com${targetPath}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': req.headers['x-forwarded-for'] || '',
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    
    // Важливо: копіюємо статус і дані назад клієнту
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}