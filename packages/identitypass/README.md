# porkate-valid8-identitypass

IdentityPass adapter for the Valid8 KYC/KYB verification framework. Provides Nigerian identity verification services including NIN, BVN, CAC, and more.

## 📚 Documentation

**[📖 View Full API Documentation](https://jeremiah-olisa.github.io/PorkAte-Valid8/)** - Complete API reference with all services, methods, and examples.

For detailed service documentation, see:
- [IdentityPassAdapter](https://jeremiah-olisa.github.io/PorkAte-Valid8/IdentityPassAdapter.html)
- [IdentityPassCompositeAdapter](https://jeremiah-olisa.github.io/PorkAte-Valid8/IdentityPassCompositeAdapter.html)
- All service classes (NIN, BVN, CAC, etc.)

## Installation

```bash
npm install porkate-valid8-identitypass porkate-valid8
# or
yarn add porkate-valid8-identitypass porkate-valid8
# or
pnpm add porkate-valid8-identitypass porkate-valid8
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
- ✅ **CAC (Corporate Affairs Commission)**: Basic, Advance, Company Search by Name/Person/RC Number
- ✅ **International Passport**: Basic, V2, Image, With Face
- ✅ **Driver's License**: Basic, Advance, Image, With Face, V2
- ✅ **Phone Number**: Basic, Advance
- ✅ **Bank Account**: Basic, Advance, Comparison, List Bank Codes
- ✅ **Vehicle**: Plate Number, VIN/Chassis
- ✅ **Tax**: TIN, Stamp Duty
- ✅ **Voter's Card**: Basic verification
- ✅ **Credit Bureau**: Consumer (Basic/Advance), Commercial (Basic/Advance)
- ✅ **Others**: Address, NYSC, Insurance, National ID, WAEC, Documents (with/without Face)

## Quick Start

### Modern Approach (Recommended)

```typescript
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';

const adapter = new IdentityPassCompositeAdapter({
  apiKey: process.env.IDENTITY_PASS_API_KEY,
  appId: process.env.IDENTITY_PASS_APP_ID,
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
import { IdentityPassAdapter } from 'porkate-valid8-identitypass';

const adapter = new IdentityPassAdapter({
  apiKey: process.env.IDENTITY_PASS_API_KEY,
  appId: process.env.IDENTITY_PASS_APP_ID,
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

### CAC (Company) Verification

#### Basic CAC Verification
```typescript
const cacService = adapter.getCACService();
if (cacService) {
  const result = await cacService.verifyCAC({
    rcNumber: 'RC1234567',
    // or use bnNumber or companyName
  });
}
```

#### Advanced CAC with Directors and Shareholders
```typescript
if (cacService?.verifyCACAdvance) {
  const result = await cacService.verifyCACAdvance({
    rcNumber: 'RC1234567',
    includeDirectors: true,
    includeShareholdings: true,
  });
}
```

#### Company Search by Name
```typescript
if (cacService?.searchCompanyByName) {
  const result = await cacService.searchCompanyByName({
    companyName: 'Example Corp',
  });
}
```

### Vehicle Verification

```typescript
const vehicleService = adapter.getVehicleService();
if (vehicleService) {
  // By plate number
  const result = await vehicleService.verifyPlateNumber({
    plateNumber: 'ABC123XY',
  });
  
  // By VIN/Chassis
  const result2 = await vehicleService.verifyVINChasis({
    vinNumber: '1HGBH41JXMN109186',
  });
}
```

### Driver's License Verification

```typescript
const dlService = adapter.getDriversLicenseService();
if (dlService) {
  // Basic verification
  const result = await dlService.verifyDriversLicense({
    licenseNumber: 'FKJ1234567',
    firstName: 'John',
    lastName: 'Doe',
  });
  
  // With face matching
  if (dlService.verifyDriversLicenseWithFace) {
    const result2 = await dlService.verifyDriversLicenseWithFace({
      licenseNumber: 'FKJ1234567',
      image: 'base64-encoded-face-image',
    });
  }
}
```

### Passport Verification

```typescript
const passportService = adapter.getPassportService();
if (passportService) {
  // Basic passport verification
  const result = await passportService.verifyPassport({
    passportNumber: 'A12345678',
    firstName: 'John',
    lastName: 'Doe',
  });
  
  // With face matching
  if (passportService.verifyPassportWithFace) {
    const result2 = await passportService.verifyPassportWithFace({
      passportNumber: 'A12345678',
      image: 'base64-encoded-face-image',
    });
  }
}
```

### Phone Number Verification

```typescript
const phoneService = adapter.getPhoneService();
if (phoneService) {
  // Basic verification
  const result = await phoneService.verifyPhoneNumber({
    phoneNumber: '+2348012345678',
  });
  
  // Advanced with carrier info
  if (phoneService.verifyPhoneNumberAdvance) {
    const result2 = await phoneService.verifyPhoneNumberAdvance({
      phoneNumber: '+2348012345678',
      includeCarrierInfo: true,
    });
  }
}
```

### Bank Account Verification

```typescript
const bankService = adapter.getBankAccountService();
if (bankService) {
  // Basic verification
  const result = await bankService.verifyBankAccount({
    accountNumber: '0123456789',
    bankCode: '058',
  });
  
  // Account comparison with name
  if (bankService.compareBankAccount) {
    const result2 = await bankService.compareBankAccount({
      accountNumber: '0123456789',
      bankCode: '058',
      firstName: 'John',
      lastName: 'Doe',
    });
  }
  
  // List available bank codes
  if (bankService.listBankCodes) {
    const banks = await bankService.listBankCodes();
  }
}
```

### Tax Verification

```typescript
const taxService = adapter.getTaxService();
if (taxService) {
  // TIN verification
  const result = await taxService.verifyTIN({
    tin: '12345678-0001',
    channel: 'online',
  });
  
  // Stamp duty verification
  if (taxService.verifyStampDuty) {
    const result2 = await taxService.verifyStampDuty({
      referenceNumber: 'SD123456789',
    });
  }
}
```

### Voter's Card Verification

```typescript
const votersService = adapter.getVotersCardService();
if (votersService) {
  const result = await votersService.verifyVotersCard({
    vin: '90F5B12345678901',
    firstName: 'John',
    lastName: 'Doe',
    state: 'Lagos',
  });
}
```

### Credit Bureau Verification

```typescript
const creditService = adapter.getCreditBureauService();
if (creditService) {
  // Consumer credit - basic
  if (creditService.verifyCreditBureauConsumerBasic) {
    const result = await creditService.verifyCreditBureauConsumerBasic({
      bvn: '12345678901',
      phoneNumber: '+2348012345678',
    });
  }
  
  // Consumer credit - advanced
  if (creditService.verifyCreditBureauConsumerAdvance) {
    const result2 = await creditService.verifyCreditBureauConsumerAdvance({
      bvn: '12345678901',
      includeHistory: true,
    });
  }
  
  // Commercial credit - basic
  if (creditService.verifyCreditBureauCommercialBasic) {
    const result3 = await creditService.verifyCreditBureauCommercialBasic({
      rcNumber: 'RC1234567',
    });
  }
}
```

### Other Verification Services

```typescript
const otherService = adapter.getOtherService();
if (otherService) {
  // Address verification
  if (otherService.verifyAddress) {
    const result = await otherService.verifyAddress({
      address: '123 Main St, Lagos',
      state: 'Lagos',
    });
  }
  
  // NYSC verification
  if (otherService.verifyNYSC) {
    const result2 = await otherService.verifyNYSC({
      certificateNumber: 'NYSC/12345/2020',
      firstName: 'John',
      lastName: 'Doe',
    });
  }
  
  // WAEC verification
  if (otherService.verifyWAEC) {
    const result3 = await otherService.verifyWAEC({
      examNumber: '1234567890',
      examYear: '2020',
    });
  }
  
  // Insurance policy verification
  if (otherService.verifyInsurancePolicy) {
    const result4 = await otherService.verifyInsurancePolicy({
      policyNumber: 'POL123456789',
    });
  }
  
  // Document verification with face
  if (otherService.verifyDocumentWithFace) {
    const result5 = await otherService.verifyDocumentWithFace({
      documentType: 'national_id',
      documentNumber: 'ID123456789',
      image: 'base64-encoded-document-image',
      faceImage: 'base64-encoded-face-image',
    });
  }
}

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
  apiKey: string;                                    // Required: Your IdentityPass API key (x-api-key header)
  appId: string;                                     // Required: Your IdentityPass App ID (app-id header)
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
import { VerificationManager } from 'porkate-valid8';
import { IdentityPassAdapter } from 'porkate-valid8-identitypass';

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
        appId: process.env.IDENTITY_PASS_APP_ID,
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

1. **Environment Variables**: Store API credentials in environment variables
   ```typescript
   const apiKey = process.env.IDENTITY_PASS_API_KEY;
   const appId = process.env.IDENTITY_PASS_APP_ID;
   if (!apiKey || !appId) {
     throw new Error('IDENTITY_PASS_API_KEY and IDENTITY_PASS_APP_ID must be set');
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
} from 'porkate-valid8-identitypass';

import type {
  NINVerificationRequest,
  NINVerificationData,
  BVNVerificationRequest,
  BVNVerificationData,
  VerificationResponse,
} from 'porkate-valid8';
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

1. Create interface in `porkate-valid8/interfaces/verification-services/`
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

- [porkate-valid8](../core) - Core verification manager
- [porkate-valid8-dashboard](../dashboard) - Monitoring dashboard
- [porkate-valid8-nest](../nest) - NestJS integration
