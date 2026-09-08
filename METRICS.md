# METRICS.md — BeatTheATS

Tracked automatically, client-side, zero cost (see `trackEvent()` in `app.js`, stored per-browser in `localStorage` under `bta_events`). This is a per-visitor local counter for debugging during MVP — **it is not aggregate analytics** (each visitor's browser has its own counts, nothing is sent to a server). Real aggregate analytics is a Phase 1 owner action — see AUTOMATION.md.

## KPIs to track once real traffic starts

| KPI | Definition | How measured |
|---|---|---|
| Visitors | Unique people who load the landing page | Analytics tool (to be added) |
| Leads | Visitors who run a free analysis | `analysis_run` event count |
| Unlock clicks | Leads who click "Unlock full report" | `unlock_click` event count |
| Conversions | Completed purchases | `purchase_completed` event count (fires on `?unlocked=1` return) |
| Revenue | Conversions × 36 PLN | Gumroad/Stripe dashboard (source of truth) |
| AOV | Average order value | Gumroad/Stripe dashboard |
| CAC | Spend / new customers | 0 PLN spend currently (organic only) |
| Refunds | Refund requests / conversions | Gumroad/Stripe dashboard |
| Retention | Repeat purchasers (relevant once 3-pack/subscription ships) | Gumroad/Stripe dashboard |
| Profit | Revenue − processor fees − any paid spend | Manual, see UNIT_ECONOMICS.md |
| API cost | $0 (no LLM/API calls in v1) | N/A by design |

## North star

**Revenue / week** — see UNIT_ECONOMICS.md for the milestone table (100 → 500 → 1 000 → 5 000 PLN/week).

## Current numbers (as of this session — pre-launch)

- Visitors: 0 (not yet posted anywhere)
- Leads: 0
- Conversions: 0
- Revenue: 0 PLN
- Status: **built, not yet distributed** — see AUTOMATION.md for the 3 owner steps required before the first real visitor can arrive.
