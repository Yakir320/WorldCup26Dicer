// Cloudflare Worker — free CORS proxy for the WC26 app. Handles two routes:
//   1) ESPN passthrough:   /?url=https://site.api.espn.com/...
//   2) API-Football proxy: /?fb=fixtures?ids=123-456   (key added server-side, never exposed)
//
// Deploy at e.g. https://wc26.YOURNAME.workers.dev, then in index.html set:
//   FB_PROXY     = 'https://wc26.YOURNAME.workers.dev/?fb='     (player ratings)
//   CUSTOM_PROXY = 'https://wc26.YOURNAME.workers.dev/?url='    (ESPN, optional)
//
// The API key sits ONLY here on Cloudflare's edge — it is NOT downloadable by visitors.
const APISPORTS_KEY = 'a3768ee42778ab253e173fec6fc003e8';

export default {
  async fetch(request) {
    const cors = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    const params = new URL(request.url).searchParams;

    // 1) API-Football (key attached here, server-side)
    const fb = params.get('fb');
    if (fb) {
      const upstream = await fetch('https://v3.football.api-sports.io/' + fb, {
        headers: { 'x-apisports-key': APISPORTS_KEY },
        cf: { cacheTtl: 600, cacheEverything: true },
      });
      const body = await upstream.text();
      return new Response(body, {
        status: upstream.status,
        headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'public, max-age=600' },
      });
    }

    // 2) ESPN passthrough (locked to ESPN for safety)
    const target = params.get('url');
    if (target && target.startsWith('https://site.api.espn.com/')) {
      const upstream = await fetch(target, { cf: { cacheTtl: 60, cacheEverything: true } });
      const body = await upstream.text();
      return new Response(body, {
        status: upstream.status,
        headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'public, max-age=60' },
      });
    }
    return new Response('blocked', { status: 400, headers: cors });
  },
};
