# Deferred editorial review

The AI-discovery implementation preserves visible claims. Review these separately with the author before changing copy:

- **Router:** “accuracy parity” and “no measurable quality loss” should be scoped to the 50-prompt evaluation. Overlapping confidence intervals do not establish statistical equivalence. Consider reporting the measured accuracy, sample size, cost reduction, and limitations together. Confirm whether threshold tuning and final evaluation use independent data before describing the set as a final holdout.
- **TMD pipeline:** define “98% accuracy”: metric, reference, evaluation split, and uncertainty. Document hardware, workloads, and timing boundaries for the 10× comparison. Do not invent a definition or evidence.
- **Short case studies:** consider adding methods, limitations, and public evidence to TMD and AI-DataScience-Lab when available.

## Indexing baseline

Read-only Search Console inspection on November 2, 2026: the October 22 report showed 11 indexed URLs and one excluded thesis PDF. The sitemap submission showed “Couldn't fetch” and zero discovered pages; the current sitemap and its 12 page URLs were reachable. These are different populations and dates, not proof that all current sitemap pages are indexed. Bing was signed out; its report inspection is deferred.

Compare impressions, clicks, AI referrals, and `ai_share` events several weeks after rollout. `ai_share` carries only action, provider, and page_path; copying is counted only after clipboard success. AI referrals omit mentions that produce no visit. Indexing and citations are not guaranteed.
