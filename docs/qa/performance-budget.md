# Performance Budget

We define performance budgets to keep the user experience fast and predictable.

## 1. Metrics and Targets

For the main user journey (home → primary flow):

- **Largest Contentful Paint (LCP):** < 2.5s (on 3G/slow network test profile)
- **First Input Delay (FID) / Interaction to Next Paint (INP):** Good rating per Lighthouse.
- **Total Blocking Time (TBT):** < 200ms
- **CLS (Cumulative Layout Shift):** < 0.1

## 2. Asset Budgets

- **Initial HTML:** < 50 KB (compressed).
- **Critical CSS:** < 50 KB (compressed).
- **Initial JS bundle (per app):** Target < 200-300 KB (compressed).
- **Image assets:** Optimized (modern formats where possible, e.g., WebP/AVIF).

## 3. Monitoring

- Run Lighthouse in CI for:
  - Landing page.
  - Primary application route.
- Capture scores and fail builds if:
  - Performance score falls below a threshold (e.g., 80).
  - LCP or TBT exceeds defined budget.

## 4. Guidance

- Use code splitting and lazy loading for non-critical routes.
- Avoid heavy libraries where lighter alternatives exist.
- Cache static assets with long-lived caching headers via CDN.

Update budgets as real user monitoring (RUM) and business requirements evolve.
