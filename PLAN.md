# PLAN: Creator Repurposing + Scheduling Tool (working name: "Repostr")

> Hand this file to Claude Code as the project brief. Work milestone by milestone. Do not start the next milestone until the current one's acceptance criteria pass.

## 1. One-line pitch

Paste a YouTube link, podcast episode, or transcript. Get 10-20 ready-to-post pieces (X threads, LinkedIn posts, short captions, a newsletter draft) in the creator's own voice, then schedule them from a simple calendar.

## 2. Why this idea (keep scope small)

- Small, solo creators and consultants hate rewriting one piece of content for five platforms.
- Existing tools are either video-clip heavy (expensive, complex) or pure schedulers (no repurposing). The wedge is text-first repurposing + scheduling in one place.
- Goal is a small, profitable, sellable product: target $300-1,500/month recurring, not a unicorn.
- Price anchor: $9-19/month for solo creators. Free tier of 3 repurposes per month.

## 3. Non-goals (do NOT build in v1)

- No video editing, clipping, or rendering.
- No TikTok or Instagram publishing (their APIs require app review and business accounts; revisit later).
- No team seats, roles, or approval workflows.
- No mobile app. Responsive web only.
- No analytics dashboard beyond basic post status.

## 4. Target user

Solo creator, coach, or consultant who publishes one long-form piece weekly (YouTube, podcast, blog) and wants more reach from it without extra writing time.

## 5. Tech stack (defaults; change only with a written reason)

- App: Next.js (App Router) + TypeScript + Tailwind
- DB: Postgres (Neon or Supabase) with Drizzle or Prisma
- Auth: Clerk or Auth.js (email + Google)
- Payments: Stripe Checkout + Customer Portal + webhooks
- AI: Anthropic API (Claude) for generation; keep model name in one config constant
- Background jobs: Inngest, or a simple cron + jobs table, for scheduled publishing
- Transcripts: YouTube transcript fetch (maintained library or official captions API where permitted), plus manual paste/upload fallback
- Hosting: Vercel
- Email: Resend (transactional)
- Tests: Vitest for logic, Playwright for 2-3 critical flows

Before using any third-party API, read its current docs and terms. Do not assume pricing, rate limits, or approval requirements; verify and note them in docs/integrations.md.

## 6. Data model (starting point)

- users (id, email, plan, stripe_customer_id, created_at)
- voice_profiles (id, user_id, name, sample_posts text, tone_notes text)
- sources (id, user_id, type [youtube|podcast|text], url, title, transcript text, created_at)
- generations (id, source_id, voice_profile_id, status, model, created_at)
- posts (id, generation_id, user_id, platform [x|linkedin|threads|bluesky|newsletter], body text, status [draft|scheduled|published|failed], scheduled_at, published_at, external_id, error)
- connected_accounts (id, user_id, platform, encrypted_token, refresh_token, expires_at)
- usage (user_id, month, repurposes_used)

Encrypt all OAuth tokens at rest. Never log tokens or transcripts.

## 7. Milestones

### M0: Setup (half a day)

- [ ] Init repo, TypeScript, lint, formatting, env validation (zod)
- [ ] .env.example, README with run instructions
- [ ] CI running lint + tests
      Done when: npm run dev, npm test, npm run build all pass from a clean clone.

### M1: Core repurposing without accounts (2-3 days)

- [ ] Landing page with a live demo box (paste text, get 3 sample posts, no login)
- [ ] Source input: paste transcript, or YouTube URL with transcript fetch and a clear error plus paste fallback when unavailable
- [ ] Generation pipeline: chunk long transcripts, extract key ideas, then generate per-platform posts with platform-specific rules (length limits, hooks, thread structure, no hashtag spam)
- [ ] Output view: editable cards per post, copy button
- [ ] Prompts stored in /prompts with versioning, not inline strings
      Done when: a 30-minute transcript produces 10+ distinct, usable posts in under 60 seconds, and a unit test checks every output respects platform length limits.

### M2: Accounts, voice, and usage limits (2 days)

- [ ] Auth, dashboard listing past sources and generations
- [ ] Voice profile: user pastes 3-5 past posts; generation uses them as style examples
- [ ] Free tier limit (3 repurposes/month) enforced server-side
- [ ] Basic abuse protection: rate limit per user and per IP, max transcript length
      Done when: two test users get separate data, limits enforce correctly, and the voice profile visibly changes output tone.

### M3: Payments (1-2 days)

- [ ] Stripe products: Free, Pro ($12/month or $99/year placeholder)
- [ ] Checkout, customer portal, webhook handling (idempotent), plan stored on user
- [ ] Pro lifts limits; downgrade handled gracefully
      Done when: a full test-mode upgrade, renewal, and cancel cycle works, and webhook replays do not double-apply.

### M4: Scheduling and publishing (3-4 days)

- [ ] Calendar/list view to set a date and time per post (timezone aware, stored in UTC)
- [ ] Connect accounts via OAuth for LinkedIn and one more easy platform (Bluesky or Threads). Treat X as optional; verify its current API access and cost before building.
- [ ] Background job publishes due posts, retries with backoff, marks failures with a readable error and an email notice
- [ ] "Copy and post manually" fallback for any platform not connected
      Done when: a scheduled post publishes within 2 minutes of its time on a test account, failures retry and surface clearly, and no duplicate posts occur.

### M5: Polish and sellability (2-3 days)

- [ ] Onboarding flow (3 steps max), empty states, error states
- [ ] Terms, privacy policy, and a data deletion button
- [ ] Basic admin page: users, MRR, usage, errors
- [ ] Event tracking: signup, first generation, first scheduled post, upgrade
- [ ] Docs: ARCHITECTURE.md, RUNBOOK.md, docs/integrations.md, and a one-page handover doc listing every account, key, and service needed to run it
      Done when: a stranger can sign up, repurpose, schedule, and pay without help, and a new owner could deploy from the handover doc alone.

## 8. Quality rules for the agent

1. Make small commits with clear messages, one logical change each.
2. Write tests for pipeline logic and webhooks before moving on.
3. Never hardcode secrets. Use env vars and validate them at startup.
4. Keep AI prompts and platform rules in files, easy to tune without code changes.
5. Handle every external call failing: timeouts, retries, user-facing messages.
6. Keep a DECISIONS.md log for any deviation from this plan.
7. If something is ambiguous or needs an account, key, or paid service, stop and ask the owner instead of guessing.
8. Prefer boring, well-known libraries over clever ones.

## 9. Launch and validation (owner tasks, not for the agent)

- Post the demo in 3 creator communities and collect 10 real sign-ups before adding features.
- Offer 5 early users a discounted annual plan to get first revenue.
- Track from day one: signups, activation (first generation), paid conversion, churn, MRR. Keep Stripe records clean, since verified revenue is what makes the project sellable later.
- Check your employment agreement for IP and side-project rules before launch.

## 10. Selling later: keep the asset clean

- Own the domain, Stripe account, and hosting accounts under your own name or business, not a shared login.
- Keep the repo tidy with docs and tests so a buyer can run it in a day.
- Keep a spreadsheet of monthly revenue, costs, and churn.
- List on Acquire.com or Flippa once there are a few months of real revenue history.

## 11. First instruction to the agent

"Read PLAN.md fully. Start with M0 only. When M0's acceptance criteria pass, summarize what you built, list any decisions in DECISIONS.md, and wait for my go-ahead before M1."
