# Ishaan Sharma Portfolio Website

Personal portfolio website built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and shadcn/ui components.

## Requirements

- Node.js 20 or newer
- pnpm

If pnpm is not installed, enable it with Corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Run Locally

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the app in your browser:

```text
http://localhost:3000
```

Build the production app:

```bash
pnpm build
```

Run the production build locally:

```bash
pnpm start
```

## Available Scripts

```bash
pnpm dev
```

Runs the Next.js development server.

```bash
pnpm build
```

Creates a production build.

```bash
pnpm start
```

Starts the production server after `pnpm build`.

```bash
pnpm lint
```

Runs ESLint against the project after ESLint has been added and configured. The script exists in `package.json`, but ESLint is not currently installed.


## Visitor Analytics

The site records who is looking at it, stores the data in Neon Postgres, and
exposes it in two places:

| Surface | Who sees it | What it shows |
| --- | --- | --- |
| Footer counter | Everyone | Total views, unique visitors, views in the last 24h, countries |
| `#guestbook` | Everyone | Signatures visitors chose to leave (name, role, company, note) |
| `/insights` | You only, password gated | Traffic charts, referrers, countries, devices, tracked links, recent visits, guestbook moderation |

### What this can and cannot tell you

It **can** tell you how many people came, roughly where from, what referred
them, and which of your shared links they opened. It **cannot** tell you a
visitor's name or email - browsers do not expose that. Names only arrive when
someone signs the guestbook or uses the contact form.

### Privacy

Raw IP addresses are never written to the database. An IP is combined with
`VISITOR_SALT` and SHA-256 hashed into an opaque id used purely to count unique
people. The public counter shows totals only - never an individual.

### Setup

1. Create a free project at [neon.tech](https://neon.tech) and copy the
   **pooled** connection string.
2. Copy the env template and fill it in:

```bash
cp .env.example .env.local
```

3. Generate the two secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Start the app. Tables are created automatically on the first request - there
   is no migration step to run.

```bash
pnpm dev
```

5. Open `http://localhost:3000/insights` and unlock it with `INSIGHTS_PASSWORD`.

### Excluding your own visits

Visit `https://yoursite.com/?owner=<OWNER_KEY>` once in each browser you use.
That browser is flagged, and your views are then excluded from every count.

### Tracked links

In `/insights` -> **Tracked links**, create a code such as `google-hr`. Share
the generated `https://yoursite.com/?ref=google-hr` with that one person. When
it is opened, the code appears against the visit. The `ref` parameter is
stripped from the address bar on arrival, so the visitor never sees it.

## Deployment notes

The site is a **server** build (`output: 'export'` was removed, because static
exports cannot run API routes). Set `DATABASE_URL`, `INSIGHTS_PASSWORD`,
`INSIGHTS_SECRET`, `VISITOR_SALT` and `OWNER_KEY` as environment variables on
your host.

City and country come from edge headers that Vercel and Cloudflare add
automatically. On a plain Node host such as Render those headers are absent and
the geo columns stay empty - every other metric still works.

## Deploy to Render

This project can be deployed on Render as a Node.js web service.

1. Push the project to a GitHub, GitLab, or Bitbucket repository.
2. In Render, choose **New +** then **Web Service**.
3. Connect the repository.
4. Use these settings:

```text
Runtime: Node
Build Command: pnpm install --frozen-lockfile && pnpm build
Start Command: pnpm start
```

5. Add the following environment variable:

```text
NODE_ENV=production
```

6. Deploy the service.

Render provides the `PORT` environment variable automatically. `next start` will use it when the service starts.

## Setup From Scratch

Use these commands when setting this project up on a new machine:

```bash
git clone <your-repository-url>
cd portfolio-website
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm dev
```

To verify the production build before deploying:

```bash
pnpm build
pnpm start
```
