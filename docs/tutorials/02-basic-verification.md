# Tutorial 2: Basic Verification

Learn how to perform basic identity verification operations using Porkate-Valid8.

## Prerequisites

- Completed [Tutorial 1: Installation and Setup](./01-installation.md)
- Valid IdentityPass API credentials
- Basic understanding of TypeScript/JavaScript async/await

## Overview

This tutorial covers:
- NIN (National Identification Number) verification
- BVN (Bank Verification Number) verification
- Understanding verification responses
- Basic error handling

## NIN Verification

### Basic NIN Verification

```typescript
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';

const adapter = new IdentityPassCompositeAdapter({
  apiKey: process.env.IDENTITY_PASS_API_KEY!,
  appId: process.env.IDENTITY_PASS_APP_ID!,
});

// Get NIN service
const ninService = adapter.getNINService();

if (ninService) {
  const result = await ninService.verifyNIN({
    nin: '12345678901',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01', // Optional
  });

  if (result.success) {
    console.log('NIN verified successfully!');
    console.log('User data:', result.data);
  } else {
    console.log('Verification failed:', result.error);
  }
}
```

### Understanding the Response

The verification response has this structure:

```typescript
{
  success: boolean;           // Verification success status
  data?: {                   // Returned when successful
    nin: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    // ... other fields
  };
  error?: string;            // Error message when failed
  message?: string;          // Additional context
  statusCode?: number;       // HTTP status code
  timestamp?: Date;          // Request timestamp
  meta?: any;               // Original API response
}
```

### Accessing Original API Response

The `meta` field contains the original IdentityPass API response:

```typescript
const result = await ninService.verifyNIN(data);

if (result.success) {
  console.log('Processed data:', result.data);
  console.log('Original API response:', result.meta);
}
```

## BVN Verification

### Basic BVN Verification

```typescript
const bvnService = adapter.getBVNService();

if (bvnService) {
  const result = await bvnService.verifyBVN({
    bvn: '12345678901',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01', // Optional
  });

  if (result.success) {
    console.log('BVN verified successfully!');
    console.log('Bank details:', result.data);
  }
}
```

### BVN Response Data

```typescript
{
  success: true,
  data: {
    bvn: '12345678901',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    phone: '+234801234567',
    email: 'john.doe@example.com',
    enrollmentBank: 'First Bank',
    enrollmentBranch: 'Lagos',
    // ... other fields
  }
}
```

## CAC Verification

### Basic Company Verification

```typescript
const cacService = adapter.getCACService();

if (cacService) {
  const result = await cacService.verifyCAC({
    rcNumber: 'RC123456',
  });

  if (result.success) {
    console.log('Company verified!');
    console.log('Company name:', result.data.companyName);
    console.log('Registration date:', result.data.registrationDate);
  }
}
```

## Phone Number Verification

### Basic Phone Verification

```typescript
const phoneService = adapter.getPhoneService();

if (phoneService) {
  const result = await phoneService.verifyPhone({
    phone: '+234801234567',
  });

  if (result.success) {
    console.log('Phone carrier:', result.data.carrier);
    console.log('Line type:', result.data.lineType);
  }
}
```

## Bank Account Verification

### Verify Bank Account

```typescript
const bankService = adapter.getBankAccountService();

if (bankService) {
  const result = await bankService.verifyBankAccount({
    accountNumber: '1234567890',
    bankCode: '044', // Access Bank code
  });

  if (result.success) {
    console.log('Account name:', result.data.accountName);
    console.log('Account number:', result.data.accountNumber);
  }
}
```

### List Bank Codes

```typescript
if (bankService?.listBankCodes) {
  const result = await bankService.listBankCodes();

  if (result.success) {
    result.data.forEach((bank: any) => {
      console.log(`${bank.name}: ${bank.code}`);
    });
  }
}
```

## Error Handling

### Basic Error Handling

```typescript
try {
  const result = await ninService.verifyNIN(data);

  if (!result.success) {
    // Verification failed
    console.error('Verification failed:', result.error);
    console.error('Status code:', result.statusCode);
  }
} catch (error) {
  // Request failed (network error, timeout, etc.)
  console.error('Request error:', error.message);
}
```

### Comprehensive Error Handling

```typescript
async function verifyNINWithErrorHandling(data: any) {
  try {
    const ninService = adapter.getNINService();

    if (!ninService) {
      throw new Error('NIN service not available');
    }

    const result = await ninService.verifyNIN(data);

    if (!result.success) {
      // Handle different error scenarios
      switch (result.statusCode) {
        case 400:
          console.error('Invalid request data:', result.error);
          break;
        case 401:
          console.error('Authentication failed. Check API credentials.');
          break;
        case 404:
          console.error('NIN not found:', result.error);
          break;
        case 429:
          console.error('Rate limit exceeded. Please try again later.');
          break;
        case 500:
          console.error('Server error:', result.error);
          break;
        default:
          console.error('Verification failed:', result.error);
      }

      return null;
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Request error:', error.message);
    }
    return null;
  }
}
```

## Checking Service Availability

Always check if a service is available before using it:

```typescript
const ninService = adapter.getNINService();

if (!ninService) {
  console.error('NIN service is not available');
  // Handle gracefully - maybe try alternative verification
} else if (!ninService.isReady()) {
  console.error('NIN service is not properly configured');
} else {
  // Proceed with verification
  const result = await ninService.verifyNIN(data);
}
```

## Complete Example

Here's a complete example with multiple verification types:

```typescript
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';
import dotenv from 'dotenv';

dotenv.config();

async function performVerifications() {
  // Initialize adapter
  const adapter = new IdentityPassCompositeAdapter({
    apiKey: process.env.IDENTITY_PASS_API_KEY!,
    appId: process.env.IDENTITY_PASS_APP_ID!,
  });

  // Check adapter is ready
  if (!adapter.isReady()) {
    throw new Error('Adapter not properly configured');
  }

  // 1. Verify NIN
  console.log('1. Verifying NIN...');
  const ninService = adapter.getNINService();
  if (ninService) {
    try {
      const ninResult = await ninService.verifyNIN({
        nin: '12345678901',
        firstName: 'John',
        lastName: 'Doe',
      });

      if (ninResult.success) {
        console.log('✅ NIN verified:', ninResult.data.firstName, ninResult.data.lastName);
      } else {
        console.log('❌ NIN verification failed:', ninResult.error);
      }
    } catch (error) {
      console.error('❌ NIN request error:', error);
    }
  }

  // 2. Verify BVN
  console.log('\n2. Verifying BVN...');
  const bvnService = adapter.getBVNService();
  if (bvnService) {
    try {
      const bvnResult = await bvnService.verifyBVN({
        bvn: '12345678901',
        firstName: 'John',
        lastName: 'Doe',
      });

      if (bvnResult.success) {
        console.log('✅ BVN verified:', bvnResult.data.firstName, bvnResult.data.lastName);
      } else {
        console.log('❌ BVN verification failed:', bvnResult.error);
      }
    } catch (error) {
      console.error('❌ BVN request error:', error);
    }
  }

  // 3. Verify Phone
  console.log('\n3. Verifying Phone...');
  const phoneService = adapter.getPhoneService();
  if (phoneService) {
    try {
      const phoneResult = await phoneService.verifyPhone({
        phone: '+234801234567',
      });

      if (phoneResult.success) {
        console.log('✅ Phone verified:', phoneResult.data.carrier);
      } else {
        console.log('❌ Phone verification failed:', phoneResult.error);
      }
    } catch (error) {
      console.error('❌ Phone request error:', error);
    }
  }

  // 4. Verify Bank Account
  console.log('\n4. Verifying Bank Account...');
  const bankService = adapter.getBankAccountService();
  if (bankService) {
    try {
      const bankResult = await bankService.verifyBankAccount({
        accountNumber: '1234567890',
        bankCode: '044',
      });

      if (bankResult.success) {
        console.log('✅ Bank account verified:', bankResult.data.accountName);
      } else {
        console.log('❌ Bank verification failed:', bankResult.error);
      }
    } catch (error) {
      console.error('❌ Bank request error:', error);
    }
  }
}

// Run verifications
performVerifications()
  .then(() => console.log('\n✅ All verifications completed'))
  .catch((error) => console.error('\n❌ Error:', error));
```

## Best Practices

1. **Always Check Service Availability**
   ```typescript
   const service = adapter.getService();
   if (!service) {
     // Handle unavailable service
   }
   ```

2. **Handle Both Success and Failure**
   ```typescript
   if (result.success) {
     // Success path
   } else {
     // Failure path with proper error handling
   }
   ```

3. **Catch Network Errors**
   ```typescript
   try {
     const result = await service.verify(data);
   } catch (error) {
     // Handle network errors
   }
   ```

4. **Validate Input Data**
   ```typescript
   if (!nin || nin.length !== 11) {
     throw new Error('Invalid NIN format');
   }
   ```

5. **Use TypeScript Types**
   ```typescript
   import { NINVerificationRequest, VerificationResponse } from 'porkate-valid8';

   async function verifyNIN(data: NINVerificationRequest): Promise<VerificationResponse> {
     // TypeScript will ensure type safety
   }
   ```

## Next Steps

- [Tutorial 3: Advanced Verification](./03-advanced-verification.md) - Learn about face matching, advanced methods
- [Tutorial 5: Event System](./05-events.md) - Track verification lifecycle
- [Tutorial 7: Error Handling](./07-error-handling.md) - Advanced error handling patterns
