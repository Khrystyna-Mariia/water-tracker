import fetch from 'node-fetch';

export default async function handler(req, res) {
  const url = 'https://eu.i.posthog.com' + req.url; // додаємо шлях
  const response = await fetch(url, {
    method: req.method,
    headers: {
      ...req.headers,
      host: 'eu.i.posthog.com'
    },
    body: req.method === 'POST' ? req.body : undefined,
  });

  const data = await response.text();
  res.status(response.status).send(data);
}