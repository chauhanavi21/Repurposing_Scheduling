# Repostr

Paste a YouTube link, podcast episode, or transcript and get ready-to-post
content for X, LinkedIn, Threads, Bluesky, and newsletters in your own voice,
then schedule it. See [PLAN.md](PLAN.md) for the product brief and milestones,
and [DECISIONS.md](DECISIONS.md) for deviations from it.

## Requirements

- Node.js 24 LTS (see `.nvmrc`). Node 20.19+ still works for now but is
  end-of-life.
- npm 10+

## Run locally

```bash
npm ci
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Environment variables are validated at startup by [src/env.ts](src/env.ts).
If one is missing or malformed, `npm run dev` and `npm run build` fail and
print the variable name (never its value). To add a variable, add it to the
schema in `src/env.ts` and to `.env.example`.

## Scripts

| Command                | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Start the dev server                             |
| `npm run build`        | Production build                                 |
| `npm start`            | Serve the production build                       |
| `npm test`             | Run unit tests once (Vitest)                     |
| `npm run test:watch`   | Run unit tests in watch mode                     |
| `npm run lint`         | ESLint                                           |
| `npm run format`       | Format everything with Prettier                  |
| `npm run format:check` | Fail if anything is unformatted                  |
| `npm run typecheck`    | TypeScript type check                            |
| `npm run check`        | Lint + format check + typecheck + tests (pre-PR) |

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs lint, format
check, typecheck, tests, and build on every push to `main` and every pull
request.

## Stack

Next.js (App Router) + TypeScript + Tailwind, zod for env validation, Vitest
for tests. Database, auth, payments, AI, and jobs are added in later
milestones per PLAN.md.
