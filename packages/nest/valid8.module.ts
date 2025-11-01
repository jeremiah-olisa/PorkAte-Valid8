import { DynamicModule, Module, Provider } from '@nestjs/common';
import { VerificationManager, VerificationManagerConfig } from '@porkate/valid8';
import { Valid8Service } from './valid8.service';

export interface Valid8ModuleOptions {
  config: VerificationManagerConfig;
}

@Module({})
export class Valid8Module {
  static forRoot(options: Valid8ModuleOptions): DynamicModule {
    const verificationManagerProvider: Provider = {
      provide: VerificationManager,
      useFactory: () => {
        return new VerificationManager(options.config);
      },
    };

    return {
      module: Valid8Module,
      providers: [verificationManagerProvider, Valid8Service],
      exports: [VerificationManager, Valid8Service],
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<VerificationManagerConfig> | VerificationManagerConfig;
    inject?: any[];
  }): DynamicModule {
    const verificationManagerProvider: Provider = {
      provide: VerificationManager,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return new VerificationManager(config);
      },
      inject: options.inject || [],
    };

    return {
      module: Valid8Module,
      providers: [verificationManagerProvider, Valid8Service],
      exports: [VerificationManager, Valid8Service],
      global: true,
    };
  }
}
