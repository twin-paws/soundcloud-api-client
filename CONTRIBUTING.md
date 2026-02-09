# Contributing to soundcloud-api-ts

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone https://github.com/twin-paws/soundcloud-api-ts.git
cd soundcloud-api-ts
pnpm install
```

## Development Commands

| Command | Description |
| --- | --- |
| `pnpm test` | Run tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm build` | Build the package |

## Adding a New Endpoint

1. Add the method to the appropriate namespace in `src/` (e.g., `tracks.ts`, `users.ts`)
2. Add a standalone function export if applicable
3. Add TypeScript types in `src/types/`
4. Export from `src/index.ts`
5. Write tests in `src/__tests__/`
6. Update the README with the new method signature

## Code Style

- TypeScript strict mode is enabled
- Use function declarations over arrow functions for top-level exports
- All API methods accept an optional `{ token?: string }` as the last parameter
- Keep zero runtime dependencies

## Pull Request Requirements

Before submitting a PR, ensure:

- [ ] `pnpm test` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] New endpoints have tests
- [ ] README is updated if adding public API

## Integration Tests

To run integration tests against the real SoundCloud API:

```bash
cp .env.example .env
# Fill in your SoundCloud credentials
SOUNDCLOUD_CLIENT_ID=xxx SOUNDCLOUD_CLIENT_SECRET=xxx pnpm test
```

## Finding Work

Check [open issues](https://github.com/twin-paws/soundcloud-api-ts/issues) for things to work on. Issues labeled `good first issue` are a great starting point.
