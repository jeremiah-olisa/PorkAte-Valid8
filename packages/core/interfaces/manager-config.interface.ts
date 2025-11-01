export interface AdapterConfig<TConfig = AdapterEnvConfig> {
  name: string;
  config: TConfig;
  enabled?: boolean;
  priority?: number;
}

export interface AdapterEnvConfig {
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  timeout?: number;
  [key: string]: any;
}

export interface VerificationManagerConfig<TConfig = AdapterEnvConfig> {
  defaultAdapter?: string;
  enableFallback?: boolean;
  adapters: AdapterConfig<TConfig>[];
}

export type AdapterFactory<TConfig = AdapterEnvConfig> = (
  config: TConfig,
) => import('./verification-adapter.interface').IVerificationAdapter;

export * from './verification-adapter.interface';
export * from './verification-service.interface';
