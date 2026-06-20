// Cloudflare Worker — a tiny, free, reliable CORS proxy for the WC26 app.
// Deploy this, then set CUSTOM_PROXY in index.html to:
//   'https://wc26.YOURNAME.workers.dev/?url='
// It fetches any allowed URL server-side (no CORS in the browser) and adds the
// access-control header so the app can read it. Locked to ESPN for safety.
export default {
  async fetch(request) {
    const cors = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const target = new URL(request.url).searchParams.get('url');
    if (!target || !target.startsWith('https://site.api.espn.com/')) {
      return new Response('blocked', { status: 400, headers: cors });
    }
    const upstream = await fetch(target, { cf: { cacheTtl: 60, cacheEverything: true } });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'public, max-age=60' },
    });
  },
};
