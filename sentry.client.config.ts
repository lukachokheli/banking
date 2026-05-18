// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://98943c4b7e7bbe89ff6e3f5bb24d60a3@o4511405102399488.ingest.de.sentry.io/4511405156466768",
  tracesSampleRate: 1.0,
  debug: false,
});