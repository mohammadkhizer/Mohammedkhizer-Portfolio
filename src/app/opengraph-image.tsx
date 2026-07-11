import { ImageResponse } from 'next/og';

// Dynamic Open Graph image for the homepage.
// Next.js automatically serves this at /opengraph-image (used in layout.tsx metadata).
// Using Edge runtime for fastest cold-start — important for social crawlers.
export const runtime = 'edge';
export const alt = 'Mohammed Khizer Shaikh — Full-Stack Developer & AI/ML Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 60%, #0a0a0a 100%)',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Brand mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              fontSize: '28px',
              fontWeight: '900',
              color: '#ffffff',
              letterSpacing: '-1px',
            }}
          >
            MK
          </span>
          <span style={{ fontSize: '28px', fontWeight: '900', color: '#f97316' }}>.</span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: '1.1',
            letterSpacing: '-2px',
            marginBottom: '16px',
          }}
        >
          Mohammed Khizer{' '}
          <span style={{ color: '#f97316' }}>Shaikh</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '26px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: '40px',
            letterSpacing: '0.5px',
          }}
        >
          Full-Stack Developer &amp; AI/ML Engineer
        </div>

        {/* Tech badges */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['React', 'Next.js', 'Python', 'MongoDB', 'Django', 'TypeScript'].map((tech) => (
            <div
              key={tech}
              style={{
                padding: '6px 16px',
                borderRadius: '100px',
                background: 'rgba(249,115,22,0.12)',
                border: '1px solid rgba(249,115,22,0.3)',
                color: '#f97316',
                fontSize: '16px',
                fontWeight: '700',
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* Location */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '80px',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: '600',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Ahmedabad, India
        </div>
      </div>
    ),
    { ...size },
  );
}
