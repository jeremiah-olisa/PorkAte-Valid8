# porkate-valid8-nest

NestJS integration module for the porkate-valid8 KYC/KYB verification framework. Provides seamless integration with NestJS applications, including dependency injection, decorators, and comprehensive verification endpoints.

## Installation

```bash
npm install porkate-valid8-nest porkate-valid8 porkate-valid8-identitypass
# or
yarn add porkate-valid8-nest porkate-valid8 porkate-valid8-identitypass
# or
pnpm add porkate-valid8-nest porkate-valid8 porkate-valid8-identitypass
```

## Features

- **NestJS Module Integration**: Full dependency injection support with `Valid8Module`
- **Service Wrapper**: `Valid8Service` for easy access to verification functionality
- **Decorator Support**: `@Verify` decorator for method-level verification
- **Type-Safe**: Full TypeScript support with strongly-typed DTOs
- **Comprehensive Endpoints**: Ready-to-use verification endpoints for all services
- **Error Handling**: Built-in error handling and validation
- **Async Configuration**: Support for both synchronous and asynchronous module configuration
- **Global Module**: Can be configured as a global module for app-wide access

## Quick Start

### 1. Environment Setup

Create a `.env` file in your project root:

```env
IDENTITY_PASS_API_KEY=your_api_key_here
IDENTITY_PASS_APP_ID=your_app_id_here
IDENTITY_PASS_BASE_URL=https://api.myidentitypass.com
IDENTITY_PASS_TIMEOUT=30000
```

### 2. Module Configuration

#### Basic Setup (Synchronous)

```typescript
import { Module } from '@nestjs/common';
import { Valid8Module } from 'porkate-valid8-nest';
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';

@Module({
  imports: [
    Valid8Module.forRoot({
      config: {
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
              baseUrl: process.env.IDENTITY_PASS_BASE_URL,
              timeout: parseInt(process.env.IDENTITY_PASS_TIMEOUT || '30000'),
            },
          },
        ],
      },
      factories: {
        identitypass: (config: any) => new IdentityPassCompositeAdapter(config),
      },
    }),
  ],
})
export class AppModule {}
```

#### Advanced Setup (Asynchronous with ConfigService)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Valid8Module } from 'porkate-valid8-nest';
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    Valid8Module.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('IDENTITY_PASS_API_KEY');
        const appId = configService.get<string>('IDENTITY_PASS_APP_ID');

        if (!apiKey || !appId) {
          throw new Error('IdentityPass credentials not configured');
        }

        return {
          config: {
            defaultAdapter: 'identitypass',
            enableFallback: true,
            adapters: [
              {
                name: 'identitypass',
                enabled: true,
                priority: 1,
                config: {
                  apiKey,
                  appId,
                  baseUrl: configService.get<string>(
                    'IDENTITY_PASS_BASE_URL',
                    'https://api.myidentitypass.com'
                  ),
                  timeout: configService.get<number>(
                    'IDENTITY_PASS_TIMEOUT',
                    30000
                  ),
                },
              },
            ],
          },
          factories: {
            identitypass: (config: any) => new IdentityPassCompositeAdapter(config),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 3. Using the Service

#### Basic Service Usage

```typescript
import { Injectable } from '@nestjs/common';
import { Valid8Service } from 'porkate-valid8-nest';

@Injectable()
export class VerificationService {
  constructor(private readonly valid8Service: Valid8Service) {}

  async verifyUserNIN(nin: string, firstName: string, lastName: string) {
    return await this.valid8Service.verifyNIN({
      nin,
      firstName,
      lastName,
    });
  }

  async verifyUserBVN(bvn: string, firstName: string, lastName: string) {
    return await this.valid8Service.verifyBVN({
      bvn,
      firstName,
      lastName,
    });
  }
}
```

#### Advanced Service Usage with Specific Adapters

```typescript
import { Injectable } from '@nestjs/common';
import { Valid8Service } from 'porkate-valid8-nest';
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';

@Injectable()
export class AdvancedVerificationService {
  constructor(private readonly valid8Service: Valid8Service) {}

  private getIdentityPassAdapter(): IdentityPassCompositeAdapter {
    const adapter = this.valid8Service.getDefaultAdapter();
    if (!adapter || !('getNINService' in adapter)) {
      throw new Error('IdentityPass adapter not available');
    }
    return adapter as any as IdentityPassCompositeAdapter;
  }

  async verifyNINWithFace(data: {
    nin: string;
    firstName: string;
    lastName: string;
    image: string; // Base64 encoded image
  }) {
    const adapter = this.getIdentityPassAdapter();
    const ninService = adapter.getNINService();

    if (!ninService?.verifyNINWithFace) {
      throw new Error('NIN face verification not supported');
    }

    return await ninService.verifyNINWithFace(data);
  }

  async verifyCACAdvance(rcNumber: string) {
    const adapter = this.getIdentityPassAdapter();
    const cacService = adapter.getCACService();

    if (!cacService?.verifyCACAdvance) {
      throw new Error('CAC advance verification not supported');
    }

    return await cacService.verifyCACAdvance({ rcNumber });
  }
}
```

### 4. Creating Controllers

#### Basic Controller

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Valid8Service } from 'porkate-valid8-nest';

@Controller('verification')
export class VerificationController {
  constructor(private readonly valid8Service: Valid8Service) {}

  @Post('nin')
  @HttpCode(HttpStatus.OK)
  async verifyNIN(@Body() body: { nin: string; firstName: string; lastName: string }) {
    return await this.valid8Service.verifyNIN(body);
  }

  @Post('bvn')
  @HttpCode(HttpStatus.OK)
  async verifyBVN(@Body() body: { bvn: string; firstName: string; lastName: string }) {
    return await this.valid8Service.verifyBVN(body);
  }
}
```

#### Advanced Controller with Validation

```typescript
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { Valid8Service } from 'porkate-valid8-nest';
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';

class VerifyNINDto {
  nin!: string;
  firstName!: string;
  lastName!: string;
  dateOfBirth?: string;
}

class VerifyNINWithFaceDto extends VerifyNINDto {
  image!: string; // Base64 encoded image
}

@Controller('verification')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class VerificationController {
  constructor(private readonly valid8Service: Valid8Service) {}

  private getIdentityPassAdapter(): IdentityPassCompositeAdapter {
    const adapter = this.valid8Service.getDefaultAdapter();
    if (!adapter || !('getNINService' in adapter)) {
      throw new BadRequestException('IdentityPass adapter not configured');
    }
    return adapter as any as IdentityPassCompositeAdapter;
  }

  @Post('nin')
  @HttpCode(HttpStatus.OK)
  async verifyNIN(@Body() body: VerifyNINDto) {
    try {
      return await this.valid8Service.verifyNIN(body);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'NIN verification failed'
      );
    }
  }

  @Post('nin/face')
  @HttpCode(HttpStatus.OK)
  async verifyNINWithFace(@Body() body: VerifyNINWithFaceDto) {
    try {
      const adapter = this.getIdentityPassAdapter();
      const ninService = adapter.getNINService();

      if (!ninService?.verifyNINWithFace) {
        throw new BadRequestException('NIN face verification not available');
      }

      return await ninService.verifyNINWithFace(body);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'NIN face verification failed'
      );
    }
  }
}
```

## Using the @Verify Decorator

The `@Verify` decorator allows you to mark methods that require verification:

```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Verify } from 'porkate-valid8-nest';
import { ServiceType } from 'porkate-valid8';

@Controller('protected')
export class ProtectedController {
  @Post('verify-nin')
  @Verify({ serviceType: ServiceType.NIN, adapter: 'identitypass' })
  async verifyNIN(@Body() data: any) {
    // This method will be decorated with verification metadata
    // You can implement guards to automatically perform verification
    return { message: 'NIN verified', data };
  }

  @Post('verify-bvn')
  @Verify({ serviceType: ServiceType.BVN })
  async verifyBVN(@Body() data: any) {
    // Uses default adapter
    return { message: 'BVN verified', data };
  }
}
```

## Complete Example Application

Here's a complete NestJS application with comprehensive verification endpoints:

### app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Valid8Module } from 'porkate-valid8-nest';
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    Valid8Module.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: {
          defaultAdapter: 'identitypass',
          enableFallback: true,
          adapters: [
            {
              name: 'identitypass',
              enabled: true,
              priority: 1,
              config: {
                apiKey: configService.get<string>('IDENTITY_PASS_API_KEY')!,
                appId: configService.get<string>('IDENTITY_PASS_APP_ID')!,
                baseUrl: configService.get<string>('IDENTITY_PASS_BASE_URL', 'https://api.myidentitypass.com'),
                timeout: configService.get<number>('IDENTITY_PASS_TIMEOUT', 30000),
              },
            },
          ],
        },
        factories: {
          identitypass: (config: any) => new IdentityPassCompositeAdapter(config),
        },
      }),
      inject: [ConfigService],
    }),

    VerificationModule,
  ],
})
export class AppModule {}
```

### verification/verification.module.ts

```typescript
import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
```

### verification/verification.service.ts

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { Valid8Service } from 'porkate-valid8-nest';
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';

@Injectable()
export class VerificationService {
  constructor(private readonly valid8Service: Valid8Service) {}

  private getIdentityPassAdapter(): IdentityPassCompositeAdapter {
    const adapter = this.valid8Service.getDefaultAdapter();
    if (!adapter || !('getNINService' in adapter)) {
      throw new BadRequestException('IdentityPass adapter not configured');
    }
    return adapter as any as IdentityPassCompositeAdapter;
  }

  // NIN Verification
  async verifyNIN(data: { nin: string; firstName: string; lastName: string; dateOfBirth?: string }) {
    const adapter = this.getIdentityPassAdapter();
    const ninService = adapter.getNINService();
    if (!ninService) throw new BadRequestException('NIN service not available');

    return await ninService.verifyNIN(data);
  }

  async verifyNINWithFace(data: { nin: string; firstName: string; lastName: string; image: string }) {
    const adapter = this.getIdentityPassAdapter();
    const ninService = adapter.getNINService();
    if (!ninService?.verifyNINWithFace) throw new BadRequestException('NIN face verification not available');

    return await ninService.verifyNINWithFace(data);
  }

  // BVN Verification
  async verifyBVN(data: { bvn: string; firstName: string; lastName: string; dateOfBirth?: string }) {
    const adapter = this.getIdentityPassAdapter();
    const bvnService = adapter.getBVNService();
    if (!bvnService) throw new BadRequestException('BVN service not available');

    return await bvnService.verifyBVN(data);
  }

  async verifyBVNAdvance(data: { bvn: string }) {
    const adapter = this.getIdentityPassAdapter();
    const bvnService = adapter.getBVNService();
    if (!bvnService?.verifyBVNAdvance) throw new BadRequestException('BVN advance verification not available');

    return await bvnService.verifyBVNAdvance(data);
  }

  // CAC Verification
  async verifyCAC(data: { rcNumber: string }) {
    const adapter = this.getIdentityPassAdapter();
    const cacService = adapter.getCACService();
    if (!cacService) throw new BadRequestException('CAC service not available');

    return await cacService.verifyCAC(data);
  }

  async verifyCACAdvance(data: { rcNumber: string }) {
    const adapter = this.getIdentityPassAdapter();
    const cacService = adapter.getCACService();
    if (!cacService?.verifyCACAdvance) throw new BadRequestException('CAC advance verification not available');

    return await cacService.verifyCACAdvance(data);
  }

  // Add more verification methods as needed...
}
```

### verification/verification.controller.ts

```typescript
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verification')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  private handleError(error: unknown): never {
    const message = error instanceof Error ? error.message : 'Verification failed';
    throw new BadRequestException(message);
  }

  // NIN Endpoints
  @Post('nin')
  @HttpCode(HttpStatus.OK)
  async verifyNIN(@Body() body: { nin: string; firstName: string; lastName: string; dateOfBirth?: string }) {
    try {
      return await this.verificationService.verifyNIN(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('nin/face')
  @HttpCode(HttpStatus.OK)
  async verifyNINWithFace(@Body() body: { nin: string; firstName: string; lastName: string; image: string }) {
    try {
      return await this.verificationService.verifyNINWithFace(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // BVN Endpoints
  @Post('bvn')
  @HttpCode(HttpStatus.OK)
  async verifyBVN(@Body() body: { bvn: string; firstName: string; lastName: string; dateOfBirth?: string }) {
    try {
      return await this.verificationService.verifyBVN(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('bvn/advance')
  @HttpCode(HttpStatus.OK)
  async verifyBVNAdvance(@Body() body: { bvn: string }) {
    try {
      return await this.verificationService.verifyBVNAdvance(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // CAC Endpoints
  @Post('cac')
  @HttpCode(HttpStatus.OK)
  async verifyCAC(@Body() body: { rcNumber: string }) {
    try {
      return await this.verificationService.verifyCAC(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('cac/advance')
  @HttpCode(HttpStatus.OK)
  async verifyCACAdvance(@Body() body: { rcNumber: string }) {
    try {
      return await this.verificationService.verifyCACAdvance(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add more endpoints as needed...
}
```

## API Endpoints

Once configured, your application will expose the following verification endpoints:

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

### CAC Verification
- `POST /verification/cac` - Basic CAC verification
- `POST /verification/cac/advance` - Advanced CAC verification with directors/shareholders
- `POST /verification/cac/search-name` - Search company by name
- `POST /verification/cac/search-rc` - Search company by RC number

### Other Verifications
- `POST /verification/drivers-license` - Driver's license verification
- `POST /verification/passport` - International passport verification
- `POST /verification/phone` - Phone number verification
- `POST /verification/bank-account` - Bank account verification
- `POST /verification/vehicle/plate` - Vehicle verification by plate number
- `POST /verification/vehicle/vin` - Vehicle verification by VIN
- `POST /verification/tax/tin` - TIN verification
- `POST /verification/tax/stamp-duty` - Stamp duty verification
- `POST /verification/voters-card` - Voter's card verification
- `POST /verification/credit/consumer-basic` - Consumer credit bureau (basic)
- `POST /verification/credit/consumer-advance` - Consumer credit bureau (advance)
- `POST /verification/credit/commercial-basic` - Commercial credit bureau (basic)
- `POST /verification/credit/commercial-advance` - Commercial credit bureau (advance)

## Error Handling

The module provides comprehensive error handling:

```typescript
import { BadRequestException } from '@nestjs/common';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('nin')
  async verifyNIN(@Body() body: VerifyNINDto) {
    try {
      return await this.verificationService.verifyNIN(body);
    } catch (error) {
      // Handle different types of errors
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Log unexpected errors
      console.error('Unexpected verification error:', error);
      throw new BadRequestException('Verification service temporarily unavailable');
    }
  }
}
```

## Validation

Use NestJS validation pipes for automatic request validation:

```typescript
import { IsString, IsOptional, IsDateString } from 'class-validator';

class VerifyNINDto {
  @IsString()
  nin!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}

@Controller('verification')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class VerificationController {
  // DTOs will be automatically validated
  @Post('nin')
  async verifyNIN(@Body() body: VerifyNINDto) {
    return await this.verificationService.verifyNIN(body);
  }
}
```

## Testing

Create unit tests for your verification services:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { Valid8Service } from 'porkate-valid8-nest';
import { VerificationService } from './verification.service';

describe('VerificationService', () => {
  let service: VerificationService;
  let valid8Service: jest.Mocked<Valid8Service>;

  beforeEach(async () => {
    const mockValid8Service = {
      verifyNIN: jest.fn(),
      verifyBVN: jest.fn(),
      getDefaultAdapter: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        {
          provide: Valid8Service,
          useValue: mockValid8Service,
        },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
    valid8Service = module.get(Valid8Service);
  });

  it('should verify NIN successfully', async () => {
    const mockResponse = { success: true, data: { /* mock data */ } };
    valid8Service.verifyNIN.mockResolvedValue(mockResponse);

    const result = await service.verifyNIN({
      nin: '12345678901',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(result).toEqual(mockResponse);
    expect(valid8Service.verifyNIN).toHaveBeenCalledWith({
      nin: '12345678901',
      firstName: 'John',
      lastName: 'Doe',
    });
  });
});
```

## Configuration Options

### Valid8Module Options

```typescript
interface Valid8ModuleOptions {
  config: VerificationManagerConfig;
  factories?: Record<string, (config: any) => any>;
}
```

### VerificationManagerConfig

```typescript
interface VerificationManagerConfig {
  defaultAdapter?: string;
  enableFallback?: boolean;
  adapters: AdapterConfig[];
}

interface AdapterConfig<T = any> {
  name: string;
  enabled: boolean;
  priority: number;
  config: T;
}
```

## Best Practices

1. **Environment Variables**: Always use environment variables for API keys and sensitive configuration
2. **Error Handling**: Implement comprehensive error handling in controllers
3. **Validation**: Use DTOs with class-validator for request validation
4. **Logging**: Implement proper logging for verification attempts and failures
5. **Rate Limiting**: Consider implementing rate limiting for verification endpoints
6. **Caching**: Cache verification results when appropriate (be mindful of data sensitivity)
7. **Fallback**: Enable fallback adapters for production resilience
8. **Monitoring**: Monitor verification success rates and response times
9. **Security**: Validate and sanitize all input data
10. **Testing**: Write comprehensive unit and integration tests

## Troubleshooting

### Common Issues

1. **Adapter Not Found**: Ensure the adapter factory is properly registered
2. **Service Not Available**: Check if the specific verification service is supported by your adapter
3. **Configuration Errors**: Verify environment variables and module configuration
4. **Timeout Errors**: Adjust timeout values in adapter configuration
5. **Validation Errors**: Ensure DTOs match the expected request format

### Debug Mode

Enable debug logging to troubleshoot issues:

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  async verifyNIN(data: VerifyNINDto) {
    this.logger.debug(`Verifying NIN: ${data.nin.substring(0, 4)}****`);

    try {
      const result = await this.valid8Service.verifyNIN(data);
      this.logger.debug(`NIN verification result: ${result.success}`);
      return result;
    } catch (error) {
      this.logger.error(`NIN verification failed:`, error);
      throw error;
    }
  }
}
```

## Migration from Direct Usage

If you're migrating from using porkate-valid8 directly:

### Before (Direct Usage)
```typescript
import { VerificationManager } from 'porkate-valid8';
import { IdentityPassAdapter } from 'porkate-valid8-identitypass';

const manager = new VerificationManager(config);
const adapter = manager.getDefaultAdapter();
const result = await adapter.verifyNIN(data);
```

### After (NestJS Integration)
```typescript
import { Valid8Service } from 'porkate-valid8-nest';

@Injectable()
export class VerificationService {
  constructor(private readonly valid8Service: Valid8Service) {}

  async verifyNIN(data: VerifyNINDto) {
    return await this.valid8Service.verifyNIN(data);
  }
}
```

## License

MIT</content>
<parameter name="filePath">/home/jeremiahdepredator/Documents/Dev/OpenSource/porkate-valid8/packages/nest/README.md
