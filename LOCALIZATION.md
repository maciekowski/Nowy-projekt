# LOCALIZATION.md — Pivot to Poland (primary) + Europe (secondary)

## 1. Audit of the current product

| Area | Current state | Problem for PL/EU |
|---|---|---|
| UI language | 100% English, `lang="en"` | Primary market (Poland) can't read it comfortably; hurts trust and conversion |
| Pricing | $9 USD hardcoded in the unlock button copy | No PLN/EUR pricing, no market-appropriate anchor |
| `normalize()` in app.js | Strips every character that isn't `a-z0-9+#.` | **Real bug, not cosmetic**: strips Polish diacritics (ą ć ę ł ń ó ś ź ż), fragmenting Polish words mid-token (e.g. "doświadczenie" → "do wiadczenie") |
| `STOPWORDS` | English only | A Polish CV/job ad would have almost no stopwords filtered — every "i", "oraz", "w", "na" survives as a fake "keyword", degrading match quality |
| Section-header detection (`hasExperienceSection` etc.) | Only matches "experience/education/skills" | A correctly-formatted Polish CV using "Doświadczenie zawodowe" / "Wykształcenie" / "Umiejętności" would incorrectly **fail** these checks and get an unfairly low score |
| `SKILL_PHRASES` dictionary | English business/tech phrases only | Polish job ads use Polish-language skill phrases ("obsługa klienta", "znajomość języka angielskiego", "prawo jazdy kat. B") — none of these are recognized, weakening keyword extraction on Polish job ads |
| Keyword matching | Exact whole-word match only | Polish is heavily inflected (case endings change: "kierownik projektu" vs "kierownika projektu") — exact match will under-count real matches on Polish text |
| i18n architecture | None — strings hardcoded in HTML/JS | Can't add languages later without touching every file |

**Conclusion: this is not a translation-only job.** Three of the above (diacritics stripping, missing PL stopwords, missing PL section-header detection) are genuine correctness bugs that would make the scoring engine actively misleading for a Polish CV — not just "in the wrong language."

## 2. Required changes

1. Fix `normalize()` to preserve Polish diacritics.
2. Add a Polish stopword list, merged with the English one (no collision risk — different alphabets/word sets).
3. Add Polish equivalents to the three section-header checks (kept alongside the English ones, since EU users may paste English-language CVs too).
4. Add a Polish skill-phrase list alongside the English one.
5. Add a lightweight inflection-tolerant fallback match (prefix/stem comparison) for words ≥6 characters that don't match exactly — cheap, safe, works for both languages.
6. Add a minimal i18n layer: a `translations` dictionary keyed by language code (`pl`, `en`) + a `t(key, vars)` helper + `data-i18n` attributes in the HTML. Adding a third language later means adding one more object key — no structural change.
7. Default language: Polish for Polish-locale browsers, English otherwise (so a French or German visitor — secondary market — isn't forced into a language they can't read).
8. Pricing: display PLN for the `pl` UI and EUR for `en`, with a language toggle in the header.
9. Landing copy rewritten in Polish as the primary language (not translated 1:1 — see BUSINESS.md-style messaging below), no "we guarantee an interview" type claims.

## 3. Priorities

**P0 (correctness — must fix, product is actively wrong without these):** #1, #2, #3, #4, #5
**P0 (the actual pivot):** #6, #7, #9
**P1:** #8 (pricing display)
**P2 (planning only, no code):** SEO keyword strategy, acquisition community list — see ACQUISITION.md update and SEO section below.

## 4. What was deliberately NOT changed (avoiding scope creep)

- No backend, no accounts, no LLM calls added — same zero-marginal-cost architecture.
- No full NLP/lemmatization library — a prefix-match fallback is the minimal fix that meaningfully helps Polish inflection without adding a dependency or backend.
- No new pages, no mass SEO page generation.
- No change to the paywall/delivery mechanism (still Gumroad redirect + localStorage), since nothing in this pivot indicates that flow is broken.

## 5. Pricing decision: $9 → PLN/EUR

Original $9 (~36 PLN) was anchored to a US competitor (Jobscan, $50/mo). That anchor doesn't exist in the Polish market, and PL price sensitivity for an unfamiliar, unbranded tool is higher than in the US at first-purchase stage.

**New price: 29 PLN (Poland) / €7.99 (rest of Europe, EUR-priced UI).**

Rationale:
- 29 PLN sits in the same "impulse buy" zone as a cheap lunch or a Netflix top-up — low enough friction for a first-time, unbranded product to convert, while a Polish "CV review" freelance gig on marketplaces like Useme typically runs 50–150 PLN, so this still reads as a bargain, not as "too cheap to trust."
- €7.99 keeps a comparable psychological price point for higher-purchasing-power Western European buyers (closer to the original $9 ballpark) without applying a flat FX conversion of the PLN price, which would under-price the EU tier.
- Margin stays ~90%+ either way (Gumroad's ~10% cut, zero compute cost) — see UNIT_ECONOMICS.md for updated math.
- Gumroad displays a single seller-set price and auto-converts for the buyer's local currency at checkout; the two figures above are the two price *anchors* to communicate on the PL vs EN UI, not two separate payment products. The owner sets the base Gumroad price once (recommend setting it in PLN, since Poland is now the primary market) — see AUTOMATION.md.

## 6. SEO strategy (planning only — no pages built)

Confirmed via research that Polish demand for this exact topic already exists (existing Polish content: Zielona Linia — the Polish government's own job-market portal — interviewme.pl, pracuj.pl help center, cv-maker.pl, dookolapracy.pl, ciekawecv.pl, stworzcv.com all publish "CV pod ATS" content, so the keyword space is validated but has competition — mostly informational blog content, not an interactive free-scoring tool, which remains our differentiator).

Target keyword clusters (Polish primary, English secondary) — for future landing/SEO pages, **not built yet** per "don't mass-produce low-value SEO pages":
- PL: "CV pod ATS", "sprawdzenie CV online", "analiza CV za darmo", "dlaczego moje CV jest odrzucane", "jak napisać CV pod system rekrutacyjny"
- EN (secondary/EU-wide): "ATS resume checker", "resume checker Europe", "free resume score"

Next SEO action (Phase 3 per ROADMAP.md, only once organic traffic is validated): one well-written Polish landing page targeting "CV pod ATS" and one English page targeting "ATS resume checker" — not a mass page-generation exercise.

## 7. Acquisition channels confirmed by research (see ACQUISITION.md for the full, updated list)

- **4programmers.net** (Polish IT community, "Kariera" forum) — real, active, confirmed via search; strong fit since tech CVs are the most ATS-screened category.
- Polish Facebook job groups confirmed to exist and be active: "DAM PRACE / SZUKAM PRACY" (largest), "Szukam Pracy POLSKA", plus city-specific groups (Wrocław, Gdańsk, Kraków, etc.).
- r/Polska (large, general — use only in self-promo/weekly threads per sub rules).
- Could not reliably confirm a dedicated Polish "job search" subreddit by name via web search — flagged as **UNVERIFIED**, don't post to a guessed subreddit name; the owner should confirm via Reddit's own search before posting.

## 8. Test plan

- Re-run the existing Playwright smoke test with a real Polish résumé + Polish job ad sample (diacritics, Polish section headers, Polish skill phrases) and confirm a sane, non-degraded score.
- Confirm English flow still works unchanged (regression check).
- Confirm language toggle updates both static copy and the dynamic report text (score headline, tips, price) without a page reload.

## 9. Deployment status (unchanged blocker)

Still blocked on the same one owner action from the last session: enabling GitHub Pages (Settings → Pages → Source: GitHub Actions). Verified again this session — deploy workflow still fails with the repo having no Pages site. This localization work is committed and ready to go live the moment Pages is enabled.
