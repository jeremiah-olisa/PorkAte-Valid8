# @porkate/valid8 NestJS Example

Comprehensive example demonstrating how to use the @porkate/valid8 packages in a NestJS application for KYC/KYB verification.

## Description

This example showcases:
- ✅ Installation from GitHub (not yet published to npm)
- ✅ Integration with NestJS using `@porkate/valid8-nest`
- ✅ All verification service types (NIN, BVN, CAC, Passport, Driver's License, etc.)
- ✅ Proper error handling and validation
- ✅ RESTful API endpoints for each verification type
- ✅ Environment configuration
- ✅ TypeScript best practices

## Prerequisites

- Node.js >= 18
- pnpm >= 8 (or npm/yarn)

## Installation

Since the packages are not yet published to npm, you need to install them from GitHub:

### Option 1: Install from GitHub directly

```bash
# Clone the main repository
git clone https://github.com/jeremiah-olisa/PorkAte-Valid8.git

# Navigate to the example directory
cd PorkAte-Valid8/examples/nestjs

# Install dependencies (this will use workspace references)
pnpm install
```

### Option 2: Install packages from GitHub in your own project

If you want to use these packages in your own NestJS project:

```bash
# Install packages from GitHub
pnpm add github:jeremiah-olisa/PorkAte-Valid8#main:\<path-to-packages\>

# Or using npm
npm install git+https://github.com/jeremiah-olisa/PorkAte-Valid8.git

# Then install specific workspace packages
pnpm add @porkate/valid8 @porkate/valid8-identitypass @porkate/valid8-nest
```

### Option 3: Local development (from monorepo)

```bash
# From the root of the monorepo
pnpm install
pnpm build

# Navigate to the example
cd examples/nestjs
pnpm install
```

## Configuration

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Update the `.env` file with your IdentityPass API credentials:

```env
PORT=3000
NODE_ENV=development

# Get your API key from https://myidentitypass.com
IDENTITY_PASS_API_KEY=your_identity_pass_api_key_here
IDENTITY_PASS_BASE_URL=https://api.myidentitypass.com
IDENTITY_PASS_TIMEOUT=30000
```

## Running the Application

```bash
# Development mode with hot reload
pnpm run start:dev

# Production mode
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

The API will be available at `http://localhost:3000`

## Available Endpoints

### Health Check
- `GET /` - Returns API status

### NIN Verification
- `POST /verification/nin` - Basic NIN verification
- `POST /verification/nin/face` - NIN verification with face matching
- `POST /verification/nin/slip` - NIN slip verification
- `POST /verification/nin/virtual` - Virtual NIN verification

### BVN Verification
- `POST /verification/bvn` - Basic BVN verification
- `POST /verification/bvn/advance` - Advanced BVN verification
- `POST /verification/bvn/face` - BVN verification with face matching
- `POST /verification/bvn/phone` - Get BVN by phone number

### CAC (Company) Verification
- `POST /verification/cac` - Basic CAC verification
- `POST /verification/cac/advance` - Advanced CAC verification with directors
- `POST /verification/cac/search-name` - Search company by name
- `POST /verification/cac/search-rc` - Search company by RC number

### Driver's License Verification
- `POST /verification/drivers-license` - Basic driver's license verification
- `POST /verification/drivers-license/face` - Driver's license with face matching
- `POST /verification/drivers-license/advance` - Advanced verification

### Passport Verification
- `POST /verification/passport` - Basic passport verification
- `POST /verification/passport/face` - Passport with face matching

### Phone Verification
- `POST /verification/phone` - Basic phone verification
- `POST /verification/phone/advance` - Advanced phone verification

### Bank Account Verification
- `POST /verification/bank-account` - Basic bank account verification
- `POST /verification/bank-account/compare` - Compare account with name
- `GET /verification/bank-account/codes` - List bank codes

### Vehicle Verification
- `POST /verification/vehicle/plate` - Verify by plate number
- `POST /verification/vehicle/vin` - Verify by VIN/Chassis

### Tax Verification
- `POST /verification/tax/tin` - TIN verification
- `POST /verification/tax/stamp-duty` - Stamp duty verification

### Voter's Card Verification
- `POST /verification/voters-card` - Voter's card verification

### Credit Bureau
- `POST /verification/credit/consumer-basic` - Consumer credit basic
- `POST /verification/credit/consumer-advance` - Consumer credit advanced
- `POST /verification/credit/commercial-basic` - Commercial credit basic

### Other Verifications
- `POST /verification/other/address` - Address verification
- `POST /verification/other/nysc` - NYSC verification
- `POST /verification/other/waec` - WAEC verification

## API Examples

### NIN Verification

```bash
curl -X POST http://localhost:3000/verification/nin \
  -H "Content-Type: application/json" \
  -d '{
    "nin": "12345678901",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "nin": "12345678901",
    "firstName": "John",
    "lastName": "Doe",
    "middleName": "Smith",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "phoneNumber": "+2348012345678",
    "photo": "base64-encoded-photo",
    "address": "123 Main St, Lagos"
  },
  "message": "NIN verification successful",
  "provider": "identitypass",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### BVN Verification with Face

```bash
curl -X POST http://localhost:3000/verification/bvn/face \
  -H "Content-Type: application/json" \
  -d '{
    "bvn": "12345678901",
    "image": "base64-encoded-face-image"
  }'
```

### CAC Verification

```bash
curl -X POST http://localhost:3000/verification/cac \
  -H "Content-Type: application/json" \
  -d '{
    "rcNumber": "RC1234567"
  }'
```

## Project Structure

```
examples/nestjs/
├── src/
│   ├── verification/
│   │   ├── dto/                    # Data Transfer Objects
│   │   │   ├── nin.dto.ts
│   │   │   ├── bvn.dto.ts
│   │   │   ├── cac.dto.ts
│   │   │   └── ...
│   │   ├── verification.controller.ts  # API endpoints
│   │   ├── verification.service.ts     # Business logic
│   │   └── verification.module.ts      # Module definition
│   ├── app.module.ts               # Root module
│   └── main.ts                     # Application entry point
├── .env.example                    # Environment template
└── README.md                       # This file
```

## Key Features Demonstrated

### 1. Module Integration

```typescript
import { Valid8Module } from '@porkate/valid8-nest';
import { IdentityPassAdapter } from '@porkate/valid8-identitypass';

@Module({
  imports: [
    Valid8Module.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        defaultAdapter: 'identitypass',
        enableFallback: false,
        adapters: [
          {
            name: 'identitypass',
            enabled: true,
            priority: 1,
            config: {
              apiKey: configService.get('IDENTITY_PASS_API_KEY'),
              baseUrl: configService.get('IDENTITY_PASS_BASE_URL'),
              timeout: configService.get('IDENTITY_PASS_TIMEOUT'),
            },
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 2. Using Specialized Services

```typescript
const adapter = this.valid8Service.getDefaultAdapter();
if (adapter && 'getNINService' in adapter) {
  const ninService = adapter.getNINService();
  if (ninService) {
    const result = await ninService.verifyNIN(dto);
    return result;
  }
}
```

### 3. Error Handling

```typescript
try {
  const result = await this.verificationService.verifyNIN(dto);
  if (!result.success) {
    throw new BadRequestException(result.error || 'Verification failed');
  }
  return result;
} catch (error) {
  throw new BadRequestException(error.message);
}
```

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Building for Production

```bash
# Build the application
pnpm run build

# Run the built application
node dist/main
```

## Troubleshooting

### "Cannot find module '@porkate/valid8'"

Make sure you've built the packages:
```bash
cd ../..  # Go to monorepo root
pnpm build
```

### "IDENTITY_PASS_API_KEY is not defined"

Make sure you've created a `.env` file with your API key:
```bash
cp .env.example .env
# Edit .env with your credentials
```

### Module resolution errors

If using this in your own project, ensure you have the correct paths in your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@porkate/valid8": ["./node_modules/@porkate/valid8"],
      "@porkate/valid8-identitypass": ["./node_modules/@porkate/valid8-identitypass"],
      "@porkate/valid8-nest": ["./node_modules/@porkate/valid8-nest"]
    }
  }
}
```

## Documentation

- [@porkate/valid8 Core](../../packages/core/README.md)
- [@porkate/valid8-identitypass](../../packages/identitypass/README.md)
- [@porkate/valid8-nest](../../packages/nest/README.md)
- [NestJS Documentation](https://docs.nestjs.com)

## Support

- GitHub Issues: [PorkAte-Valid8](https://github.com/jeremiah-olisa/PorkAte-Valid8/issues)
- NestJS Discord: [https://discord.gg/G7Qnnhy](https://discord.gg/G7Qnnhy)

## License

MIT
