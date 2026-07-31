# Memory

A themed memory game built with Vite, TypeScript and SCSS.

## Features

- Four visual themes: Code Vibes, Gaming, DA Projects and Foods
- Selectable starting player
- Selectable board sizes: 16, 24 or 36 cards
- Animated card flip and pair matching
- Score tracking for both players
- Quit dialog with theme-specific styling
- Game over and winner screens

## Tech Stack

- Vite
- TypeScript
- SCSS

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
src/
  game/       Game logic, cards, player state and scoring
  screens/    Screen setup for start, home, game, end and winner screens
  themes/     Theme definitions, theme assets and visual mappings
  ui/         Shared DOM and screen helpers
  styles/     SCSS base, layout, page and theme styles
```

## Deployment

Run `npm run build` and upload the contents of the `dist` folder to the server.
The app is configured with relative asset paths, so it can be opened through the generated `dist/index.html`.
