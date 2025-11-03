# Quick Start Guide - porkate-valid8 NestJS Example

## Installation from GitHub

Since the packages are not published to npm yet, install directly from the GitHub repository:

### Option 1: Clone and Use from Monorepo

```bash
# Clone the repository
git clone https://github.com/jeremiah-olisa/PorkAte-Valid8.git
cd PorkAte-Valid8

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Navigate to the example
cd examples/nestjs

# Set up environment
cp .env.example .env
# Edit .env and add your IDENTITY_PASS_API_KEY and IDENTITY_PASS_APP_ID

# Run the example
pnpm run start:dev
```

### Option 2: Use in Your Own Project

Add the following to your `package.json`:

```json
{
  "dependencies": {
    "porkate-valid8": "github:jeremiah-olisa/PorkAte-Valid8#main:packages/core",
    "porkate-valid8-identitypass": "github:jeremiah-olisa/PorkAte-Valid8#main:packages/identitypass",
    "porkate-valid8-nest": "github:jeremiah-olisa/PorkAte-Valid8#main:packages/nest"
  }
}
```

Then run:
```bash
npm install
# or
pnpm install
# or
yarn install
```

## Quick API Examples

### Start the Server

```bash
pnpm run start:dev
```

The API will be available at `http://localhost:3000`

### Get API Information

```bash
curl http://localhost:3000
```

### Health Check

```bash
curl http://localhost:3000/health
```

### Verify NIN

```bash
curl -X POST http://localhost:3000/verification/nin \
  -H "Content-Type: application/json" \
  -d '{
    "nin": "12345678901",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Verify BVN

```bash
curl -X POST http://localhost:3000/verification/bvn \
  -H "Content-Type: application/json" \
  -d '{
    "bvn": "12345678901",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Verify CAC (Company)

```bash
curl -X POST http://localhost:3000/verification/cac \
  -H "Content-Type: application/json" \
  -d '{
    "rcNumber": "RC1234567"
  }'
```

### Search Company by Name

```bash
curl -X POST http://localhost:3000/verification/cac/search-name \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Example Corp"
  }'
```

### Verify Driver's License

```bash
curl -X POST http://localhost:3000/verification/drivers-license \
  -H "Content-Type: application/json" \
  -d '{
    "licenseNumber": "FKJ1234567",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Verify Phone Number

```bash
curl -X POST http://localhost:3000/verification/phone \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+2348012345678"
  }'
```

### Verify Bank Account

```bash
curl -X POST http://localhost:3000/verification/bank-account \
  -H "Content-Type: application/json" \
  -d '{
    "accountNumber": "0123456789",
    "bankCode": "058"
  }'
```

### List Bank Codes

```bash
curl http://localhost:3000/verification/bank-account/codes
```

### Verify Vehicle Plate Number

```bash
curl -X POST http://localhost:3000/verification/vehicle/plate \
  -H "Content-Type: application/json" \
  -d '{
    "plateNumber": "ABC123XY"
  }'
```

## Common Response Format

All verification endpoints return a standardized response:

```json
{
  "success": true,
  "data": {
    // Verification-specific data
  },
  "message": "Verification successful",
  "provider": "identitypass",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "meta": {
    // Original IdentityPass API response
  }
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes:

```json
{
  "statusCode": 400,
  "message": "Verification failed: Invalid NIN format",
  "error": "Bad Request"
}
```

## Available Endpoints

### Identity Verification
- `POST /verification/nin` - NIN verification
- `POST /verification/nin/face` - NIN with face matching
- `POST /verification/nin/slip` - NIN slip verification
- `POST /verification/nin/virtual` - Virtual NIN verification
- `POST /verification/bvn` - BVN verification
- `POST /verification/bvn/advance` - Advanced BVN verification
- `POST /verification/bvn/face` - BVN with face matching
- `POST /verification/bvn/phone` - Get BVN by phone number

### Business Verification
- `POST /verification/cac` - CAC verification
- `POST /verification/cac/advance` - Advanced CAC with directors
- `POST /verification/cac/search-name` - Search company by name
- `POST /verification/cac/search-rc` - Search company by RC number

### Document Verification
- `POST /verification/drivers-license` - Driver's license
- `POST /verification/drivers-license/face` - Driver's license with face
- `POST /verification/drivers-license/advance` - Advanced driver's license
- `POST /verification/passport` - Passport verification
- `POST /verification/passport/face` - Passport with face matching
- `POST /verification/voters-card` - Voter's card verification

### Service Verification
- `POST /verification/phone` - Phone number verification
- `POST /verification/phone/advance` - Advanced phone verification
- `POST /verification/bank-account` - Bank account verification
- `POST /verification/bank-account/compare` - Compare account with name
- `GET /verification/bank-account/codes` - List bank codes
- `POST /verification/vehicle/plate` - Vehicle plate number
- `POST /verification/vehicle/vin` - VIN/Chassis verification
- `POST /verification/tax/tin` - TIN verification
- `POST /verification/tax/stamp-duty` - Stamp duty verification

### Credit & Other
- `POST /verification/credit/consumer-basic` - Consumer credit basic
- `POST /verification/credit/consumer-advance` - Consumer credit advanced
- `POST /verification/credit/commercial-basic` - Commercial credit basic
- `POST /verification/other/address` - Address verification
- `POST /verification/other/nysc` - NYSC certificate verification
- `POST /verification/other/waec` - WAEC certificate verification

## Environment Variables

Required environment variables in `.env`:

```env
PORT=3000
NODE_ENV=development
IDENTITY_PASS_API_KEY=your_api_key_here
IDENTITY_PASS_APP_ID=your_app_id_here
IDENTITY_PASS_BASE_URL=https://api.myidentitypass.com
IDENTITY_PASS_TIMEOUT=30000
```

## Getting Your API Credentials

1. Sign up at [MyIdentityPass](https://myidentitypass.com)
2. Navigate to your dashboard
3. Generate an API key and App ID
4. Add both to your `.env` file

**Note**: The IdentityPass API requires both `x-api-key` and `app-id` headers for authentication.

## Support

For detailed documentation, see:
- [Main README](./README.md)
- [porkate-valid8 Core](../../packages/core/README.md)
- [porkate-valid8-identitypass](../../packages/identitypass/README.md)
- [porkate-valid8-nest](../../packages/nest/README.md)

## Troubleshooting

### Cannot find module errors
```bash
# Rebuild all packages from the monorepo root
cd ../..
pnpm build
```

### Application won't start
```bash
# Check your .env file exists and has valid values
cp .env.example .env
# Edit .env with your credentials
```

### Port already in use
```bash
# Change the PORT in .env file
PORT=3001
```
