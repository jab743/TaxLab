# Testing Guide

This project uses automated tests to validate both business logic and user-facing behavior in a React SPA.

## Tools

- **Vitest** (test runner)
- **React Testing Library** (component behavior testing)
- **@testing-library/user-event** (realistic user interaction simulation)
- **jsdom** (browser-like environment)

## Test suite scope

### Test files and counts

- `src/utils/taxCalculator.test.js` - 25 tests
- `src/components/Layout.test.jsx` - 7 tests
- `src/pages/TaxCenter.test.jsx` - 8 tests
- `src/pages/TaxCalculator.test.jsx` - 19 tests
- `src/pages/PlaceholderPage.test.jsx` - 4 tests

**Total: 63 tests**

### What is covered

#### 1) Core calculation logic (`taxCalculator.test.js`)

- Progressive tax calculations across multiple bands
- Band-boundary edge cases
- Decimal and very large salary inputs
- Empty/unsorted tax band handling
- Effective rate, net income, and breakdown integrity
- Currency and percentage formatting helpers

#### 2) UI and interaction behavior

- **Layout:** navigation structure, active state, and route links
- **Tax Center:** quick actions, status badges, quick stats, and date rendering
- **Tax Calculator:** loading/error states, input behavior, result rendering, and breakdown display
- **Tax Calculator Portal Modal:** open/close behavior and dialog content via React Portal
- **Tax Calculator Accessibility:** invalid-input semantics and keyboard modal dismissal
- **Placeholder pages:** title/icon/description and “Coming Soon” treatment

## Running tests

### Run everything once

```bash
npm test -- --run
```

### Watch mode

```bash
npm test
```

### Vitest UI

```bash
npm run test:ui
```

### Coverage run

```bash
npm run test:coverage
```

## Current status (latest local run)

From the most recent full run on **Mar 1, 2026**:

- **Test Files:** 5 passed, 0 failed (5 total)
- **Tests:** 63 passed, 0 failed (63 total)

All suites are now green, including updated coverage for the portal-backed details modal.

## Testing approach used

- Behavior-first assertions (what users see and do)
- Arrange-Act-Assert structure
- `waitFor` for async UI transitions
- Mocking external dependencies (`fetch`, route navigation)
- Focus on edge cases and failure modes

## Configuration

Vitest settings are defined in `vite.config.js`:

```javascript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
  css: true,
}
```

## Next improvements

- Add coverage thresholds in CI
- Add E2E smoke tests (Playwright/Cypress)
- Add accessibility automation (`axe`)
