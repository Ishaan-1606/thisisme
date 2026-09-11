/**
 * Marks a browser as belonging to the site owner so that your own visits are
 * excluded from the public counter. Set OWNER_KEY in the environment and visit
 * the site once as `https://yoursite.com/?owner=<OWNER_KEY>`.
 */
export const OWNER_COOKIE = "pv_owner"

export const ownerCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // one year
}
