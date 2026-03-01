/** @type {import('next').NextConfig} */

const nextConfig = {
  // ✅ Configuração de imagens (para next/image)
  images: {
    unoptimized: true, // Desativa otimização automática (opcional, dependendo do uso)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "img.shields.io",
      },
      {
        protocol: "https",
        hostname: "komarev.com",
      },
      {
        protocol: "https",
        hostname: "jnths-family-album.s3.sa-east-1.amazonaws.com",
        // opcional: pathname: "/album/**",
      },
    ],
    minimumCacheTTL: 14400, // 4 horas de cache das imagens otimizadas
  },

  // ✅ Headers
  async headers() {
    return [
      {
        // ✅ Headers de Segurança (mantidos com comentários)
        source: "/:path*",
        headers: [
          // Previne MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Impede clickjacking (apenas DENY)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Proteção contra XSS
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Política de referrer
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Força HTTPS (para produção)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' cdn.jsdelivr.net",
              "img-src * data:",
              "style-src 'self' 'unsafe-inline'",
              "connect-src 'self' https://jnths-family-album.s3.sa-east-1.amazonaws.com",
              "font-src 'self' data:",
            ].join("; "),
          },
        ],
      },

      // ✅ Cache longo para assets internos do Next (_next/static)
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ✅ Cache intermediário para imagens em /public/images
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000", // 30 dias
          },
        ],
      },
    ];
  },

  // ✅ Redirects (já configurado)
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
