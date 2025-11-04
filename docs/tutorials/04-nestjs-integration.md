# Tutorial 4: NestJS Integration

This tutorial demonstrates how to integrate Porkate-Valid8 with a NestJS application for seamless KYC/KYB verification.

## 1. Install Dependencies

```bash
npm install porkate-valid8-nest porkate-valid8 porkate-valid8-identitypass
```

## 2. Configure the Module

**Basic Setup:**
```typescript
import { Module } from '@nestjs/common';
import { Valid8Module } from 'porkate-valid8-nest';
import { IdentityPassCompositeAdapter } from 'porkate-valid8-identitypass';

@Module({
  imports: [
    Valid8Module.forRoot({
      config: {
        defaultAdapter: 'identitypass',
        adapters: [
          {
            name: 'identitypass',
            enabled: true,
            priority: 1,
            config: { apiKey: process.env.IDENTITY_PASS_API_KEY },
          },
        ],
      },
      factories: {
        identitypass: (config) => new IdentityPassCompositeAdapter(config),
      },
    }),
  ],
})
export class AppModule {}
```

**Async Setup with ConfigService:**
```typescript
Valid8Module.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    config: {
      defaultAdapter: 'identitypass',
      adapters: [
        {
          name: 'identitypass',
          enabled: true,
          priority: 1,
          config: {
            apiKey: configService.get('IDENTITY_PASS_API_KEY'),
          },
        },
      ],
    },
    factories: {
      identitypass: (config) => new IdentityPassCompositeAdapter(config),
    },
  }),
  inject: [ConfigService],
})
```

## 3. Using the Service in Controllers

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { Valid8Service } from 'porkate-valid8-nest';

@Controller('verify')
export class VerificationController {
  constructor(private readonly valid8: Valid8Service) {}

  @Post('nin')
  async verifyNIN(@Body() dto: any) {
    return this.valid8.verify('identitypass', 'nin', dto);
  }
}
```

## 4. Decorator Usage

```typescript
import { Verify } from 'porkate-valid8-nest';

@Post('nin')
@Verify('identitypass', 'nin')
async verifyNIN(@Body() dto: any) {
  // ...
}
```

---

See the [NestJS package README](../packages/nest/README.md) for more details and advanced usage.