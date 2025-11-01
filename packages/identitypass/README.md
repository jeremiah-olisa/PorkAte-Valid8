# @porkate/valid8-identitypass

IdentityPass adapter for the Valid8 KYC/KYB verification framework. Provides Nigerian identity verification services including NIN, BVN, CAC, and more.

## Installation

```bash
npm install @porkate/valid8-identitypass @porkate/valid8
# or
yarn add @porkate/valid8-identitypass @porkate/valid8
# or
pnpm add @porkate/valid8-identitypass @porkate/valid8
```

## Features

- **Specialized Services**: Dedicated service classes for each verification type
- **Type-Safe**: Full TypeScript support with strongly-typed requests and responses
- **Multiple Verification Methods**: Support for basic and advanced verification methods
- **Face Matching**: Face verification for NIN, BVN, Passport, and Driver's License
- **Metadata Access**: Original IdentityPass response available via `meta` field
- **Backward Compatible**: Legacy adapter still supported

## Supported Verifications

- ✅ **NIN (National Identification Number)**: Basic, With Face, Slip, Virtual NIN
- ✅ **BVN (Bank Verification Number)**: Basic, Advance, With Face, By Phone Number
- 🚧 **CAC (Corporate Affairs Commission)**: Basic, Advance, Company Search (Coming Soon)
- 🚧 **International Passport**: Basic, V2, Image, With Face (Coming Soon)
- 🚧 **Driver's License**: Basic, Advance, Image, With Face, V2 (Coming Soon)
- 🚧 **Phone Number**: Basic, Advance (Coming Soon)
- 🚧 **Bank Account**: Basic, Advance, Comparison (Coming Soon)
- 🚧 **Vehicle**: Plate Number, VIN/Chassis (Coming Soon)
- 🚧 **Tax**: TIN, Stamp Duty (Coming Soon)
- 🚧 **Voter's Card** (Coming Soon)
- 🚧 **Credit Bureau**: Consumer, Commercial (Coming Soon)
- 🚧 **Others**: Address, NYSC, Insurance, WAEC, Documents (Coming Soon)

## Quick Start

### Modern Approach (Recommended)

```typescript
import { IdentityPassCompositeAdapter } from '@porkate/valid8-identitypass';

const adapter = new IdentityPassCompositeAdapter({
  apiKey: process.env.IDENTITY_PASS_API_KEY,
  baseUrl: 'https://api.myidentitypass.com', // optional
  timeout: 30000, // optional, default 30s
});

// Check if adapter is ready
if (!adapter.isReady()) {
  throw new Error('Adapter not configured properly');
}

// Get NIN service
const ninService = adapter.getNINService();
if (ninService) {
  // Basic NIN verification
  const result = await ninService.verifyNIN({
    nin: '12345678901',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
  });

  if (result.success) {
    console.log('NIN verified:', result.data);
    console.log('Original response:', result.meta);
  } else {
    console.error('Verification failed:', result.error);
  }
}
```

### Legacy Approach (Still Supported)

```typescript
import { IdentityPassAdapter } from '@porkate/valid8-identitypass';

const adapter = new IdentityPassAdapter({
  apiKey: process.env.IDENTITY_PASS_API_KEY,
});

const result = await adapter.verifyNIN({
  nin: '12345678901',
  firstName: 'John',
  lastName: 'Doe',
});

console.log(result.success);
console.log(result.data);
console.log(result.meta); // Now includes original response
```

## Usage Examples

### NIN Verification

#### Basic NIN Verification
```typescript
const ninService = adapter.getNINService();
const result = await ninService.verifyNIN({
  nin: '12345678901',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
});
```

#### NIN with Face Matching
```typescript
if (ninService.verifyNINWithFace) {
  const result = await ninService.verifyNINWithFace({
    nin: '12345678901',
    firstName: 'John',
    lastName: 'Doe',
    image: 'base64-encoded-face-image',
  });
}
```

#### NIN Slip Verification
```typescript
if (ninService.verifyNINSlip) {
  const result = await ninService.verifyNINSlip({
    nin: '12345678901',
    slipNumber: 'SLIP123456',
  });
}
```

#### Virtual NIN Verification
```typescript
if (ninService.verifyVirtualNIN) {
  const result = await ninService.verifyVirtualNIN({
    virtualNin: 'VNIN123456789',
    firstName: 'John',
    lastName: 'Doe',
  });
}
```

### BVN Verification

#### Basic BVN Verification
```typescript
const bvnService = adapter.getBVNService();
const result = await bvnService.verifyBVN({
  bvn: '12345678901',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
});
```

#### BVN Advance Verification
```typescript
if (bvnService.verifyBVNAdvance) {
  const result = await bvnService.verifyBVNAdvance({
    bvn: '12345678901',
    includeHistory: true,
  });
}
```

#### BVN with Face Matching
```typescript
if (bvnService.verifyBVNWithFace) {
  const result = await bvnService.verifyBVNWithFace({
    bvn: '12345678901',
    image: 'base64-encoded-face-image',
  });
}
```

#### Get BVN by Phone Number
```typescript
if (bvnService.getBVNByPhoneNumber) {
  const result = await bvnService.getBVNByPhoneNumber({
    phoneNumber: '+2348012345678',
  });
}
```

## Response Structure

All verification methods return a standardized response:

```typescript
interface VerificationResponse<T, M> {
  success: boolean;              // Verification success status
  data?: T;                      // Typed verification data
  message?: string;              // Human-readable message
  error?: string;                // Error message if failed
  provider: string;              // "identitypass"
  timestamp: Date;               // Response timestamp
  meta?: M;                      // Original IdentityPass API response
}
```

### Example Response

```typescript
{
  success: true,
  data: {
    nin: '12345678901',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Smith',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    phoneNumber: '+2348012345678',
    address: '123 Main St, Lagos',
    photo: 'base64-encoded-photo',
    stateOfOrigin: 'Lagos',
    lga: 'Lagos Island',
    // ... other fields
  },
  message: 'Verification successful',
  provider: 'identitypass',
  timestamp: new Date('2024-01-01T00:00:00Z'),
  meta: {
    // Original IdentityPass API response
    status: true,
    detail: 'Verification successful',
    response_code: '00',
    verification: {
      nin: '12345678901',
      firstname: 'John',
      lastname: 'Doe',
      // ... all original fields from IdentityPass
    }
  }
}
```

## Configuration

```typescript
interface IdentityPassConfig {
  apiKey: string;                                    // Required: Your IdentityPass API key
  baseUrl?: string;                                 // Optional: Default 'https://api.myidentitypass.com'
  timeout?: number;                                 // Optional: Request timeout in ms, default 30000
}
```

## Error Handling

```typescript
try {
  const ninService = adapter.getNINService();
  
  if (!ninService) {
    throw new Error('NIN verification service not available');
  }

  const result = await ninService.verifyNIN({
    nin: '12345678901',
  });

  if (!result.success) {
    console.error('Verification failed:', result.error);
    console.error('Meta data:', result.meta);
  }
} catch (error) {
  console.error('Request error:', error.message);
}
```

## Checking Method Availability

```typescript
const ninService = adapter.getNINService();

if (ninService) {
  // Basic verification always available
  await ninService.verifyNIN({...});

  // Check optional methods
  if (ninService.verifyNINWithFace) {
    await ninService.verifyNINWithFace({...});
  }

  if (ninService.verifyNINSlip) {
    await ninService.verifyNINSlip({...});
  }
}
```

## Integration with Verification Manager

```typescript
import { VerificationManager } from '@porkate/valid8';
import { IdentityPassAdapter } from '@porkate/valid8-identitypass';

const manager = new VerificationManager({
  defaultAdapter: 'identitypass',
  enableFallback: true,
  adapters: [
    {
      name: 'identitypass',
      enabled: true,
      priority: 1,
      config: {
        apiKey: process.env.IDENTITY_PASS_API_KEY,
      },
    },
  ],
});

manager.registerFactory('identitypass', (config) => {
  return new IdentityPassAdapter(config);
});

const adapter = manager.getDefaultAdapter();
const result = await adapter.verifyNIN({...});
```

## Best Practices

1. **Environment Variables**: Store API keys in environment variables
   ```typescript
   const apiKey = process.env.IDENTITY_PASS_API_KEY;
   if (!apiKey) {
     throw new Error('IDENTITY_PASS_API_KEY not set');
   }
   ```

2. **Check Service Availability**: Always verify service exists before use
   ```typescript
   const service = adapter.getNINService();
   if (!service) {
     throw new Error('Service not available');
   }
   ```

3. **Handle Optional Methods**: Use optional chaining or checks
   ```typescript
   if (service.verifyNINWithFace) {
     await service.verifyNINWithFace({...});
   }
   ```

4. **Access Original Response**: Use `meta` field for adapter-specific data
   ```typescript
   console.log(result.meta.response_code); // IdentityPass response code
   ```

5. **Error Handling**: Always handle both success and error cases
   ```typescript
   if (result.success) {
     // Handle success
   } else {
     // Handle failure
     console.error(result.error);
   }
   ```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  IdentityPassAdapter,
  IdentityPassCompositeAdapter,
  IdentityPassConfig,
  IdentityPassVerificationResponse,
} from '@porkate/valid8-identitypass';

import type {
  NINVerificationRequest,
  NINVerificationData,
  BVNVerificationRequest,
  BVNVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## API Documentation

For detailed IdentityPass API documentation, visit:
- [IdentityPass Documentation](https://docs.prembly.com/docs/welcome-to-prembly-documentation)

## Architecture

For detailed information about the specialized services architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Contributing

Contributions are welcome! To add new verification services:

1. Create interface in `@porkate/valid8/interfaces/verification-services/`
2. Implement service class extending `BaseIdentityPassService`
3. Add getter method in `IdentityPassCompositeAdapter`
4. Update documentation
5. Add tests

## License

MIT

## Support

- GitHub Issues: [PorkAte-Valid8](https://github.com/jeremiah-olisa/PorkAte-Valid8)
- Documentation: [ARCHITECTURE.md](./ARCHITECTURE.md)

## Related Packages

- [@porkate/valid8](../core) - Core verification manager
- [@porkate/valid8-dashboard](../dashboard) - Monitoring dashboard
- [@porkate/valid8-nest](../nest) - NestJS integration
