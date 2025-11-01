# @porkate/valid8

Core verification manager, interfaces, events system, and exceptions for the Valid8 KYC/KYB verification framework.

## Installation

```bash
npm install @porkate/valid8
# or
yarn add @porkate/valid8
# or
pnpm add @porkate/valid8
```

## Features

- **Verification Manager**: Centralized management of multiple verification adapters
- **Type-Safe Interfaces**: Comprehensive TypeScript interfaces for all verification types
- **Event System**: Built-in event emitter for tracking verification lifecycle
- **Exception Handling**: Standardized exception types for error management
- **Metrics Collection**: Performance tracking and monitoring
- **Event Logging**: Comprehensive logging with customizable log levels
- **Adapter Fallback**: Automatic fallback to alternative adapters when primary fails

## Quick Start

### Basic Setup

```typescript
import { VerificationManager } from '@porkate/valid8';
import { IdentityPassAdapter } from '@porkate/valid8-identitypass';

// Create verification manager
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

// Register adapter factory
manager.registerFactory('identitypass', (config) => {
  return new IdentityPassAdapter(config);
});

// Get adapter and verify
const adapter = manager.getDefaultAdapter();
const result = await adapter.verifyNIN({
  nin: '12345678901',
  firstName: 'John',
  lastName: 'Doe',
});

console.log(result.success); // true/false
console.log(result.data);    // Verification data
console.log(result.meta);    // Original adapter response
```

### Using Specialized Services (Recommended)

```typescript
import { IdentityPassCompositeAdapter } from '@porkate/valid8-identitypass';

const adapter = new IdentityPassCompositeAdapter({
  apiKey: process.env.IDENTITY_PASS_API_KEY,
});

// Get NIN verification service
const ninService = adapter.getNINService();
if (ninService) {
  // Basic verification
  const result = await ninService.verifyNIN({
    nin: '12345678901',
    firstName: 'John',
    lastName: 'Doe',
  });

  // Advanced verification with face matching
  if (ninService.verifyNINWithFace) {
    const faceResult = await ninService.verifyNINWithFace({
      nin: '12345678901',
      firstName: 'John',
      lastName: 'Doe',
      image: 'base64-encoded-image',
    });
  }
}
```

## Core Concepts

### Verification Manager

The `VerificationManager` handles multiple adapters with fallback support:

```typescript
const manager = new VerificationManager({
  defaultAdapter: 'identitypass',
  enableFallback: true, // Enable automatic fallback
  adapters: [
    { name: 'identitypass', enabled: true, priority: 1, config: {...} },
    { name: 'youverify', enabled: true, priority: 2, config: {...} },
  ],
});

// Get adapter with fallback
const adapter = manager.getAdapterWithFallback('identitypass');
```

### Verification Response

All verification methods return a standardized response:

```typescript
interface VerificationResponse<T = any, M = any> {
  success: boolean;      // Verification success status
  data?: T;              // Typed verification data
  message?: string;      // Human-readable message
  error?: string;        // Error message if failed
  provider: string;      // Adapter name
  timestamp: Date;       // Response timestamp
  meta?: M;             // Original adapter response
}
```

### Event System

Track verification lifecycle with events:

```typescript
import { VerificationEventEmitter } from '@porkate/valid8';

const eventEmitter = new VerificationEventEmitter();

// Listen to verification events
eventEmitter.on('verification:started', (data) => {
  console.log(`Verification started: ${data.serviceType}`);
});

eventEmitter.on('verification:completed', (data) => {
  console.log(`Verification completed in ${data.duration}ms`);
});

eventEmitter.on('verification:failed', (data) => {
  console.error(`Verification failed: ${data.error}`);
});
```

### Metrics Collection

Collect and analyze verification metrics:

```typescript
import { MetricsCollector } from '@porkate/valid8';

const metricsCollector = new MetricsCollector(eventEmitter);

// Get metrics
const metrics = metricsCollector.getMetrics();
console.log(metrics.totalVerifications);
console.log(metrics.successRate);
console.log(metrics.averageResponseTime);

// Get metrics by service type
const ninMetrics = metricsCollector.getMetricsByService('nin');
```

### Event Logger

Log verification activities:

```typescript
import { EventLogger, LogLevel } from '@porkate/valid8';

const logger = new EventLogger(eventEmitter, {
  logLevel: LogLevel.INFO,
  logToConsole: true,
  customLogger: (level, message, data) => {
    // Custom logging implementation
    myLogger.log(level, message, data);
  },
});
```

## Specialized Service Interfaces

The package provides 12 specialized service interfaces for different verification types:

### 1. NIN Verification Service
```typescript
interface ININVerificationService {
  verifyNIN(data: NINVerificationRequest): Promise<VerificationResponse<NINVerificationData>>;
  verifyNINWithFace?(data: NINWithFaceVerificationRequest): Promise<VerificationResponse<NINVerificationData>>;
  verifyNINSlip?(data: NINSlipVerificationRequest): Promise<VerificationResponse<NINVerificationData>>;
  verifyVirtualNIN?(data: VirtualNINVerificationRequest): Promise<VerificationResponse<NINVerificationData>>;
  isReady(): boolean;
}
```

### 2. BVN Verification Service
```typescript
interface IBVNVerificationService {
  verifyBVN(data: BVNVerificationRequest): Promise<VerificationResponse<BVNVerificationData>>;
  verifyBVNAdvance?(data: BVNAdvanceVerificationRequest): Promise<VerificationResponse<BVNVerificationData>>;
  verifyBVNWithFace?(data: BVNWithFaceVerificationRequest): Promise<VerificationResponse<BVNVerificationData>>;
  getBVNByPhoneNumber?(data: BVNByPhoneNumberRequest): Promise<VerificationResponse<BVNVerificationData>>;
  isReady(): boolean;
}
```

### Other Services
- `ICACVerificationService` - Company/CAC verification
- `IDriversLicenseVerificationService` - Driver's license verification
- `IPassportVerificationService` - International passport verification
- `IPhoneVerificationService` - Phone number verification
- `IBankAccountVerificationService` - Bank account verification
- `IVehicleVerificationService` - Vehicle/VIN verification
- `ITaxVerificationService` - TIN and stamp duty verification
- `IVotersCardVerificationService` - Voter's card verification
- `ICreditBureauVerificationService` - Credit bureau checks
- `IOtherVerificationService` - Miscellaneous verifications

## Exception Handling

```typescript
import {
  VerificationException,
  VerificationFailedException,
  VerificationConfigurationException,
  AdapterNotFoundException,
  NotImplementedException,
} from '@porkate/valid8';

try {
  const adapter = manager.getAdapter('unknown');
} catch (error) {
  if (error instanceof AdapterNotFoundException) {
    console.error('Adapter not found:', error.message);
    console.log('Available adapters:', error.details.availableAdapters);
  }
}

// Handle unsupported methods
const service = adapter.getSomeService();
if (!service) {
  throw new NotImplementedException('Service not supported by this adapter');
}
```

## Configuration

### Adapter Configuration
```typescript
interface AdapterConfig<T = any> {
  name: string;
  enabled?: boolean;
  priority?: number;
  config: T;
}
```

### Manager Configuration
```typescript
interface VerificationManagerConfig<TConfig = any> {
  defaultAdapter?: string;
  enableFallback?: boolean;
  adapters: AdapterConfig<TConfig>[];
}
```

## Best Practices

1. **Use Type-Safe Interfaces**: Always use specific service interfaces instead of `any`
2. **Handle Fallback**: Enable fallback for production environments
3. **Monitor Events**: Use event emitter to track verification lifecycle
4. **Collect Metrics**: Implement metrics collection for performance monitoring
5. **Check Service Availability**: Always check if a service exists before using it
6. **Access Original Response**: Use the `meta` field when you need the raw adapter response
7. **Handle Errors Gracefully**: Catch and handle exceptions appropriately

## TypeScript Support

This package is written in TypeScript and includes comprehensive type definitions:

```typescript
import type {
  IVerificationAdapter,
  ICompositeVerificationAdapter,
  VerificationResponse,
  NINVerificationRequest,
  NINVerificationData,
  // ... all other types
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

## Building

```bash
# Build the package
npm run build

# Watch mode for development
npm run dev
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Write tests for new features
2. Ensure all tests pass
3. Follow the existing code style
4. Update documentation

## License

MIT

## Support

- GitHub Issues: [PorkAte-Valid8](https://github.com/jeremiah-olisa/PorkAte-Valid8)
- Documentation: See package README files and ARCHITECTURE.md

## Related Packages

- [@porkate/valid8-identitypass](../identitypass) - IdentityPass adapter
- [@porkate/valid8-dashboard](../dashboard) - Monitoring dashboard
- [@porkate/valid8-nest](../nest) - NestJS integration
