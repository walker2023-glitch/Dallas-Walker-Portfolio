# PORTFOLIO-V2 — Dallas Walker Portfolio Rebuild

> Implementation plan for Cursor. Source: existing static site (`index.html`, `style.css`, `javascript.js`, `projectPlan.md`), a Google Stitch design export (multi-page "SYSTEM_CORE_V1.0" concept covering Experience, Projects, Achievements, Skills, AI_Terminal, Contact, About), and a planning conversation with the site owner (Aug 2026).
>
> **Read this before starting:** the site is being rebuilt as a **multi-page** Next.js app with a persistent left sidebar nav, replacing the current single-page-with-modal layout. The Stitch export is the visual/structural reference for the new design — port its Tailwind color tokens, sidebar nav, top bar, and page layouts directly. **However, the Stitch export is a placeholder mockup**: it uses a fictional person ("Alex Chen"), fictional employers (Citadel, Google Cloud, Stanford), and a generic skills list (Flutter, Kotlin, Django, Go) that do NOT match Dallas's real background. Every page must be rebuilt with Dallas's real content — do not ship any placeholder name, employer, bio, or skill from the Stitch mockup. Where real content isn't yet supplied (see §18 Open Questions), leave a clearly marked TODO rather than inventing anything.

## Metadata

| Field                 | Value                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **Feature ID**         | PORTFOLIO-V2                                                                      |
| **Section**            | Full site rebuild (migration + architecture change + feature completion)         |
| **Severity**           | MAJOR                                                                             |
| **Markets**            | N/A (personal site)                                                               |
| **Status (today)**     | PARTIAL — static single-page site exists; rebuild targets a multi-page architecture |
| **Estimated effort**   | L (targeting several weeks, part-time — scope grew from a single-page fix-up to a multi-page rebuild) |
| **Owner (proposed)**   | Dallas Walker                                                                     |
| **Depends on**         | None                                                                              |
| **Unblocks**           | Sharing the site in job applications / recruiter conversations                   |

---

## 1. Problem Statement

The current portfolio is a static single-page HTML/CSS/JS site with several non-functional elements (simulated chatbot, dead resume/footer links, broken image paths) and missing sections (Achievements, Contact, Experience, About) called for in the original scope. A Stitch-generated design concept has since defined a stronger direction: a multi-page site with a persistent sidebar navigation, dedicated pages per content area, and a more structured visual system. This plan rebuilds the site on Next.js as a true multi-page app matching that direction, populated with Dallas's real content, with a working AI assistant and contact form.

## 2. Goals

- Migrate to Next.js + TypeScript on Vercel, as a **multi-page app** with persistent sidebar navigation (per the Stitch design), not the current single-page/modal layout.
- Port the Stitch design's visual system (color tokens, typography scale, sidebar/top-bar layout, card styling) as the real design system, replacing all placeholder content with Dallas's real information.
- Build out dedicated pages: Home/Hero, Projects, Experience, Achievements, Skills, AI Assistant, Contact, About.
- Ship a real, working AI assistant: hybrid inference (5 free hosted-API questions via Claude Haiku 4.5, then fallback to a small in-browser model).
- Fix every non-functional element from the current site: resume download, footer links, project images.
- Add project filtering (by language / recency / complexity).

## 3. Non-Goals

- No CMS or database-backed content management — all page content (projects, achievements, experience entries, skills, about copy) lives in typed TypeScript source files.
- No payment, subscription, or monetization.
- No user accounts or authentication.
- No multi-language / i18n support at launch.
- No enterprise compliance work (SOC2, FERPA, etc.).
- **No fabricated content.** Nothing from the Stitch mockup (name, employers, bio, skills, achievements) ships as-is — every page must be populated with real information supplied by the site owner, or left as a marked placeholder pending that content.

## 4. Personas & User Stories

- **As a recruiter/hiring manager**, I want to navigate between Dallas's experience, projects, skills, and achievements via clear sidebar navigation so I can quickly find what I'm looking for.
- **As a recruiter**, I want to ask the AI assistant specific questions and get an accurate answer without reading every page myself.
- **As a recruiter**, I want to download his resume, see his real work/research history, and have an obvious way to contact him.
- **As Dallas (owner)**, I want to add/edit content (projects, experience, achievements, skills) by editing typed data files, without touching layout code.
- **As Dallas (owner)**, I want to control AI API spend so a bot or bad actor can't run up a bill.
- **As a site visitor**, I want to filter the projects grid to find what I'm interested in.

## 5. Functional Requirements

- **FR-1.** The system MUST be rebuilt on Next.js (App Router) with TypeScript, as a multi-page app with routes for: Home/Hero, Projects, Experience, Achievements, Skills, Contact, About. The AI assistant may live on its own route or as a persistent panel — owner's call (see Open Questions).
- **FR-2.** The system MUST implement the sidebar + top-bar navigation shell from the Stitch design (ROOT_DIRECTORY sidebar, SYSTEM_CORE_V1.0 top bar branding, active-state highlighting per current page), responsive down to a mobile bottom-nav or drawer pattern.
- **FR-3.** The system MUST port the Stitch design's Tailwind color tokens, typography scale, and card/panel styling as the site's real design system.
- **FR-4.** Every page MUST be populated with Dallas's real content — no placeholder name ("Alex Chen"), employer, bio, or skill list from the Stitch mockup may ship to production.
- **FR-5.** The system MUST expose a `/api/chat` route that forwards visitor messages to the Claude API (model: `claude-haiku-4-5-20251001`) with a system prompt containing Dallas's real resume/project/experience facts, and returns the reply.
- **FR-6.** The system MUST track free-question usage per visitor server-side (session/IP, not just `localStorage`) and cap it at 5 questions.
- **FR-7.** After the free quota is exhausted, the system MUST switch the chat UI to an in-browser fallback model (WebLLM or transformers.js), lazy-loaded only at that point.
- **FR-8.** The Achievements page MAY keep the Stitch design's decorative "blockchain verification" flavor text (tier badges, "Oracle Validation," etc.) as pure visual styling — it must not claim to perform any real verification, and the underlying achievement content must be real and accurate.
- **FR-9.** The resume download button MUST be wired to a `resumeUrl` config value that is currently unset (`null`). Until a real PDF is supplied, the button MUST render in a disabled/"COMING_SOON" state (matching the site's terminal aesthetic — e.g. `RESUME_NOT_YET_DEPLOYED`) rather than a broken link or 404. Swapping in the real PDF later must require only setting one config value and adding the file — no component/layout changes.
- **FR-9a.** Similarly, each project's `repoUrl` in `data/projects.ts` MUST be a nullable field. When `repoUrl` is null, the Projects page/modal MUST show a clear "not yet public" state (the current site already has a version of this — `[REPO_STATUS: CLASSIFIED_INTERNAL]` — reuse or adapt that pattern) instead of a broken or missing button. Adding a real repo later is just setting that one field per project.
- **FR-10.** The footer/sidebar MUST link to Dallas's real GitHub (`https://github.com/walker2023-glitch`) and LinkedIn (`https://linkedin.com/in/dallas-walker`) URLs.
- **FR-11.** The system MUST include a working contact form (per the Stitch Contact page layout) that sends submissions to Dallas's email via a transactional email provider (e.g. Resend).
- **FR-12.** The Experience page MUST list Dallas's real work/research history — no fictional employers.
- **FR-13.** The projects grid MUST support filtering by at least: primary language/tag and complexity or type.
- **FR-14.** All project images MUST be reorganized into `/public/images/` and referenced correctly.
- **FR-15.** All content (projects, experience, achievements, skills, about copy) MUST live in typed TypeScript source files, replacing the current inline JS array.

## 6. Non-Functional Requirements

- **Performance** — Lighthouse Performance ≥ 90. The fallback local chat model must not download unless a visitor exhausts their free quota.
- **Security** — The Anthropic API key lives server-side only. `/api/chat` and `/api/contact` validate/sanitize input and rate-limit by IP/session.
- **Accessibility** — WCAG 2.1 AA target, including sidebar keyboard navigation and focus order across the new multi-page structure.
- **Reliability** — Graceful degradation if the Claude API call fails or times out.
- **Maintainability** — All content centralized in typed source files, one per content domain (projects, experience, achievements, skills, about).
- **Cost control** — Haiku 4.5 free-tier chat stays in the low single-digit dollars/month at expected traffic. Vercel Hobby tier (free) covers hosting.

## 7. Acceptance Criteria

- **AC-1.** *Given* a visitor lands on the site, *when* they use the sidebar nav, *then* they can reach every page (Home, Projects, Experience, Achievements, Skills, Contact, About) without a full page reload feeling jarring (Next.js client-side routing).
- **AC-2.** *Given* a visitor opens the AI assistant, *when* they ask a question, *then* they get a real answer from Claude Haiku 4.5 grounded in Dallas's real facts, with remaining free-question count visible.
- **AC-3.** *Given* a visitor exhausts the free quota, *when* they ask another question, *then* the UI switches to the local fallback model with a clear one-time loading indicator.
- **AC-4.** *Given* any page in the rebuilt site, *when* reviewed against the Stitch mockup, *then* no placeholder name, employer, or fabricated content remains — only real Dallas Walker content or a clearly marked TODO.
- **AC-5.** *Given* a visitor fills out the contact form, *when* they submit, *then* Dallas receives an email and the visitor sees a success confirmation.
- **AC-6.** *Given* a visitor applies a project filter, *when* active, *then* only matching projects render, with an empty state if none match.
- **AC-7.** *Given* the deployed site, *when* checked with Lighthouse, *then* Performance, Accessibility, and Best Practices scores are each ≥ 90.

- **AC-8.** *Given* `resumeUrl` is null (current state), *when* a visitor clicks the resume button, *then* they see a clear "not yet available" state, never a broken link or 404 — and *given* the owner later sets a real `resumeUrl` and adds the PDF, *when* the site rebuilds, *then* the button works with no other code changes.
- **AC-9.** *Given* a project's `repoUrl` is null (current state for all projects), *when* a visitor views that project, *then* they see a clear "not yet public" state instead of a broken/missing link — and *given* the owner later adds a real URL for that project, *when* the site rebuilds, *then* the link works with no other code changes.

## 8. Data Model

No database — all content is file-based and typed:

- `data/projects.ts` — `Project[]`: `id`, `title`, `tag`, `shortDesc`, `longDesc`, `image`, `icon`, `repoUrl: string | null` (null = not yet public, renders a "not available" state instead of a link), `language`, `complexity`, `dateCompleted`.
- `config/site.ts` (or similar) — small config object holding `resumeUrl: string | null` and the real GitHub/LinkedIn URLs, so swapping in the resume PDF later is a one-line change, not a component edit.
- `data/experience.ts` — `ExperienceEntry[]`: `role`, `organization`, `startDate`, `endDate?`, `bullets: string[]`, `tags: string[]`. Content TBD — see Open Questions.
- `data/achievements.ts` — `Achievement[]`: `title`, `year`, `refCode?`, `description`, `tier?`. N-sight's "Most Deployable Application" hackathon award is one known real entry; rest TBD.
- `data/skills.ts` — `SkillCategory[]`, replacing both the current hero skills-grid and the Stitch Skills-page grid with Dallas's real stack (C++, Rust, PyTorch, R, Vulkan, DX12, etc. — per the current hero section — plus whatever else he wants listed).
- `data/about.ts` — bio, mission statement, core values copy. Content TBD.
- Rate-limit counter for chat quota: Vercel KV, keyed by session cookie.

## 9. API Surface

- **`POST /api/chat`** — `{ message, sessionId }` → `{ reply, remainingFreeMessages, mode: "hosted" | "local-handoff" }`. Rate-limited by session/IP.
- **`POST /api/contact`** — `{ name, email, message }` → `{ success, error? }`. Sends via Resend (or equivalent); honeypot/rate-limited.

## 10. UI / UX

- **Pages/routes:** `/` (hero/landing), `/projects`, `/experience`, `/achievements`, `/skills`, `/contact`, `/about`, and either `/ai-terminal` or a persistent chat panel (owner's call).
- **Navigation shell:** persistent left sidebar (desktop) per the Stitch design — ROOT_DIRECTORY heading, nav items with icons, active-state highlighting; collapses to a bottom nav or drawer on mobile (the Stitch Achievements page already shows a mobile bottom-nav pattern worth reusing).
- **Design system:** port the Stitch Tailwind config's color tokens (primary emerald `#4edea3`/`#10b981` family, dark surface scale), typography scale (`display-lg`, `title-sm`, `code-label`, etc.), and card/glass-panel styling.
- **Key flows:** sidebar navigation between pages; project filtering on `/projects`; AI assistant free-question flow with local fallback; contact form submission; resume download.
- **States:** loading/empty/error states for chat, contact form, and filtered projects grid, consistent with the "terminal system" aesthetic (e.g. the "Encrypted_Milestone" locked-card pattern from the Stitch Achievements page is a nice empty-state motif worth reusing elsewhere).
- **Accessibility:** keyboard-navigable sidebar, ARIA live region for chat messages, alt text on all images, focus order through forms and filters.

## 11. AI / ML Considerations

- **Primary model:** `claude-haiku-4-5-20251001` via the Anthropic Messages API, server-side only. System prompt built from `data/*.ts` (projects, experience, skills, about) so it always reflects real, current content.
- **Fallback model:** small quantized open model (Gemma 2B or Phi-3-mini, final pick TBD) via WebLLM/transformers.js, loaded client-side only after the free quota is exhausted.
- **Quota:** 5 free questions per visitor, enforced server-side via Vercel KV keyed by session cookie.
- **Cost:** Haiku 4.5 at $1/$5 per million tokens; short Q&A exchanges keep monthly spend in the low single digits even at meaningful traffic.
- **Fallback UX risk:** the local model's system prompt must be equally fact-constrained (instructed to decline rather than guess) to avoid giving a recruiter wrong information.

## 12. Integration Points

- **Anthropic Claude API** — chat completions (server-side, `ANTHROPIC_API_KEY`).
- **Resend** (or similar) — contact form delivery.
- **Vercel** — hosting, serverless/edge functions, Vercel KV for rate-limiting.
- **WebLLM / transformers.js** — client-side fallback inference.
- **Design reference:** Stitch export (Skills, Experience, Achievements, Contact, About page mockups) — visual/structural source of truth, content source of nothing (all mockup content is placeholder).
- **Existing files to port:** `index.html`, `style.css`, `javascript.js` (current project data, being migrated into `data/projects.ts`), `projectPlan.md` (original scope/tokens).

## 13. Dependencies & Sequencing

1. **Phase 1 — Foundation:** Next.js + TypeScript project, port the Stitch sidebar/top-bar shell and design tokens, set up routing for all pages (empty/stub content).
2. **Phase 2 — Content migration:** Move current project data into `data/projects.ts`; build out the real Projects page with filtering; fix images, resume link, footer links.
3. **Phase 3 — New pages, real content:** Build Experience, Achievements, Skills, About pages using owner-supplied real content (see Open Questions) in place of Stitch placeholders.
4. **Phase 4 — Contact:** Contact page + `/api/contact` + email delivery.
5. **Phase 5 — AI assistant:** `/api/chat` + Claude integration + free-quota tracking + local-model fallback.

Shared infra needed: Vercel account/project, Anthropic API key, Resend account, Vercel KV instance.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Stitch placeholder content (name, employers, skills) accidentally ships to production | M | H | Explicit AC-4 checklist review before any deploy; treat as a launch blocker |
| Client-side-only quota tracking gets bypassed | H | M | Enforce quota server-side via Vercel KV, not just the UI counter |
| Local fallback model gives a wrong/embarrassing answer about Dallas | M | H | Constrain fallback system prompt tightly; instruct it to decline rather than guess |
| Multi-page architecture increases scope/timeline vs. original single-page plan | H | M | Sequenced phases (§13) so a working, improved site can ship after Phase 2 even if Phases 3-5 take longer |
| "Blockchain verification" flavor text reads as a false claim to a recruiter rather than obvious flourish | L | M | Keep the styling clearly stylized/gamified (as in the Stitch mockup) rather than literal-sounding; revisit if early feedback says it reads as misleading |
| Contact form abused for spam | M | L | Honeypot field + rate limiting |

## 15. Rollout Plan

- Build on a branch/preview deployment per phase; review before merging.
- Suggested rollout: ship Phases 1-2 first (a strict improvement over the current site, fixes everything broken), then Phases 3-5 as follow-up deploys as real content and the AI assistant come together.
- Rollback path: Vercel keeps prior deployments — one-click revert if needed.

## 16. Test Plan

- **Manual QA:** every nav link, every filter combination, full chat flow through free-quota-then-fallback, contact form success/error paths, mobile nav collapse.
- **Content audit (new, given AC-4):** page-by-page diff against the Stitch mockup to confirm no placeholder content shipped.
- **Automated:** Vitest for filter/quota logic; optional Playwright smoke test for the core chat flow.
- **Accessibility:** axe/Lighthouse audit before final deploy.
- **Performance:** Lighthouse run on preview before merging to production.

## 17. Documentation & Training

- README covering local dev setup, required env vars (`ANTHROPIC_API_KEY`, Resend key, Vercel KV credentials), and the hybrid chatbot architecture.
- Inline comments in each `data/*.ts` file explaining its schema for easy future edits.

## 18. Open Questions

1. ~~Experience page content~~ — **RESOLVED**, see Appendix A. Real roles: BYU-Idaho (TA Supervisor/Data Analyst; TA for CSE 210 & Agribusiness), Mathnasium, iSignCo, STAR Camp, Arctic Circle. Leadership roles (AI Society President, Computer Society President/VP) are also real — Cursor should decide whether these render as a distinct "Leadership" subsection on the Experience page or as additional Experience entries (they read as org-leadership, not employment, so a subsection is probably cleaner).
2. ~~About page content~~ — **RESOLVED**, see Appendix A. Profile blurb + education (B.S. Computer Science & Statistics, BYU-Idaho, expected Fall 2028, 4.0 GPA) both real and ready to use.
3. ~~Achievements list~~ — **RESOLVED**, see Appendix A. Real entries: N-sight's "Most Deployable Application" (+ projected top-2 finalist), CTE Presidential Scholar, Eagle Scout Award, Full-Tuition Academic Scholarship, TestOut PC Prep Certificate.
4. ~~Skills discrepancy~~ — **RESOLVED.** The resume (Appendix A) is the sole source of truth for the Skills page. The current hero section's claims (C++/Rust, PyTorch/R, Vulkan/DX12) are **not** on the resume and must NOT be used — replace that hero skills-grid content with the real resume skills list too, since it's currently inaccurate.
5. **AI Assistant placement** — own dedicated page (matching the Stitch "AI_Terminal" nav item) or a persistent panel accessible from any page?
6. Exact fallback model choice — Gemma 2B vs. Phi-3-mini vs. another small model.
7. Exact filter taxonomy for projects — language + complexity, or swap complexity for a more objective "type" taxonomy.
8. Session/quota reset interval for free chat questions (per browser session vs. rolling 24h window).
9. Should the Contact page's location/map widget use a real location, or be dropped/replaced given it's decorative in the mockup?
10. ~~Phone number privacy~~ — **RESOLVED: omit.** Contact page relies on the contact form + email only, no phone number.
11. **Project repo links — DEFERRED, architecture ready.** `repoUrl` ships as `null` for every project (see FR-9a). Site renders a clear "not yet public" state in the meantime. When the owner has cleaned up a repo and cleared it (see the earlier checklist — README, no committed secrets, teammate sign-off for N-sight/Wingman, academic-integrity check for Freezer Penguin), adding the link is a one-line edit to `data/projects.ts` — no other changes needed.
12. **Resume file — DEFERRED, architecture ready.** `resumeUrl` ships as `null` (see FR-9). Site shows a clear "not yet available" state on the resume button in the meantime. The owner separately plans to condense the resume (currently 3 pages, per Appendix A) before producing a final PDF — once that's done, wiring it up is a one-line config change plus dropping the file in `/public/`.

## 19. References

- Existing site: `index.html`, `style.css`, `javascript.js`
- Original scope doc: `projectPlan.md`
- Stitch design export: multi-page mockup covering Skills, Experience, Achievements, Contact, and About — visual/structural reference only, all content placeholder
- Uploaded assets: `F_A_C_T_O_R.png`, `N-sight_Logo.jpg`, `Star_ML.png`, `Wingman.png`, `Proxmox.png`, `FPappIcon.jpg`, `meImage.png`, `PortfolioLogo.png` — to be organized into `/public/images/`
- Anthropic API docs: https://docs.claude.com/en/api/overview
- Vercel pricing/docs: https://vercel.com/docs/plans/hobby
- WebLLM: https://github.com/mlc-ai/web-llm

---

## Appendix A — Real Content Reference (from owner's resume)

Transcribed from the owner's LaTeX resume. This is the source of truth for Experience, About, Achievements, and Skills page content — use directly, don't paraphrase facts away.

### Contact
- Email: dallaswalker1023@gmail.com
- LinkedIn: https://linkedin.com/in/dallas-walker
- GitHub: https://github.com/walker2023-glitch
- Phone number **intentionally omitted from the site** (owner's decision — resume-only detail, not for public web publishing)

### Profile / About blurb
> Problem-solver with a multidisciplinary background in Computer Science and advanced Statistics, dedicated to leveraging diverse mathematical and programmatic tools for AI development. Having worked in multicultural environments like Hong Kong, I bring a resilient, service-first mindset to solving the world's most difficult computational problems.

(Note: this is the same copy already used in the current site's hero section — reuse it for the About page too, don't rewrite it.)

### Education
- **B.S. Computer Science & Statistics** (double major), Brigham Young University–Idaho, Rexburg, ID — expected Fall 2028
- Cumulative GPA: 4.0 / 4.0
- Awards: CTE Presidential Scholar; Eagle Scout Award Recipient; Full-Tuition Academic Scholarship; TestOut PC Prep Certificate

### Experience
1. **Online TA Supervisor / Data Analyst** — Brigham Young University–Idaho, Rexburg, ID (Apr 2026 – Aug 2026)
   - Used Workday analytics to audit compliance metrics (active hours, survey completion) across 40+ remote TAs, building a data-backed accountability framework that reduced time-tracking variance.
   - Ran one-on-one mentorship calls (weeks 2 and 7) to align individual performance with team standards and boost morale.
2. **Teaching Assistant (CSE 210 & Agribusiness)** — Brigham Young University–Idaho, Rexburg, ID (Sep 2023 – Present)
   - Used a professor-configured AI pipeline to generate baseline feedback on ~40 weekly agribusiness essays outside his technical domain, manually verifying output for grading consistency.
   - Built a custom AI utility generating tiered (A/B/C) code exemplars to help CS students grasp programming abstractions.
3. **Instructor** — Mathnasium, Saratoga Springs, UT (2022 – 2023)
   - Simplified math instruction (e.g. reframing multi-digit addition into base-10 groupings) for students aged 6–18, improving fluency/confidence for 50+ students.
   - Ran peer-to-peer staff training to standardize teaching methodology across the center.
4. **Manufacturer** — iSignCo, Saratoga Springs, UT (2019 – 2022)
   - Operated industrial sheet-metal-bending machinery and wired LED lighting configurations for enterprise commercial accounts.
   - Performed high-altitude field installations on boom lifts; 100% incident-free safety record over three years.
5. **Team Leader** — STAR Camp, Ogden, UT (Jun 2022 – Jul 2022)
   - Guided up to 90 campers through a model rocket aerodynamics course; enforced safety protocols for a 100% incident-free log.
   - Diagnosed a launch failure and recalibrated build guidelines, achieving perfect launch success in subsequent cohorts.
   - Designed and taught a public-speaking curriculum drawing on a speech and debate background.
6. **Cashier and Sales Representative** — Arctic Circle, Saratoga Springs, UT (2021 – 2022)
   - Took ownership of point-of-sale registers during volume surges to unblock kitchen queue backlogs.
   - Processed high-volume transactions with 100% till reconciliation accuracy; boosted operational efficiency ~75%.

### Leadership
- **President, AI Society** — Designed tiered workshops (prompt engineering, local LLM installs) for technical and non-technical students; built and deployed an open-source landing page; recruited outside speakers (e.g. Matt Fischer) via cold outreach.
- **President & VP, Computer Society** — Redirected the society from logistics-only toward technical growth (mission statement, weekly tracking agendas); organized a week-long collegiate hackathon spanning Useful Tech, Useless Tech, and AI Slot Machine tracks.

### Achievements
- N-sight — "Most Deployable Application" hackathon award; judges' feedback tracked it as a projected top-2 finalist.
- CTE Presidential Scholar
- Eagle Scout Award Recipient
- Full-Tuition Academic Scholarship
- TestOut PC Prep Certificate

### Skills (sole source of truth for the Skills page — the current hero section's C++/Rust/PyTorch/Vulkan/DX12 claims are not on the resume and must be dropped/replaced with this list)
- **Languages:** Python (Polars), C#, R, SQL, HTML/CSS, JavaScript, Dart
- **Frameworks & Tools:** FastAPI, SQLModel, Uvicorn, ML.NET, Proxmox VE, ZFS, Tailscale, Docker, LXC, MySQL, AWS, Git
- **Concepts & Practices:** Agentic Engineering, DevOps, Prompt Engineering, OOP, Agile, ANOVA & Stats
- **Professional:** Project Management, Mentoring, Leadership, Public Speaking, Multilingual (Cantonese)
- **Other/Personal:** 3D printing, running, Piano

### Projects (richer descriptions from the resume — use in place of / to enrich the shorter `javascript.js` descriptions)
- **FACTOR** — AI Competency Through Objective Results. Multi-way ANOVA statistical profile evaluating how prompt variables alter LLM accuracy across foundation models; results blocked by academic major to replace subjective model-selection with empirical testing.
- **N-sight** — International hackathon supply-chain toolkit tracking nitrogen allocation from farm soil to retail shelves; adaptive dark/light UI with multi-language translation; "Most Deployable Application" winner, projected top-2 finalist.
- **Star Identifier** — Hybrid rules + ML.NET (C#) classification architecture for astrophysical star sorting; custom preprocessing pipeline for cleaning/normalizing stellar attribute data.
- **Freezer Penguin** — Rebuilt a broken hackathon prototype into a standardized relational MySQL + Dart application over a full academic term, satisfying three separate course rubrics; used Cursor/agentic workflows to accelerate delivery.
- **Wingman** — Dating logistics app integrating the Gemini API to auto-draft invitation texts; focused on regional activity/venue planning (BYU-Idaho campus); migrated from local prototype to AWS production.
- **Proxmox Home Server Lab** — Dell PowerEdge homelab; Proxmox VE hypervisor, ZFS storage, unprivileged LXC containers, Docker Compose, Tailscale mesh — self-taught via AI-assisted workflows.
