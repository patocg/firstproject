/** @type {import('next').NextConfig} */

const nextConfig = {
  // ✅ Headers de Segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Previne MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Impede clickjacking (apenas DENY)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Proteção contra XSS
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Política de referrer
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Força HTTPS (para produção)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Content Security Policy (básico, pode expandir depois)
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; img-src * data:; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },

  // ✅ Rate Limiting (já configurado)
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;