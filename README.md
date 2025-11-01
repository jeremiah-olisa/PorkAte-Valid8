# @porkate/valid8 Monorepo

A flexible TypeScript KYC/KYB verification package with multiple service adapters and comprehensive event logging.

## Packages

### [@porkate/valid8](./packages/core)
Core verification manager, interfaces, events system, and exceptions.

### [@porkate/valid8-identitypass](./packages/identitypass)
IdentityPass adapter for Nigerian verification services (NIN, BVN, CAC, etc.).

**New in v2:** Specialized services architecture with strongly-typed verification methods. See [Architecture Documentation](./packages/identitypass/ARCHITECTURE.md) for details.

Key features:
- Specialized services for each verification type (NIN, BVN, CAC, etc.)
- Strongly typed requests and responses
- Support for advanced verification methods (face matching, slip verification, etc.)
- Original adapter response available in `meta` field
- Backward compatible with legacy adapter

### [@porkate/valid8-dashboard](./packages/dashboard)
Hangfire-style dashboard for monitoring verification activities and metrics.

### [@porkate/valid8-nest](./packages/nest)
NestJS integration module with decorators and services.

## Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 8

### Installation

```bash
# Install dependencies
pnpm install

# Bootstrap packages (link workspace dependencies)
pnpm bootstrap

# Build all packages
pnpm build
```

### Development

```bash
# Watch mode for all packages
pnpm dev

# Run tests
pnpm test

# Lint
pnpm lint

# Format code
pnpm format
```

## Monorepo Structure

```
porkate-valid8/
├── packages/
│   ├── core/              # @porkate/valid8
│   ├── identitypass/      # @porkate/valid8-identitypass
│   ├── dashboard/         # @porkate/valid8-dashboard
│   └── nest/              # @porkate/valid8-nest
├── examples/              # Usage examples
├── tests/                 # Integration tests
├── lerna.json             # Lerna configuration
├── pnpm-workspace.yaml    # PNPM workspace configuration
└── package.json           # Root package.json
```

## Publishing

```bash
# Version packages
pnpm version

# Publish to npm
pnpm publish
```

## License

MIT
