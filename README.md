# Web Metronome

[![CI](https://github.com/pierrehanne/web-metronome/actions/workflows/ci.yml/badge.svg)](https://github.com/pierrehanne/web-metronome/actions/workflows/ci.yml)
[![Deploy](https://github.com/pierrehanne/web-metronome/actions/workflows/deploy.yml/badge.svg)](https://github.com/pierrehanne/web-metronome/actions/workflows/deploy.yml)

A modern, precise online metronome built with the Web Audio API. Designed for musicians who need accurate tempo control for practice and performance.

## Features

- **Precise timing** — Web Audio API scheduler with lookahead pattern for sample-accurate clicks
- **BPM range 20–300** with Italian tempo markings (Grave through Prestissimo)
- **Tap tempo** — tap to detect BPM automatically
- **Time signatures** — 2/4, 3/4, 4/4, 5/4, 6/8, 7/8, 3/8, 9/8, 12/8
- **Accent first beat** with distinct frequency and volume
- **Volume control** with mute toggle
- **Visual beat indicator** — animated circular display with pulse and ring effects
- **Keyboard shortcuts** — full control without touching the mouse
- **Responsive** — works on mobile, tablet, and desktop

### Keyboard Shortcuts

| Key     | Action            |
| ------- | ----------------- |
| `Space` | Play / Stop       |
| `T`     | Tap tempo         |
| `↑`     | Increase BPM by 1 |
| `↓`     | Decrease BPM by 1 |

## Tech Stack

- [Next.js](https://nextjs.org/) 16 — App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5
- [Tailwind CSS](https://tailwindcss.com/) 4
- [shadcn/ui](https://ui.shadcn.com/) — component primitives
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) — unit and component tests
- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) — pre-commit validation
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — precise audio scheduling

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm 10 or later

### Installation

```bash
git clone https://github.com/pierrehanne/web-metronome.git
cd web-metronome
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

```
src/
  lib/__tests__/utils.test.ts              # cn() utility tests
  hooks/__tests__/use-metronome.test.ts    # Metronome engine logic (BPM, timing, playback)
  components/__tests__/metronome.test.tsx   # UI rendering and interaction tests
```

Tests cover:

- BPM clamping, rounding, and boundary values
- Time signature and volume state management
- Tap tempo BPM calculation and filtering
- Playback start/stop/toggle lifecycle
- Component rendering, keyboard shortcuts, and user interactions

## Git Hooks

Pre-commit hooks run automatically via [Husky](https://typicode.github.io/husky/) to validate code before each commit:

1. **lint-staged** — ESLint on staged `.ts`/`.tsx` files, Prettier on staged files
2. **Type check** — `tsc --noEmit`
3. **Tests** — full test suite

This ensures no broken code gets committed.

## Deployment

This project deploys to [Vercel](https://vercel.com/) automatically via GitHub Actions on every push to `main`.

### Setup Vercel Deployment

1. Install the [Vercel CLI](https://vercel.com/docs/cli) and link your project:
   ```bash
   npm i -g vercel
   vercel link
   ```
2. Get your tokens and IDs:
   - **`VERCEL_TOKEN`** — create at [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - **`VERCEL_ORG_ID`** and **`VERCEL_PROJECT_ID`** — found in `.vercel/project.json` after linking
3. Add these as [GitHub repository secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions):
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

Once configured, every push to `main` triggers: lint → type check → test → build → deploy.

CI also runs on pull requests (without deploying) via the separate CI workflow.

## Project Structure

```
src/
  app/                  # Next.js App Router pages and layout
  components/
    metronome.tsx       # Main metronome UI component
    ui/                 # shadcn/ui primitives (Button, Slider, Select, Tooltip)
  hooks/
    use-metronome.ts    # Web Audio API metronome engine hook
  lib/
    utils.ts            # Tailwind class merge utility
```

## License

MIT
