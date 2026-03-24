export function middleware(request) {
  const url = new URL(request.url);

  // Якщо запит іде на наш маскований шлях
  if (url.pathname.startsWith('/v-status')) {
    // Формуємо новий шлях, замінюючи /v-status на порожній рядок
    const posthogPath = url.pathname.replace(/^\/v-status/, '');
    
    // Створюємо цільову адресу (якщо шлях порожній після заміни, додаємо /)
    const targetUrl = `https://eu.i.posthog.com${posthogPath || '/'}${url.search}`;

    // Робимо rewrite (підміну) запиту
    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      duplex: 'half', // Потрібно для пересилання тіла запиту (POST) в Edge Runtime
    });
  }

  // Якщо це не аналітика, просто пропускаємо запит далі
  return Response.next?.() || fetch(request);
}

// Налаштування для Vercel, щоб не запускати код на кожен файл
export const config = {
  matcher: '/v-status/:path*',
};