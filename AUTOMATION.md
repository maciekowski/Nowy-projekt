# AUTOMATION.md — BeatTheATS

## Architecture

```
USER
 ↓
LANDING (index.html, static, GitHub Pages)
 ↓
FREE TOOL (app.js — pure client-side JS, keyword/heuristic scoring, 0 API cost)
 ↓
PAYWALL → Gumroad/Stripe Payment Link (hosted checkout, no backend needed)
 ↓
AUTOMATIC DELIVERY → Gumroad redirects buyer back to `index.html?unlocked=1`;
                      app.js reads the cached analysis from localStorage and
                      renders the full report + a print-to-PDF button.
 ↓
ANALYTICS → localStorage event counts (MVP-only, per-browser); real aggregate
            analytics is a Phase-1 upgrade (see below).
```

Nothing here requires a running server, a database, or a paid API — this was a deliberate choice to keep marginal cost at 0 PLN per user regardless of traffic, per the API-cost-control mandate.

## What is fully automated already

- Serving the site (GitHub Pages, free, auto-deployed via `.github/workflows/deploy-pages.yml` on every push to this branch/`main`).
- Scoring every free analysis (client-side algorithm, no server round-trip, no LLM cost).
- Payment collection (Gumroad/Stripe hosted checkout — handles cards, global tax/VAT, receipts).
- Report delivery after payment (redirect + localStorage read + print-to-PDF — no email/fulfillment step needed).

## Owner actions required (cannot be done autonomously — credentials/payment/irreversible)

These are the **only** blockers between "code is done" and "can accept real money." None require coding.

1. **Enable GitHub Pages** (1 click, repo owner only): repo Settings → Pages → Build and deployment → Source: "GitHub Actions". The workflow in this PR will then deploy automatically. *(I don't have Pages-admin API access from this session, so I can't flip this switch myself.)*
2. **Create a payment link** (~5 minutes, needs the owner's identity/bank details to receive payouts — this is inherently something only the business owner can do):
   - Recommended: [Gumroad](https://gumroad.com) — fastest setup, handles global VAT/tax automatically, no code. Create a **29 PLN** digital product called "BeatTheATS — Pełny raport" (Poland is now the primary market — see LOCALIZATION.md §5 for the PLN/EUR pricing rationale; Gumroad auto-converts to each buyer's local currency, so one PLN-priced product covers Europe too), set its **post-purchase redirect URL** to `https://<your-pages-url>/index.html?unlocked=1`.
   - Alternative: Stripe Payment Links (lower fees at scale, slightly more setup).
   - Then replace `PAYMENT_LINK_URL` at the top of `app.js` with the real product URL and push.
3. **Domain purchase** (optional, ~40–50 PLN/year, needs a payment card): only worth doing after the first sale validates demand (see ROADMAP.md Phase 3). Not required to launch — the free `github.io` URL works for the MVP.
4. **Real analytics** (optional): add a free Plausible/GA4 account and paste the tracking snippet into `index.html` `<head>`. Deferred because it requires the owner's own account, not because it's hard.

## API cost control

- **Requests using a paid API in v1: zero.** The entire scoring engine is deterministic JavaScript (tokenization, stopword removal, keyword frequency + a curated skill-phrase dictionary, simple formatting checks). This was a direct requirement: "if it can be replaced by code/open-source/a simpler algorithm, prefer the cheaper option."
- If/when an LLM call is introduced (Phase 5, e.g. AI-rewritten bullet points for paid users only), it will be:
  - Gated to paid conversions only (bounded cost, funded by revenue already collected),
  - Monitored per the brief's cost dashboard: requests, tokens, cost/request, cost/customer — to be added to METRICS.md at that time.
