# EXPERIMENTS.md — BeatTheATS

Format: HYPOTHESIS → TEST → DATA → DECISION

## EXP-000: Idea selection (meta-experiment)
- **Hypothesis:** An ATS resume-match checker will score highest on problem-strength + willingness-to-pay of 20 candidate B2C ideas, because a direct paid competitor (Jobscan, $50/mo) already proves the market.
- **Test:** Structured weighted scoring of 20 ideas (see MARKET.md).
- **Data:** BeatTheATS scored 8.55/10, highest of all 20, ahead of runner-ups at 7.35.
- **Decision:** BUILD — proceed to MVP.

## EXP-001: Free tool drives organic signups (planned — not yet run)
- **Hypothesis:** Posting the free tool link (value-first, no ad) in 3–5 relevant subreddits/groups will generate ≥10 free analyses within 48 hours.
- **Test:** Post in r/resumes, r/jobs, and 1–2 relevant Facebook/LinkedIn groups; link to the live GitHub Pages URL.
- **Data:** *Pending — requires the owner action in AUTOMATION.md (enable Pages) before a live link exists to post.*
- **Decision:** *Pending.*

## EXP-002: Free-to-paid conversion (planned — not yet run)
- **Hypothesis:** At least 5% of people who run a free analysis and see a locked report will click "Unlock full report."
- **Test:** Compare `analysis_run` vs `unlock_click` event counts once traffic exists.
- **Data:** *Pending.*
- **Decision:** *Pending — if <2% after 100+ analyses, rework the paywall copy/teaser (e.g. show more of the gap, sharpen urgency) before concluding the price is wrong.*

## Kill criteria (per brief)
If, after running EXP-001 in 5+ communities and iterating copy once, there are still 0 free analyses or 0 purchases after a reasonable volume of free-tool usage (~100+ analyses with near-0% conversion), write a WHY_IT_FAILED note here and fall back to TOP 3 runner-up (#20 Mock-interview predictor or #14 AI-detector false-positive checker from MARKET.md).

## Win criteria (per brief)
First real payment + any repeat organic traffic → stop searching for the next idea, double down per ROADMAP.md Phase 2+.
