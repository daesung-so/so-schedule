const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // ── /api/board (공지·투표·휴가) ──
    if (url.pathname === '/api/board') {
      if (request.method === 'GET') {
        const data = await env.SO_KV.get('board');
        const body = data ?? JSON.stringify({ notices: [], votes: [], vacations: [] });
        return new Response(body, { headers: CORS });
      }
      if (request.method === 'PUT') {
        const body = await request.text();
        await env.SO_KV.put('board', body);
        return new Response(JSON.stringify({ ok: true }), { headers: CORS });
      }
    }

    // ── /api/overrides (긴급수정) ──
    if (url.pathname === '/api/overrides') {
      if (request.method === 'GET') {
        const data = await env.SO_KV.get('overrides');
        const body = data ?? '{}';
        return new Response(body, { headers: CORS });
      }
      if (request.method === 'PUT') {
        const body = await request.text();
        await env.SO_KV.put('overrides', body);
        return new Response(JSON.stringify({ ok: true }), { headers: CORS });
      }
    }

    // ── /api/temperature (온습도 점검) ──
    if (url.pathname === '/api/temperature') {
      if (request.method === 'GET') {
        const data = await env.SO_KV.get('temperature');
        const body = data ?? '[]';
        return new Response(body, { headers: CORS });
      }
      if (request.method === 'PUT') {
        const body = await request.text();
        await env.SO_KV.put('temperature', body);
        return new Response(JSON.stringify({ ok: true }), { headers: CORS });
      }
    }

    // ── /api/ping (연결 테스트) ──
    if (url.pathname === '/api/ping') {
      return new Response(JSON.stringify({ ok: true }), { headers: CORS });
    }

    // 그 외 → static assets (index.html)
    return env.ASSETS.fetch(request);
  },
};
