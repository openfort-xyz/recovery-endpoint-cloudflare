export interface Env {
  SHIELD_PUBLISHABLE_KEY: string;
  SHIELD_SECRET_KEY: string;
  SHIELD_ENCRYPTION_SHARE: string;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
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

      if (!r.ok) return new Response('Failed to authorize user', { status: 502 });

      const json = await r.json();
      return Response.json({ session: json.session_id });
    } catch (e) {
      return new Response('Internal server error', { status: 500 });
    }
  },
};