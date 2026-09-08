# UNIT_ECONOMICS.md — BeatTheATS

## Cost structure

| Item | Cost |
|---|---|
| Hosting (GitHub Pages) | 0 PLN |
| Scoring engine (client-side JS, no LLM call) | 0 PLN/analysis |
| Payment processing (Gumroad, ~10% + fixed fee; or Stripe ~1.5–3.5%+fixed) | ~10% of each 29 PLN / €7.99 sale on Gumroad |
| Domain (not yet purchased — using github.io subdomain for MVP) | 0 PLN (deferred) |
| Analytics | 0 PLN (deferred — self-serve free tier when added) |
| **Total fixed monthly cost** | **0 PLN** |
| **Total budget spent so far** | **0 PLN of 50 PLN** |

Because the free analysis runs entirely in the visitor's browser (no server, no API call per user), **cost per visitor and cost per free analysis is 0 PLN**, regardless of traffic volume. The only variable cost is the payment processor's cut on an actual sale.

## Per-sale economics (Gumroad, ~10% take rate assumption)

Repriced for the PL/EU pivot (see LOCALIZATION.md §5 for rationale — was $9/~36 PLN, anchored to a US competitor that doesn't exist as a reference point for Polish buyers).

| | Poland (PLN) | Rest of Europe (EUR) |
|---|---|---|
| List price | 29 PLN | €7.99 |
| Payment processor fee (~10%) | ~2.9 PLN | ~€0.80 |
| **Net revenue per sale** | **~26.1 PLN** | **~€7.19 (~31 PLN)** |
| Marginal cost of goods (compute) | 0 PLN | 0 PLN |
| **Gross margin** | **~90%** | **~90%** |

## Sales needed to hit each milestone (net revenue basis, PLN price as primary market)

| Target | Net PLN/week | Sales/week @ ~26 PLN net | Sales/day |
|---|---|---|---|
| First customer | 26 PLN | 1 | — |
| 100 PLN/week | 100 | 4 | <1 |
| 500 PLN/week | 500 | 19 | ~3 |
| 1 000 PLN/week | 1 000 | 38 | ~5–6 |
| 5 000 PLN/week | 5 000 | 192 | ~27 |

Slightly more sales are needed per PLN target than under the old $9 pricing, which is the direct tradeoff for a lower-friction price aimed at a market with no existing reference point for this product.

## What has to be true to reach 5 000 PLN/week

- ~22 unlocks/day, sustained. At a realistic free→paid conversion rate for this kind of tool (5–15% of people who get a free score, given the score itself creates urgency), that implies **150–450 free analyses/day** — i.e. meaningful but not viral-scale organic/SEO traffic (comparable to a single well-performing Reddit post or a handful of ranking SEO pages, not millions of views).
- No paid acquisition is assumed or needed at this stage per the brief's "no ads before confirmed conversion" rule.

## Where the 50 PLN budget should go (not yet spent)

Recommended, in order, only once free-tier organic traffic + at least 1 real sale validates demand:
1. A real domain (e.g. `beattheats.com` or similar) — ~40–50 PLN/year — improves trust/conversion and free SEO authority vs. a `github.io` subdomain. **Requires the owner's payment card — flagged for approval, not spent yet.**
2. Nothing else is needed at 50 PLN scale — Gumroad, hosting, and the algorithm are all free.
