# packages/infra

**Scope**: Infrastructure as Code - Alchemy + Cloudflare

## Overview

Deployment configuration using Alchemy framework for Cloudflare Workers, D1, KV, and other resources.

## Structure

```
packages/infra/
├── src/
│   └── index.ts         # Alchemy stack definition
├── .alchemy/            # Alchemy outputs (generated)
└── package.json
```

## Where to Look

| Task | Location |
|------|----------|
| Cloudflare resources | `src/index.ts` - Workers, D1, KV definitions |
| Deploy script | `bun run deploy` (from root) |
| Local dev | `bun run dev` - runs with miniflare |

## Conventions

- **Alchemy**: TypeScript IaC framework for Cloudflare
- **Resources**: Define Workers, D1 database, KV namespaces in `src/index.ts`
- **Dev**: `alchemy dev` for local emulation
- **Deploy**: `alchemy deploy` to Cloudflare

## Anti-Patterns

- **NEVER edit** `.alchemy/` directory - auto-generated
- **No hardcoded secrets** - use env vars
- **No direct CF API calls** - use Alchemy resources

## Commands

```bash
# From root:
bun run dev      # Runs infra + db in dev mode
bun run deploy   # Deploy to Cloudflare
bun run destroy  # Destroy Alchemy resources
```

## Notes

- Requires `.env` and `.env.local` in this directory
- See `.env.example` for required variables
- Alchemy outputs to `.alchemy/` (gitignored)
- Stateful resources (DB) preserved on destroy/redeploy