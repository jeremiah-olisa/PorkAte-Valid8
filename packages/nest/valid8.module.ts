import { DynamicModule, Module, Provider } from '@nestjs/common';
import { VerificationManager, VerificationManagerConfig } from 'porkate-valid8';
import { Valid8Service } from './valid8.service';

export interface Valid8ModuleOptions {
  config: VerificationManagerConfig;
  factories?: Record<string, (config: any) => any>;
}

@Module({})
export class Valid8Module {
  static forRoot(options: Valid8ModuleOptions): DynamicModule {
    const verificationManagerProvider: Provider = {
      provide: VerificationManager,
      useFactory: () => {
        const manager = new VerificationManager(options.config);
        
        // Register any provided adapter factories
        if (options.factories) {
          Object.entries(options.factories).forEach(([name, factory]) => {
            manager.registerFactory(name, factory);
          });
        }
        
        return manager;
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
    useFactory: (...args: any[]) => Promise<Valid8ModuleOptions> | Valid8ModuleOptions;
    inject?: any[];
  }): DynamicModule {
    const verificationManagerProvider: Provider = {
      provide: VerificationManager,
      useFactory: async (...args: any[]) => {
        const moduleOptions = await options.useFactory(...args);
        const manager = new VerificationManager(moduleOptions.config);
        
        // Register any provided adapter factories
        if (moduleOptions.factories) {
          Object.entries(moduleOptions.factories).forEach(([name, factory]) => {
            manager.registerFactory(name, factory);
          });
        }
        
        return manager;
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
