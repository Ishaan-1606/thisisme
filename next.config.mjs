/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: `output: 'export'` was removed. Visitor analytics, the guestbook and
  // the private /insights dashboard all need server-side API routes, which a
  // static export cannot provide. The site now runs as a normal Next.js server
  // build (`next build` + `next start`, or a Vercel deployment).
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
