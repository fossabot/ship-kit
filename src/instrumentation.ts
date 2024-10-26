import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "lacy-nextjs-app",
    // Add any additional configuration options here
  });
}
