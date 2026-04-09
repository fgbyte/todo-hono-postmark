# apps/web

**Scope**: Frontend application - React + TanStack Router + Tailwind v4 + shadcn/ui

## Overview

Client-side SPA with file-based routing via TanStack Router, Tailwind CSS v4 styling, and shadcn/ui components.

## Structure

```
apps/web/
├── src/
│   ├── routes/          # File-based routes (TanStack Router)
│   ├── components/      # React components
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Utility functions
│   └── index.css        # Tailwind + CSS vars
├── index.html
└── vite.config.ts       # Vite + Tailwind v4 plugin
```

## Where to Look

| Task | Location |
|------|----------|
| Add route | `src/routes/` - create `.tsx` file |
| Route layout | `src/routes/__root.tsx` |
| UI components | `src/components/ui/` |
| Styling | `src/index.css` - Tailwind v4 CSS vars |
| Vite config | `vite.config.ts` - Tailwind + TanStack Router plugin |

## Conventions

- **Routes**: File-based routing. Route params: `$param.tsx`, Layout: `__root.tsx`
- **Components**: shadcn/ui in `components/ui/`, app components in `components/`
- **Styling**: Tailwind v4 - no tailwind.config.js, configured in Vite plugin
- **Icons**: Lucide React (`lucide-react`)
- **State**: TanStack Store for global state, TanStack Query for server state

## Anti-Patterns

- **NEVER import from** `routeTree.gen.ts` - it's auto-generated
- **No direct API calls** - use TanStack Query hooks
- **No class components** - functional components only

## Commands

```bash
bun run dev        # Vite dev server (port 3001)
bun run build      # Production build
bun run check-types # TypeScript + TanStack Router gen
```

## Notes

- Port 3001 (server runs on 3000)
- TanStack Router generates `routeTree.gen.ts` on dev/build
- Environment vars via `@todo-hono-postmark/env/web`