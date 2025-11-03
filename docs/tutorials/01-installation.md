# Tutorial 1: Installation and Setup

This tutorial will guide you through installing and setting up the Porkate-Valid8 verification framework.

## Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- TypeScript 5.x (optional but recommended)
- An IdentityPass API account (for IdentityPass adapter)

## Installation

### Option 1: Install Core Package Only

If you plan to create custom adapters:

```bash
npm install porkate-valid8
# or
yarn add porkate-valid8
# or
pnpm add porkate-valid8
```

### Option 2: Install with IdentityPass Adapter

For Nigerian identity verification services:

```bash
npm install porkate-valid8 porkate-valid8-identitypass
# or
yarn add porkate-valid8 porkate-valid8-identitypass
# or
pnpm add porkate-valid8 porkate-valid8-identitypass
```

### Option 3: NestJS Integration

For NestJS applications:

```bash
npm install porkate-valid8-nest porkate-valid8 porkate-valid8-identitypass
# or
yarn add porkate-valid8-nest porkate-valid8 porkate-valid8-identitypass
# or
pnpm add porkate-valid8-nest porkate-valid8 porkate-valid8-identitypass
```

## Environment Configuration

Create a `.env` file in your project root:

```env
# IdentityPass Configuration
IDENTITY_PASS_API_KEY=your_api_key_here
IDENTITY_PASS_APP_ID=your_app_id_here
IDENTITY_PASS_BASE_URL=https://api.myidentitypass.com
IDENTITY_PASS_TIMEOUT=30000
```

### Getting IdentityPass Credentials

1. Visit [IdentityPass](https://myidentitypass.com)
2. Sign up or log in to your account
3. Navigate to API settings
4. Generate your API key and App ID
5. Add them to your `.env` file

## TypeScript Configuration

Add the following to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## Project Structure

Organize your project as follows:

```
your-project/
├── src/
│   ├── config/
│   │   └── verification.config.ts
│   ├── services/
│   │   └── verification.service.ts
│   └── index.ts
├── .env
├── package.json
└── tsconfig.json
```

## Basic Setup Example

### 1. Create Configuration File

Create `src/config/verification.config.ts`:

```typescript
import { VerificationManagerConfig } from 'porkate-valid8';

export const verificationConfig: VerificationManagerConfig = {
  defaultAdapter: 'identitypass',
  enableFallback: false,
  adapters: [
    {
      name: 'identitypass',
      enabled: true,
      priority: 1,
      config: {
        apiKey: process.env.IDENTITY_PASS_API_KEY!,
        appId: process.env.IDENTITY_PASS_APP_ID!,
        baseUrl: process.env.IDENTITY_PASS_BASE_URL || 'https://api.myidentitypass.com',
        timeout: parseInt(process.env.IDENTITY_PASS_TIMEOUT || '30000'),
      },
    },
  ],
};
```

### 2. Create Verification Service

Create `src/services/verification.service.ts`:

```typescript
import { VerificationManager } from 'porkate-valid8';
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';
import { verificationConfig } from '../config/verification.config';

export class VerificationService {
  private manager: VerificationManager;

  constructor() {
    this.manager = new VerificationManager(verificationConfig);

    // Register IdentityPass adapter factory
    this.manager.registerFactory('identitypass', (config) => {
      return new IdentityPassCompositeAdapter(config);
    });
  }

  async verifyNIN(data: { nin: string; firstName: string; lastName: string }) {
    const adapter = this.manager.getDefaultAdapter();
    if (!adapter) {
      throw new Error('No adapter available');
    }

    return await adapter.verifyNIN(data);
  }

  async verifyBVN(data: { bvn: string; firstName: string; lastName: string }) {
    const adapter = this.manager.getDefaultAdapter();
    if (!adapter) {
      throw new Error('No adapter available');
    }

    return await adapter.verifyBVN(data);
  }
}
```

### 3. Create Main Entry Point

Create `src/index.ts`:

```typescript
import { VerificationService } from './services/verification.service';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  const verificationService = new VerificationService();

  try {
    // Example: Verify NIN
    const result = await verificationService.verifyNIN({
      nin: '12345678901',
      firstName: 'John',
      lastName: 'Doe',
    });

    console.log('Verification Result:', result);
  } catch (error) {
    console.error('Verification Error:', error);
  }
}

main();
```

## Install Additional Dependencies

For the example above, install `dotenv`:

```bash
npm install dotenv
npm install -D @types/node
```

## Running Your Application

### Development Mode

```bash
# Using ts-node
npx ts-node src/index.ts

# Or add to package.json scripts
npm run dev
```

### Production Mode

```bash
# Build TypeScript
npm run build

# Run compiled JavaScript
node dist/index.js
```

## Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "ts-node src/index.ts",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

## Verification

Test your setup with a simple script:

```typescript
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';

const adapter = new IdentityPassCompositeAdapter({
  apiKey: process.env.IDENTITY_PASS_API_KEY!,
  appId: process.env.IDENTITY_PASS_APP_ID!,
});

// Check if adapter is ready
if (adapter.isReady()) {
  console.log('✅ Adapter is properly configured');
} else {
  console.error('❌ Adapter configuration is incomplete');
}

// List available services
console.log('Available services:', adapter.getNINService() ? '✅ NIN' : '❌ NIN');
console.log('Available services:', adapter.getBVNService() ? '✅ BVN' : '❌ BVN');
console.log('Available services:', adapter.getCACService() ? '✅ CAC' : '❌ CAC');
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   ```bash
   npm install --save-dev @types/node
   ```

2. **Environment variables not loading**
   - Ensure `.env` file is in project root
   - Check `dotenv.config()` is called before using variables

3. **TypeScript compilation errors**
   - Verify `tsconfig.json` settings
   - Run `npm install typescript@latest`

4. **API authentication errors**
   - Verify API credentials in `.env`
   - Check API key is active on IdentityPass dashboard
   - Ensure no extra spaces in environment variables

## Next Steps

Now that you have Porkate-Valid8 installed and configured, proceed to:

- [Tutorial 2: Basic Verification](./02-basic-verification.md)
- [Tutorial 3: Advanced Verification](./03-advanced-verification.md)
- [Tutorial 4: NestJS Integration](./04-nestjs-integration.md)

## Additional Resources

- [Core Package Documentation](../../packages/core/README.md)
- [IdentityPass Adapter Documentation](../../packages/identitypass/README.md)
- [API Reference](../html/index.html)
