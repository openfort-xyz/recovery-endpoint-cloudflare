export interface Env {
  SHIELD_PUBLISHABLE_KEY: string;
  SHIELD_SECRET_KEY: string;
  SHIELD_ENCRYPTION_SHARE: string;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname !== '/api/shield-session') {
      console.warn('[OPENFORT] Request to unknown endpoint:', url.pathname);
      return new Response('Not Found', { status: 404 });
    }

    // Check for required environment variables
    if (!env.SHIELD_PUBLISHABLE_KEY || !env.SHIELD_SECRET_KEY || !env.SHIELD_ENCRYPTION_SHARE) {
      console.error('[OPENFORT] Missing required environment variables. SHIELD_PUBLISHABLE_KEY, SHIELD_SECRET_KEY, or SHIELD_ENCRYPTION_SHARE is not set.');
      return new Response(JSON.stringify({ error: '[OPENFORT] Missing required environment variables.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      console.log('[OPENFORT] Incoming request to /api/shield-session');

      const r = await fetch('https://shield.openfort.io/project/encryption-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.SHIELD_PUBLISHABLE_KEY,
          'x-api-secret': env.SHIELD_SECRET_KEY,
        },
        body: JSON.stringify({
          encryption_part: env.SHIELD_ENCRYPTION_SHARE,
        }),
      });

      if (!r.ok) {
        const text = await r.text();
        console.error(`[OPENFORT] Shield failed to authorize keys. Status: ${r.status}. Response: ${text}`);
        return new Response(
          JSON.stringify({ error: '[OPENFORT] Shield failed to authorize keys. Please check your .env keys and try again.' }),
          { status: 502, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const json = await r.json();
      console.log('[OPENFORT] Successfully created shield session:', json.session_id);
      return Response.json({ session: json.session_id });
    } catch (e) {
      console.error('[OPENFORT] Shield internal server error:', e);
      return new Response(
        JSON.stringify({ error: '[OPENFORT] Shield internal server error. Please contact the Openfort team at https://t.me/openfort' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};