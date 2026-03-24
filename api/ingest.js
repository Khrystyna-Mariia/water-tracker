import fetch from 'node-fetch';

export default async function handler(req, res) {
  const url = 'https://eu.i.posthog.com' + req.url; // додаємо все після /ingest
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: 'eu.i.posthog.com', 
        'Content-Type': 'application/json'
      },
      body: req.method === 'POST' ? req.body : undefined
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).send('Error proxying PostHog request');
  }
}