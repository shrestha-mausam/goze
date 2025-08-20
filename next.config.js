/** @type {import('next').NextConfig} */
const nextConfig = {
  // We're handling HTTPS redirect in middleware.ts instead
  // No additional headers needed here since we're manually checking
  // x-forwarded-proto in the middleware
}

module.exports = nextConfig; 