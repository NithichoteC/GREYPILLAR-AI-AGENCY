/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export for development - enable only for production build
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Keep existing HTML files accessible
  async rewrites() {
    return [
      {
        source: '/contact',
        destination: '/contact.html'
      },
      {
        source: '/calendar',
        destination: '/calendar.html'
      },
      {
        source: '/booking-confirmed',
        destination: '/booking-confirmed.html'
      }
    ];
  }
};

module.exports = nextConfig;