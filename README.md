# Recovery Endpoint - Cloudflare Workers

One-click deploy Openfort Shield recovery endpoint on Cloudflare Workers.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/openfort-xyz/recovery-endpoint-cloudflare)

## Environment Variables

Set these in the Cloudflare Workers dashboard during deployment:

- `SHIELD_PUBLISHABLE_KEY`: Your Shield publishable API key
- `SHIELD_SECRET_KEY`: Your Shield secret API key  
- `SHIELD_ENCRYPTION_SHARE`: Your Shield encryption share

## API Endpoint

Creates a POST endpoint that:

1. Accepts a POST request
2. Calls the Shield encryption-session API
3. Returns the session ID

**Response format:**
```json
{
  "session": "session_id_here"
}
```

## Local Development

```bash
npm install -g wrangler
wrangler dev
```

## Features

- Global edge network
- Automatic scaling
- Built-in environment variable management
- TypeScript support

## Support

For issues with Openfort Shield: [Openfort Documentation](https://www.openfort.xyz/docs)

For Cloudflare Workers: [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

## License

MIT