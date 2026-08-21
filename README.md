# Dallas Walker — Portfolio

Personal portfolio site. Multi-page Next.js (App Router) app with a persistent
sidebar navigation, a "terminal system" visual aesthetic, and a hybrid AI
assistant grounded in real resume facts.

- **Live plan:** [docs/plan/portfolio-v2.md](docs/plan/portfolio-v2.md)
- **Design reference (visual/structural only, all content placeholder):**
  `Rough Draft/roughDraft.txt`
- **Previous static site (retired):** `old_stuff/`

## Status

**Phases 1-5 complete.** Navigation shell, design system, and routing are
live; `/projects` is real (typed data, language + complexity filtering,
project detail modal, null-safe resume/repo states); `/experience`,
`/achievements`, `/skills`, and `/about` are populated with real content
sourced from the resume (Appendix A of the plan); `/contact` is a real form
wired to `POST /api/contact` (Resend + validation + honeypot + rate limit);
and `/ai-terminal` is a real hybrid AI assistant — hosted Claude Haiku 4.5
for the first 5 questions (quota enforced server-side), then a lazy-loaded
in-browser WebLLM fallback.

| Phase | Scope                                                                 | Status  |
| ----: | --------------------------------------------------------------------- | :-----: |
|     1 | Next.js + TS bootstrap, design tokens, sidebar/top-bar shell, routing | **done** |
|     2 | `data/projects.ts`, project grid + filters, image reorg, resume wiring | **done** |
|     3 | Real Experience, Achievements, Skills, About page content              | **done** |
|     4 | Contact form + `/api/contact` + Resend                                 | **done** |
|     5 | `/api/chat` (Claude Haiku 4.5) + KV free-quota + WebLLM fallback       | **done** |

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- TypeScript 6 (strict)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first `@theme` config)
- `next/font/google` for Inter + JetBrains Mono
- Material Symbols Outlined via Google Fonts stylesheet

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. Every route is real. Without the optional
API keys set (see [Environment variables](#environment-variables) below), the
site degrades gracefully rather than crashing: the contact form returns a
clear "email service not configured" message, and the AI terminal returns a
"assistant isn't configured yet" message (and, once the 5-question quota is
spent, still hands off to the fully local in-browser model in supported
browsers).

### Scripts

| Script          | What it does                                    |
| --------------- | ----------------------------------------------- |
| `npm run dev`   | Start dev server (Turbopack) on port 3000.      |
| `npm run build` | Production build. Statically pre-renders all 8 pages. |
| `npm run start` | Serve the built app.                            |
| `npm run lint`  | ESLint via `next/core-web-vitals` + `next/typescript`. |

## Project layout

```
app/                Next.js App Router routes + layout + globals.css
  layout.tsx        Root layout: fonts, Material Symbols, NavShell wrap
  page.tsx          / (Home / module directory)
  globals.css       Tailwind v4 @theme tokens ported from the Stitch export
  api/contact/route.ts  POST /api/contact — Resend email delivery (FR-11, §9)
  api/chat/route.ts     POST /api/chat — Claude Haiku 4.5 + server-side quota (§9, §11)
  <route>/page.tsx  One real page per top-level nav item

components/
  layout/           NavShell, TopBar, Sidebar, BottomNav, Footer
  ui/               PageHeader, PhaseStub, ResumeFab + ResumeModal (resume picker)
  projects/         ProjectsExplorer, ProjectCard, ProjectFilterBar, ProjectModal
  experience/       ExperienceCard (timeline entry, used for both jobs + leadership)
  achievements/     AchievementCard (decorative tier badge, real content)
  skills/           SkillCategoryCard (chip list, no invented proficiency %)
  contact/          ContactForm (client, posts to /api/contact), NetworkNodes (real links)
  ai/               AiTerminal (client chat UI: hosted flow, quota, WebLLM handoff)

data/projects.ts     Typed Project[] — real content, sourced from the resume (Appendix A)
data/experience.ts   Typed ExperienceEntry[] — real jobs + student-org leadership roles
data/achievements.ts Typed Achievement[] — real awards; year is null until owner supplies dates
data/skills.ts       Typed SkillCategory[] — real skills list, replaces old hero claims
data/about.ts        Real profile blurb + education record (no mission/values — not supplied)
config/site.ts      Brand string, GitHub / LinkedIn URLs, resumeUrls (4 variants, env-driven)
data/resumes.ts     Resume variant metadata (name + description) for the ResumeModal
lib/nav.ts          Single-source-of-truth nav item list + isActive() helper
lib/rateLimit.ts    Minimal in-memory rate limiter used by /api/contact + /api/chat
lib/aiContext.ts    Builds the assistant's system prompt from data/*.ts (shared server + client)
lib/quota.ts        Server-side free-question quota (Upstash Redis, in-memory fallback)
lib/fallbackModel.ts Lazy WebLLM loader + local inference (dynamic import, client only)
public/images/      Real project + personal images (migrated from /images/ in Phase 2)

docs/plan/          Long-form plan doc — the source of truth for phases
old_stuff/          Retired static single-page site (kept for reference)
Rough Draft/        Google Stitch export — visual reference for the design system
```

## Design system

Tokens are declared once in [`app/globals.css`](app/globals.css) as a
Tailwind v4 `@theme` block. Every color, spacing value, radius, font family,
and typography preset (`text-display-lg`, `text-code-label`, `text-ui-utility`,
etc.) mirrors the Stitch export's Tailwind config verbatim.

Reusable "chrome" utilities kept as plain CSS in the same file:

- `.glass-panel` — translucent surface + backdrop blur + top border
- `.emerald-glow` — text-shadow for emphasized primary text
- `.scanline` — 2px animated horizontal sweep for hero image tiles

## Environment variables

None are required for the site to run — every feature that needs a key
degrades gracefully without one. Set these in `.env.local` for dev and in
your host's project settings for production.

### Contact form (Phase 4)

| Variable            | Required? | Default if unset                        | Purpose |
| -------------------- | :-------: | ---------------------------------------- | ------- |
| `RESEND_API_KEY`     | for email | none — API returns a 503 "not configured" error instead of sending | Server-side Resend API key. Create one at [resend.com](https://resend.com/) → API Keys. Never commit it. |
| `CONTACT_TO_EMAIL`   | No        | `site.email` (`dallaswalker1023@gmail.com`, from `config/site.ts`) | Inbox that receives contact-form submissions. Only needed if you want a different destination than the site's main email without a code change. |
| `CONTACT_FROM_EMAIL` | No        | `Portfolio Contact <onboarding@resend.dev>` | The `from` address Resend sends as. **The default only works in testing** — Resend's shared `onboarding@resend.dev` sandbox address only delivers to your own Resend account email. Before this works for real visitors, [verify a domain in Resend](https://resend.com/domains) and set this to an address on that domain. |

### AI assistant (Phase 5)

| Variable                  | Required? | Default if unset                        | Purpose |
| ------------------------- | :-------: | ---------------------------------------- | ------- |
| `ANTHROPIC_API_KEY`       | for hosted chat | none — `/api/chat` returns a graceful 503 "assistant isn't configured yet" message | Server-side Claude API key (model `claude-haiku-4-5-20251001`). Create one at [console.anthropic.com](https://console.anthropic.com/). **Server-only — never exposed to the browser.** |
| `UPSTASH_REDIS_REST_URL`  | recommended | falls back to an in-memory per-instance quota store (fine for dev, not durable across serverless instances) | Upstash Redis REST URL, used to track the 5-free-question quota per visitor server-side (FR-6). |
| `UPSTASH_REDIS_REST_TOKEN`| recommended | (see above)                              | Upstash Redis REST token. |

> **KV note:** `@vercel/kv` is end-of-life; this project uses its upstream,
> `@upstash/redis`. `Redis.fromEnv()` also accepts the Vercel-KV-style
> `KV_REST_API_URL` / `KV_REST_API_TOKEN` names, so either pair works. On
> Vercel, add the **Upstash Redis** marketplace integration and it populates
> these for you.

### Resume downloads (`FETCH_RESUME.PDF` modal)

The four resume variants ship in `/public/resumes/`. The modal shows each with
its description and a working download by default. Env vars are optional
overrides (CDN, alternate filenames, etc.).

| Variable                         | Default if unset                     | Purpose |
| -------------------------------- | ------------------------------------ | ------- |
| `NEXT_PUBLIC_RESUME_GENERAL`     | `/resumes/general.pdf`               | Override General resume URL |
| `NEXT_PUBLIC_RESUME_AI`          | `/resumes/ai.pdf`                    | Override AI resume URL |
| `NEXT_PUBLIC_RESUME_SOFTWARE_DEV`| `/resumes/software-development.pdf`  | Override Software Dev resume URL |
| `NEXT_PUBLIC_RESUME_DATA_SCIENCE`| `/resumes/data-science.pdf`          | Override Data Science resume URL |

> Downloads work out of the box via the defaults in `config/site.ts`. Set the
> env vars only if you need to point at a different host (CDN, etc.). On
> Vercel you can still add them explicitly for clarity — same values as above.

Example `.env.local`:

```bash
# Contact form
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
# CONTACT_FROM_EMAIL="Dallas Walker <contact@yourdomain.com>"

# AI assistant
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxx

# Resume downloads (point at the in-repo PDFs)
NEXT_PUBLIC_RESUME_GENERAL=/resumes/general.pdf
NEXT_PUBLIC_RESUME_AI=/resumes/ai.pdf
NEXT_PUBLIC_RESUME_SOFTWARE_DEV=/resumes/software-development.pdf
NEXT_PUBLIC_RESUME_DATA_SCIENCE=/resumes/data-science.pdf
```

Both API routes also enforce an in-memory per-IP rate limit and (for contact)
a honeypot field — no extra infra needed for those; see the file header
comments for the tradeoffs of the in-memory approach.

## AI assistant architecture (`/ai-terminal`)

A **hybrid** design (plan §11):

1. **Hosted tier** — the first `FREE_QUESTION_LIMIT` (5) questions per visitor
   go to Claude Haiku 4.5 via `POST /api/chat`. The Claude call happens
   **server-side only**; the API key never reaches the browser. The system
   prompt is assembled at request time from `data/projects.ts`,
   `data/experience.ts`, `data/skills.ts`, and `data/about.ts` by
   `lib/aiContext.ts` — so the assistant's facts always match the rendered
   pages, with nothing hardcoded separately.
2. **Server-side quota** — a per-visitor session cookie keys a counter in
   Upstash Redis (or the in-memory fallback), capped at 5 in a rolling 24h
   window. localStorage is never trusted for enforcement.
3. **Local fallback tier** — once the quota is spent, `/api/chat` responds
   `mode: "local-handoff"` **without** calling Claude, and the UI lazy-loads a
   WebLLM model **only at that point** (`import("@mlc-ai/web-llm")` inside an
   event handler — never in the initial bundle). It then runs entirely
   on-device. The fallback model is **`Phi-3.5-mini-instruct`** (chosen over
   Gemma-2-2b for stronger instruction-following, which matters for the
   "decline rather than guess" guardrail; swap it in `lib/aiContext.ts`).
   Its system prompt is deliberately stricter: decline and point to the
   Contact page rather than risk an inaccurate answer.
4. **Graceful degradation** — missing key, API error, timeout, or a browser
   without WebGPU all resolve to a clear in-UI message, never a hard crash.

## Deployment

Not yet deployed. Target is [Vercel](https://vercel.com/) Hobby tier;
Phase 2 will add the actual project on Vercel and the preview-per-branch
workflow described in [plan §15](docs/plan/portfolio-v2.md).

## Content policy (important)

Nothing from the Stitch mockup — no "Alex Chen," no invented employers, no
fictional skills — ships to production, ever. Every user-visible page is
either populated with real material sourced from the site owner or shows a
`Coming in Phase X` stub. See [plan §5 FR-4](docs/plan/portfolio-v2.md) and
[plan §7 AC-4](docs/plan/portfolio-v2.md) for the acceptance criteria.

**Please review [`data/projects.ts`](data/projects.ts):** `language` values
for FACTOR, N-sight, and Wingman were confirmed directly by the owner and
are no longer inferred. `Proxmox Home Server Lab` still uses a descriptive
`"Infrastructure"` placeholder since it isn't a single-language project.
`repoUrl` and `dateCompleted` are intentionally `null` for every project —
see the file header comment for why.

**Please review [`data/achievements.ts`](data/achievements.ts):** every
`year` is `null` — Appendix A doesn't supply a year for any of the five
achievements, and the page renders `PENDING` in that slot. Set real values
once known; no component changes required. The tier badges / "verification
console" styling on the Achievements page are decorative only (FR-8) and
carry an explicit on-page disclaimer that they're not a real verification
service.

**`data/about.ts`** intentionally has no "mission statement" or "core
values" copy — the Stitch mockup includes both, but Appendix A doesn't
supply that content for Dallas, and inventing it would violate the
no-fabricated-content rule. Add real fields there if that copy is ever
supplied.

**Contact page:** no phone number is collected or displayed anywhere on the
site (owner decision, plan §18 item 10). The Stitch mockup's decorative
"PRIMARY_LOC_STATION" map widget (fake San Francisco coordinates) is also
left out entirely rather than inventing a location — plan §18 item 9 is
still open; add it back with a real location if/when that's decided.

**AI assistant:** both the hosted and local models are constrained by a
system prompt built only from the real `data/*.ts` facts and instructed to
decline (and point to the Contact page) rather than fabricate. The local
model's prompt is stricter still. No fabricated persona or facts are seeded.
An LLM can still err, so this is a mitigation, not a guarantee — the on-page
facts remain the source of truth.
