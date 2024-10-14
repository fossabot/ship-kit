import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: 'logflare-nextjs-app',
    // Add any additional configuration options here
  });
}
