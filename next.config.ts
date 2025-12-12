/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // ...o que você já tiver aqui
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

module.exports = nextConfig;
