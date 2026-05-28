Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
pnpm install
pnpm build
pnpm dev

 Ishaan Sharma Portfolio Website

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
