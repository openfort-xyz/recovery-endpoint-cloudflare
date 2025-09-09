export interface Env {
  SHIELD_PUBLISHABLE_KEY: string;
  SHIELD_SECRET_KEY: string;
  SHIELD_ENCRYPTION_SHARE: string;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    
    if (url.pathname !== '/api/shield-session') {
      return new Response('Not Found', { status: 404 });
    }
    
    try {
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

      if (!r.ok) return new Response('[OPENFORT] Shield failed to authorize keys. Please check your .env keys and try again.', { status: 502 });

      const json = await r.json();
      return Response.json({ session: json.session_id });
    } catch (e) {
      return new Response('[OPENFORT] Shield internal server error. Please contact the Openfort team at https://t.me/openfort', { status: 500 });
    }
  },
};