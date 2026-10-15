# Decisions

Log of choices and deviations from PLAN.md. Newest first.

## 2026-10-15 (M0)

### Node 24 LTS as the target runtime; Vitest pinned to v4

- **Context:** The dev machine runs Node 20.20, which reached end-of-life in
  April 2026. Vitest 5 (current major) requires Node 22.12+.
- **Decision:** `.nvmrc` and CI use Node 24 LTS (what Vercel targets).
  `engines` allows `>=20.19` so the project still runs on the current local
  machine. Vitest is pinned to `^4` because it supports Node 20.
- **Follow-up:** Once local dev is on Node 22+, bump `vitest` to `^5`,
  `@types/node` to `^24`, and `engines` to `>=22.12`.

### Lockfile generated with npm 11

- **Context:** npm 10.8.2 crashes with `Cannot read properties of null
(reading 'edgesOut')` while resolving Vitest's optional peer deps. This is an
  npm arborist bug, not a real dependency conflict.
- **Decision:** Generated `package-lock.json` once with `npx npm@11 install`.
  `npm ci` on npm 10 installs from that lockfile without issue. Upgrading npm
  globally fixes it permanently.

### Accept `npm audit` "high" findings in dev-only lint tooling

- **Context:** `npm audit` reports 5 high-severity issues (`braces` via
  `fast-glob` → `@next/eslint-plugin-next`). They only affect ESLint at dev
  time, not the shipped app. npm's only suggested fix downgrades
  `eslint-config-next` to 14.x, which is incompatible with Next 16.
- **Decision:** Leave them for now and re-check when `eslint-config-next`
  updates.

### Env validation via a plain zod schema (no extra library)

- **Context:** The plan calls for zod env validation.
- **Decision:** One schema in `src/env.ts`, imported by `next.config.ts` so
  dev and build fail fast. I used zod directly rather than a wrapper like
  t3-env, keeping to the plan's "boring libraries" rule. Errors list variable
  names only, never values.
- M0 defines only `NODE_ENV` and `NEXT_PUBLIC_APP_URL` (defaults to
  localhost). Each later milestone adds its own vars as required (no
  placeholders or optional-but-actually-required vars).

### Prettier + eslint-config-prettier for formatting

- The plan says "lint, formatting" without naming a tool. Prettier is the
  default choice, with the Tailwind class-sorting plugin and
  `eslint-config-prettier` to stop the two tools from conflicting.

### Project lives in `repostr/`

- The workspace folder ("personal projects") is a general folder, so the app
  is its own git repo in `repostr/`. PLAN.md is copied into the repo.
