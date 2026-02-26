// next.config.js
/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-RateLimit-Limit',
            value: '100', // 100 requisições
          },
          {
            key: 'X-RateLimit-Window',
            value: '60', // Por minuto
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
