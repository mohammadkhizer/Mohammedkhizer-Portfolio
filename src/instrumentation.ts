import * as Sentry from '@sentry/nextjs';

export function register() {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || dsn.includes('examplePublicKey')) {
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn,
      tracesSampleRate: 1.0,
      debug: false,
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn,
      tracesSampleRate: 1.0,
      debug: false,
    });
  }
}
