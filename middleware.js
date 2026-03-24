import { NextResponse } from 'next/server'; // Vercel використовує цей імпорт для Edge Middleware

export function middleware(request) {
  const url = new URL(request.url);

  // Перехоплюємо тільки запити на наш маскований шлях
  if (url.pathname.startsWith('/v-status')) {
    const posthogPath = url.pathname.replace('/v-status', '');
    const searchParams = url.search;
    
    // Формуємо нову адресу для PostHog
    const targetUrl = `https://eu.i.posthog.com${posthogPath}${searchParams}`;

    // Робимо проксі-запит
    return NextResponse.rewrite(targetUrl);
  }

  return NextResponse.next();
}

// Налаштування, щоб middleware працював тільки для конкретного шляху
export const config = {
  matcher: '/v-status/:path*',
};