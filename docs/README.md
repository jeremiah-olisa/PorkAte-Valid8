# Porkate-Valid8 Documentation

Welcome to the comprehensive documentation for the Porkate-Valid8 KYC/KYB verification framework.

## 📚 Documentation Structure

This documentation is organized into the following sections:

### Core Packages

- **[porkate-valid8](../packages/core/README.md)** - Core verification manager and interfaces
- **[porkate-valid8-identitypass](../packages/identitypass/README.md)** - IdentityPass adapter implementation
- **[porkate-valid8-nest](../packages/nest/README.md)** - NestJS integration module
- **[porkate-valid8-dashboard](../packages/dashboard/README.md)** - Monitoring dashboard

### API Documentation

- **[HTML Documentation](./html/index.html)** - Interactive HTML documentation (generated with JSDoc)
- **[Markdown Documentation](./markdown/)** - Markdown-formatted API reference

## 🚀 Quick Start

### Installation

```bash
# Install core package
npm install porkate-valid8

# Install with IdentityPass adapter
npm install porkate-valid8 porkate-valid8-identitypass

# For NestJS projects
npm install porkate-valid8-nest porkate-valid8 porkate-valid8-identitypass
```

### Basic Usage

```typescript
import { VerificationManager } from 'porkate-valid8';
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';

// Create adapter
const adapter = new IdentityPassCompositeAdapter({
  apiKey: process.env.IDENTITY_PASS_API_KEY,
  appId: process.env.IDENTITY_PASS_APP_ID,
});

// Verify NIN
const ninService = adapter.getNINService();
const result = await ninService.verifyNIN({
  nin: '12345678901',
  firstName: 'John',
  lastName: 'Doe',
});
```

## 📖 Tutorials

### Getting Started

1. [Installation and Setup](./tutorials/01-installation.md)
2. [Basic Verification](./tutorials/02-basic-verification.md)
3. [Advanced Verification](./tutorials/03-advanced-verification.md)
4. [NestJS Integration](./tutorials/04-nestjs-integration.md)

### Advanced Topics

5. [Event System](./tutorials/05-events.md)
6. [Metrics Collection](./tutorials/06-metrics.md)
7. [Error Handling](./tutorials/07-error-handling.md)
8. [Creating Custom Adapters](./tutorials/08-custom-adapters.md)

## 🏗️ Architecture

### System Overview

The Porkate-Valid8 framework is built on a modular architecture:

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Your NestJS/Express/etc Application)  │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│      Valid8 Core (Manager Layer)        │
│  - VerificationManager                  │
│  - Event System                         │
│  - Metrics Collection                   │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│       Adapter Layer                      │
│  - IdentityPass Adapter                 │
│  - Custom Adapters                      │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│    Service Provider APIs                │
│  - IdentityPass API                     │
│  - Other Provider APIs                  │
└─────────────────────────────────────────┘
```

### Key Concepts

#### 1. Verification Manager
Central orchestration layer that manages multiple adapters, handles fallbacks, and provides a unified interface.

#### 2. Adapters
Adapter implementations for specific verification service providers (e.g., IdentityPass). Each adapter implements the `IVerificationAdapter` interface.

#### 3. Services
Specialized service classes for different verification types (NIN, BVN, CAC, etc.). Each service implements type-specific interfaces.

#### 4. Event System
Built-in event emitter for tracking verification lifecycle, enabling monitoring and logging.

#### 5. Metrics Collection
Performance tracking and monitoring capabilities for analyzing verification operations.

## 🔧 Configuration

### Environment Variables

```env
# IdentityPass Configuration
IDENTITY_PASS_API_KEY=your_api_key_here
IDENTITY_PASS_APP_ID=your_app_id_here
IDENTITY_PASS_BASE_URL=https://api.myidentitypass.com
IDENTITY_PASS_TIMEOUT=30000
```

### Manager Configuration

```typescript
const config: VerificationManagerConfig = {
  defaultAdapter: 'identitypass',
  enableFallback: true,
  adapters: [
    {
      name: 'identitypass',
      enabled: true,
      priority: 1,
      config: {
        apiKey: process.env.IDENTITY_PASS_API_KEY!,
        appId: process.env.IDENTITY_PASS_APP_ID!,
      },
    },
  ],
};
```

## 📊 Supported Verifications

### Nigerian Identity Verifications

- ✅ **NIN** (National Identification Number)
  - Basic verification
  - Face matching
  - Slip verification
  - Virtual NIN

- ✅ **BVN** (Bank Verification Number)
  - Basic verification
  - Advanced verification
  - Face matching
  - Phone number lookup

- ✅ **CAC** (Corporate Affairs Commission)
  - Basic company verification
  - Advanced with directors/shareholders
  - Company search by name/RC number

- ✅ **Driver's License**
  - Basic verification
  - Face matching
  - Image verification

- ✅ **International Passport**
  - Basic verification
  - Face matching
  - Image verification

### Other Verifications

- ✅ Phone Number Verification
- ✅ Bank Account Verification
- ✅ Vehicle Verification (Plate & VIN)
- ✅ Tax Verification (TIN & Stamp Duty)
- ✅ Voter's Card Verification
- ✅ Credit Bureau Checks
- ✅ Address Verification
- ✅ NYSC Verification
- ✅ WAEC Verification

## 🎯 Use Cases

### 1. KYC Onboarding
Verify customer identity during account creation or onboarding processes.

### 2. KYB Compliance
Verify business entities and their directors for corporate compliance.

### 3. Financial Services
Bank account verification, credit bureau checks, and identity validation.

### 4. Background Checks
Comprehensive identity verification for employment or tenant screening.

### 5. Age Verification
Validate age and identity for age-restricted services.

## 🔒 Security Best Practices

1. **API Key Management**
   - Store API keys in environment variables
   - Never commit credentials to version control
   - Rotate keys regularly

2. **Data Handling**
   - Minimize storage of verification data
   - Implement data retention policies
   - Encrypt sensitive data at rest

3. **Rate Limiting**
   - Implement rate limiting on verification endpoints
   - Monitor for suspicious patterns
   - Cache verification results when appropriate

4. **Error Messages**
   - Don't expose sensitive information in errors
   - Log errors securely
   - Implement proper error monitoring

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Test Coverage

The framework maintains high test coverage:
- Unit tests for all core components
- Integration tests for adapters
- End-to-end tests for complete workflows

## 📈 Monitoring & Metrics

### Event Tracking

```typescript
import { VerificationEventEmitter, EventLogger } from 'porkate-valid8';

const eventEmitter = new VerificationEventEmitter();
const logger = new EventLogger(eventEmitter, {
  logLevel: LogLevel.INFO,
});

eventEmitter.on('verification:completed', (data) => {
  console.log(`Verification completed in ${data.duration}ms`);
});
```

### Metrics Collection

```typescript
import { MetricsCollector } from 'porkate-valid8';

const metricsCollector = new MetricsCollector(eventEmitter);

// Get overall metrics
const metrics = metricsCollector.getMetrics();
console.log(`Success Rate: ${metrics.successRate}%`);
console.log(`Avg Response Time: ${metrics.averageResponseTime}ms`);
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/jeremiah-olisa/PorkAte-Valid8.git

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## 📝 API Reference

For detailed API documentation, see:
- [HTML Documentation](./html/index.html)
- [Core API](./markdown/core.md)
- [IdentityPass Adapter API](./markdown/identitypass.md)
- [NestJS Integration API](./markdown/nest.md)

## 🆘 Support

### Documentation
- [GitHub Repository](https://github.com/jeremiah-olisa/PorkAte-Valid8)
- [Issue Tracker](https://github.com/jeremiah-olisa/PorkAte-Valid8/issues)

### Community
- Report bugs via [GitHub Issues](https://github.com/jeremiah-olisa/PorkAte-Valid8/issues)
- Request features via [GitHub Discussions](https://github.com/jeremiah-olisa/PorkAte-Valid8/discussions)

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript and modern JavaScript tooling
- Powered by IdentityPass API
- Integrated with NestJS framework
- Inspired by the need for robust KYC/KYB verification in Nigeria

---

**Note**: This documentation is automatically generated from the source code using JSDoc. For the most up-to-date information, please refer to the inline documentation in the source files.
