import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Valid8Module } from '@porkate/valid8-nest';
import { IdentityPassCompositeAdapter } from '@porkate/valid8-identitypass';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configure Valid8 with IdentityPass adapter
    Valid8Module.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('IDENTITY_PASS_API_KEY');
        
        if (!apiKey) {
          throw new Error('IDENTITY_PASS_API_KEY is not set in environment variables');
        }

        return {
          config: {
            defaultAdapter: 'identitypass',
            enableFallback: false,
            adapters: [
              {
                name: 'identitypass',
                enabled: true,
                priority: 1,
                config: {
                  apiKey,
                  baseUrl: configService.get<string>('IDENTITY_PASS_BASE_URL', 'https://api.myidentitypass.com'),
                  timeout: configService.get<number>('IDENTITY_PASS_TIMEOUT', 30000),
                },
              },
            ],
          },
          factories: {
            identitypass: (config) => new IdentityPassCompositeAdapter(config),
          },
        };
      },
      inject: [ConfigService],
    }),
    
    VerificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
