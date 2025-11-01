# Identity Pass Adapter - Specialized Services Architecture

## Overview

The Identity Pass adapter has been refactored to use a specialized services architecture, providing better organization, type safety, and flexibility for different verification types.

## Architecture

### Old Architecture (Legacy - Still Supported)
```typescript
IdentityPassAdapter implements IVerificationAdapter
  - verifyNIN()
  - verifyBVN()
  - verifyCAC()
  - ... (all methods in one class)
```

### New Architecture (Recommended)
```typescript
IdentityPassCompositeAdapter implements ICompositeVerificationAdapter
  ├── NINService (ININVerificationService)
  │   ├── verifyNIN()
  │   ├── verifyNINWithFace()
  │   ├── verifyNINSlip()
  │   └── verifyVirtualNIN()
  ├── BVNService (IBVNVerificationService)
  │   ├── verifyBVN()
  │   ├── verifyBVNAdvance()
  │   ├── verifyBVNWithFace()
  │   └── getBVNByPhoneNumber()
  └── ... (other specialized services)
```

## Key Benefits

1. **Separation of Concerns**: Each verification type has its own dedicated service
2. **Better Type Safety**: Strongly typed request/response for each verification method
3. **Optional Methods**: Services can implement optional methods specific to their verification type
4. **Metadata Support**: All responses include `meta` field with original adapter response
5. **Extensibility**: Easy to add new verification methods without modifying existing code

## Usage Examples

### Using the New Composite Adapter

```typescript
import { IdentityPassCompositeAdapter } from '@porkate/valid8-identitypass';

const adapter = new IdentityPassCompositeAdapter({
  apiKey: 'your-api-key'
});

// Get specialized service
const ninService = adapter.getNINService();

if (ninService) {
  // Basic NIN verification
  const result = await ninService.verifyNIN({
    nin: '12345678901',
    firstName: 'John',
    lastName: 'Doe'
  });
  
  console.log(result.data); // Typed NINVerificationData
  console.log(result.meta); // Original IdentityPass response
  
  // NIN with face verification (if supported)
  if (ninService.verifyNINWithFace) {
    const faceResult = await ninService.verifyNINWithFace({
      nin: '12345678901',
      firstName: 'John',
      lastName: 'Doe',
      image: 'base64-encoded-image'
    });
  }
}

// Get BVN service
const bvnService = adapter.getBVNService();
if (bvnService) {
  const result = await bvnService.verifyBVN({
    bvn: '12345678901'
  });
  
  console.log(result.data); // Typed BVNVerificationData
  console.log(result.meta); // Original IdentityPass response
}
```

### Using Legacy Adapter (Backward Compatible)

```typescript
import { IdentityPassAdapter } from '@porkate/valid8-identitypass';

const adapter = new IdentityPassAdapter({
  apiKey: 'your-api-key'
});

const result = await adapter.verifyNIN({
  nin: '12345678901',
  firstName: 'John',
  lastName: 'Doe'
});

console.log(result.data); // Verification data
console.log(result.meta); // Original IdentityPass response (now included!)
```

## Response Structure

All verification responses now include a `meta` field containing the original adapter response:

```typescript
interface VerificationResponse<T = any, M = any> {
  success: boolean;
  data?: T;              // Normalized, typed data
  message?: string;
  error?: string;
  provider: string;
  timestamp: Date;
  meta?: M;             // Original adapter-specific response
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
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    // ... other normalized fields
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
      // ... all original fields
    }
  }
}
```

## Specialized Services

### ININVerificationService
Handles National Identification Number (NIN) verifications:
- `verifyNIN()` - Basic NIN verification
- `verifyNINWithFace()` - NIN verification with face matching
- `verifyNINSlip()` - NIN slip verification
- `verifyVirtualNIN()` - Virtual NIN verification

### IBVNVerificationService
Handles Bank Verification Number (BVN) verifications:
- `verifyBVN()` - Basic BVN verification
- `verifyBVNAdvance()` - Advanced BVN verification with history
- `verifyBVNWithFace()` - BVN verification with face matching
- `getBVNByPhoneNumber()` - Get BVN details by phone number

### Other Services (To Be Implemented)
- `ICACVerificationService` - Company/CAC verifications
- `IPassportVerificationService` - International passport verifications
- `IDriversLicenseVerificationService` - Driver's license verifications
- `IPhoneVerificationService` - Phone number verifications
- `IBankAccountVerificationService` - Bank account verifications
- `IVehicleVerificationService` - Vehicle/VIN verifications
- `ITaxVerificationService` - TIN and stamp duty verifications
- `IVotersCardVerificationService` - Voter's card verifications
- `ICreditBureauVerificationService` - Credit bureau checks
- `IOtherVerificationService` - Miscellaneous verifications (Address, NYSC, WAEC, etc.)

## Creating Your Own Specialized Service

```typescript
import { BaseIdentityPassService } from '@porkate/valid8-identitypass';
import { IMyCustomService, MyVerificationData, VerificationResponse } from '@porkate/valid8';

export class IdentityPassMyCustomService 
  extends BaseIdentityPassService 
  implements IMyCustomService {
  
  async verifyCustom(data: MyVerificationRequest): Promise<VerificationResponse<MyVerificationData>> {
    return this.makeRequest(
      '/api/v1/custom/endpoint',
      {
        // Map request data to IdentityPass format
        field1: data.field1,
        field2: data.field2,
      },
      this.mapCustomData
    );
  }
  
  private mapCustomData(verificationData: any, payload: any): MyVerificationData {
    return {
      // Map IdentityPass response to normalized format
      field1: verificationData.api_field1,
      field2: verificationData.api_field2,
      ...verificationData,
    };
  }
}
```

## Migration Guide

### From Old to New Architecture

**Before:**
```typescript
const adapter = new IdentityPassAdapter({ apiKey: 'key' });
const result = await adapter.verifyNIN({ nin: '123' });
```

**After:**
```typescript
const adapter = new IdentityPassCompositeAdapter({ apiKey: 'key' });
const ninService = adapter.getNINService();
const result = await ninService.verifyNIN({ nin: '123' });
```

### Handling Unsupported Methods

```typescript
const adapter = new IdentityPassCompositeAdapter({ apiKey: 'key' });

// Check if service is supported
const cacService = adapter.getCACService();
if (!cacService) {
  console.log('CAC verification not supported by this adapter');
}

// Or handle with try-catch
try {
  const ninService = adapter.getNINService();
  if (ninService.verifyNINSlip) {
    await ninService.verifyNINSlip({ /* ... */ });
  } else {
    console.log('NIN Slip verification not supported');
  }
} catch (error) {
  // Handle error
}
```

## Best Practices

1. **Check Service Availability**: Always check if a service exists before using it
2. **Use Type Guards**: TypeScript will help you check optional methods
3. **Access Meta Data**: Use the `meta` field when you need original adapter response
4. **Handle Errors Gracefully**: Services return errors in the response, not as exceptions
5. **Reuse Services**: Get services once and reuse them for multiple verifications

## Testing

```typescript
import { IdentityPassCompositeAdapter } from '@porkate/valid8-identitypass';

describe('NIN Verification', () => {
  let adapter: IdentityPassCompositeAdapter;
  
  beforeEach(() => {
    adapter = new IdentityPassCompositeAdapter({
      apiKey: process.env.IDENTITY_PASS_API_KEY!
    });
  });
  
  it('should verify NIN successfully', async () => {
    const ninService = adapter.getNINService();
    expect(ninService).toBeDefined();
    
    const result = await ninService!.verifyNIN({
      nin: '12345678901',
      firstName: 'John',
      lastName: 'Doe'
    });
    
    expect(result.success).toBe(true);
    expect(result.data?.nin).toBe('12345678901');
    expect(result.meta).toBeDefined(); // Original response available
  });
});
```

## Contributing

When adding new specialized services:

1. Create interface in `@porkate/valid8/interfaces/verification-services/`
2. Create service implementation in `@porkate/valid8-identitypass/services/`
3. Extend `BaseIdentityPassService` for shared functionality
4. Add getter method in `IdentityPassCompositeAdapter`
5. Update this documentation
6. Add tests for the new service

## Support

For issues or questions:
- GitHub Issues: [PorkAte-Valid8](https://github.com/jeremiah-olisa/PorkAte-Valid8)
- Documentation: [README.md](../../README.md)
