import type { NextConfig } from 'next';
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Strip all console.* outputs from the build
  compiler: {
    removeConsole: true,
  },
  // Security headers for HTTPS-only and protection
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.google-analytics.com https://www.googletagmanager.com https://browser.sentry-cdn.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://placehold.co https://picsum.photos https://techaura26.netlify.app https://portfolioimageskhizer.netlify.app https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://*.googleapis.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://*.sentry.io; frame-src 'self'; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'techaura26.netlify.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'portfolioimageskhizer.netlify.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
  outputFileTracingRoot: process.cwd(),
  webpack: (config) => {
    config.infrastructureLogging = { level: 'error' };
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push({
      message: /Serializing big strings/i,
    });
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  org: "personal-brand-portfolio",
  project: "mohammad-khizer-portfolio",

  // Silence verbose Sentry logs in build
  silent: true,
  telemetry: false,

  // Disable sourcemaps upload when auth token is absent
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and error reports
  reactComponentAnnotation: {
    enabled: true,
  },

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  automaticVercelMonitors: false,
});

