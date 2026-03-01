# TaxLab frontend (income tax calculator)

This is my take-home submission for the TaxLab frontend test.

It’s a React SPA that takes annual salary input, fetches tax bands from `income-tax-bands.json`, and calculates tax progressively with a clear band-by-band breakdown.

## What’s in the app

- Fetch tax bands from `/income-tax-bands.json` (client-side, treated like an API request)
- Validate salary input and calculate in real time
- Show:
  - gross income
  - total tax
  - effective rate
  - net income
  - per-band breakdown (taxable amount + tax paid)
- Handle loading and fetch error states
- Show calculation details in a modal (React Portal)

## Design decisions

- Kept tax logic in `src/utils/taxCalculator.js` so calculation behavior is easy to test and reason about.
- Treated tax bands as fetched data (instead of hardcoding) to match real-world API-driven UI flow.
- Focused on clarity over complexity: clear summaries first, then detailed breakdown on demand.

## Stack

- React 19 + Vite 7
- React Router 7
- Tailwind CSS
- Vitest + React Testing Library
- ESLint + Prettier
- Husky + lint-staged

## Project layout

```text
src/
	components/
		Layout.jsx              # Shared shell/nav
		ModalPortal.jsx         # Portal-backed modal
	hooks/
		useTaxBands.js          # Tax-band data hook
	pages/
		TaxCenter.jsx           # Landing page
		TaxCalculator.jsx       # Main calculator screen
		PlaceholderPage.jsx     # Placeholder routes
	services/
		taxBandService.js       # Fetch wrapper for tax bands
	utils/
		taxCalculator.js        # Pure tax calculation + format helpers
	test/
		setup.js                # Test setup
```

## How tax is calculated

Core logic lives in `src/utils/taxCalculator.js` so UI code stays lean.

1. Sort bands by `bandStart`
2. Calculate taxable amount per band
3. Sum tax and build per-band breakdown
4. Calculate effective rate + net income
5. Return rounded values for display

## Assumptions

- Salary input is annual gross income
- Progressive bands are used
- `bandEnd: null` means open-ended top band
- Client-side only (no server-side rendering)
- Currency helper currently formats as `en-NZ` / `NZD`

## What I prioritized (time-boxed build)

I treated this as a time-boxed implementation and focused on:

1. Correct tax math
2. Clear UX and validation feedback
3. Stable loading/error handling
4. Good test coverage around core behavior

Not included in this pass:

- Authentication
- Backend/API implementation
- Persistence/history
- Full E2E suite


## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run lint:fix` - fix lint issues where possible
- `npm run format` - run Prettier
- `npm run format:check` - check formatting
- `npm test` - run tests in watch mode
- `npm test -- --run` - run tests once
- `npm run test:ui` - open Vitest UI
- `npm run test:coverage` - run tests with coverage

## Testing

The test suite covers calculation edge cases plus key UI flows (Tax Center, layout, calculator states, modal behavior, and placeholder routes).

See `TESTING.md` for test details and current results.

## Next things I’d add

- E2E smoke tests (Playwright/Cypress)
- Multiple tax datasets (year/region switcher)
- Save recent calculations locally
- Automated a11y checks (axe + CI)

## AI Assistance Disclosure

AI was used as an assistive productivity tool, not as a substitute for understanding, implementation ownership, or validation.

**Tools used:** GitHub Copilot and ChatGPT

**How AI was used in this project:**

- Drafting/refining documentation wording
- Small UI iteration support (e.g., icon and styling adjustments)
- General implementation suggestions during development

**Validation approach:**

- All code changes were manually reviewed and adjusted as needed
- Functionality was validated by running:
	- `npm run lint`
	- `npm test -- --run`
	- `npm run build`

## Submission checklist

- React SPA implementation
- Tax bands loaded from `income-tax-bands.json` via client-side fetch
- No server-side interaction/rendering
- Progressive tax calculation with clear breakdown UI
- Loading and error states
- Test suite passing locally
- Lint and production build passing locally
