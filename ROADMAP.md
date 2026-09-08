# ROADMAP.md — BeatTheATS

## Phase 0 — Ship (done this session)
- [x] Research + score 20 ideas, pick winner (MARKET.md)
- [x] Validate demand on paper (BUSINESS.md)
- [x] Build MVP: landing page + free scorer + paywall + printable full report (index.html/app.js/style.css)
- [x] Deployment pipeline to GitHub Pages (`.github/workflows/deploy-pages.yml`)
- [ ] **Owner action (see AUTOMATION.md):** enable GitHub Pages in repo settings, create Gumroad product + payment link, paste link into `app.js`

## Phase 1 — 0 → first paying customer
- Post the free tool (framed as free feedback, not an ad) in 3–5 relevant Reddit communities (r/resumes, r/jobs, r/ApplyingToCollege career threads) and 2 LinkedIn/Facebook job-search groups.
- Goal: 10 free analyses run within 48h of first post.
- Kill signal: 0 analyses run after posting in 5+ communities → revisit copy/hook, then reconsider idea #2/#3 from TOP 3 if still nothing after 2 iterations.

## Phase 2 — 0 → 100 PLN/week
- Identify which channel produced the free-tool traffic; double post volume there only (don't spread thin).
- Add 1 short-form video (TikTok/Reels/Shorts) with a hook like "I built a free tool that tells you why ATS is rejecting your resume" driving to the tool.
- Watch unlock-click rate vs. purchase-completion rate (localStorage event counts) to see if the paywall itself is the leak.

## Phase 3 — 100 → 500 PLN/week
- If conversion is healthy, buy the domain (~50 PLN budget item) to improve trust and enable real SEO.
- Add 3–5 SEO landing pages targeting long-tail queries ("ats resume checker free", "why is my resume being rejected", "[jobtitle] resume keywords").
- Consider a 3-pack pricing tier ($19 for 3 reports) for repeat job-seekers applying to multiple roles.

## Phase 4 — 500 → 1 000 PLN/week
- Add lightweight backend (only once justified by volume) to enable a real subscription tier ("unlimited checks for your active job search — $15/mo") and proper license-key based unlocking instead of the localStorage/redirect MVP gate.
- Start basic email capture (opt-in) for re-engagement/retention.

## Phase 5 — 1 000 → 5 000 PLN/week
- Partnerships: career coaches / resume-writing freelancers as affiliates (they refer clients, get a cut).
- Expand keyword-matching engine with an industry-specific skill dictionary (tech, healthcare, finance, etc.) as a differentiator vs. generic competitors.
- Evaluate whether a small LLM call is now justified for the paid tier only (e.g. AI-rewritten bullet points) — cost is bounded because it only runs on *paid* conversions, not every free visitor.

## Explicit non-goals for MVP (per brief: no "later" features)
- No user accounts/login
- No resume file upload/parsing (PDF/DOCX) — plain text paste only
- No LLM calls anywhere in v1
- No subscription tier in v1 (one-time only)
