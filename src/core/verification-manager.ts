import { IVerificationAdapter } from '../interfaces/verification-adapter.interface';
import {
  VerificationConfigurationException,
  AdapterNotFoundException,
} from '../exceptions';
import {
  AdapterConfig,
  AdapterEnvConfig,
  AdapterFactory,
  VerificationManagerConfig,
} from '../interfaces/manager-config.interface';

export class VerificationManager<TConfig = AdapterEnvConfig> {
  private readonly adapters: Map<string, IVerificationAdapter> = new Map();
  private readonly factories: Map<string, AdapterFactory> = new Map();
  private readonly adapterConfigs: Map<string, AdapterConfig<TConfig>> = new Map();
  private defaultAdapter?: string;
  private enableFallback: boolean = false;

  constructor(config?: VerificationManagerConfig<TConfig>) {
    if (config) {
      this.defaultAdapter = config.defaultAdapter;
      this.enableFallback = config.enableFallback ?? false;

      config.adapters.forEach((adapterConfig) => {
        this.adapterConfigs.set(adapterConfig.name, adapterConfig);
      });
    }
  }

  registerFactory<T extends TConfig>(name: string, factory: AdapterFactory<T>): this {
    this.factories.set(name.toLowerCase(), factory as AdapterFactory<AdapterEnvConfig>);

    const config = this.adapterConfigs.get(name.toLowerCase());
    if (config && config.enabled !== false) {
      try {
        const adapter = factory(config.config as T);
        this.adapters.set(name.toLowerCase(), adapter);
      } catch (error) {
        console.error(`Failed to initialize adapter '${name}':`, error);
      }
    }

    return this;
  }

  registerAdapter(name: string, adapter: IVerificationAdapter): this {
    this.adapters.set(name.toLowerCase(), adapter);
    return this;
  }

  getAdapter(name: string): IVerificationAdapter {
    const adapter = this.adapters.get(name.toLowerCase());

    if (!adapter) {
      throw new AdapterNotFoundException(
        `Verification adapter '${name}' is not registered or enabled`,
        {
          adapterName: name,
          availableAdapters: Array.from(this.adapters.keys()),
        },
      );
    }

    if (!adapter.isReady()) {
      throw new VerificationConfigurationException(
        `Verification adapter '${name}' is not ready. Please check configuration.`,
        { adapterName: name },
      );
    }

    return adapter;
  }

  getDefaultAdapter(): IVerificationAdapter {
    if (!this.defaultAdapter) {
      const firstAdapter = this.adapters.values().next().value;
      if (firstAdapter) {
        return firstAdapter;
      }

      throw new VerificationConfigurationException(
        'No default adapter configured and no adapters available',
        { availableAdapters: Array.from(this.adapters.keys()) },
      );
    }

    return this.getAdapter(this.defaultAdapter);
  }

  getAdapterWithFallback(preferredAdapter?: string): IVerificationAdapter | null {
    if (preferredAdapter) {
      try {
        const adapter = this.getAdapter(preferredAdapter);
        if (adapter.isReady()) return adapter;
      } catch (error) {
        if (!this.enableFallback) throw error;
        console.warn(`Preferred adapter '${preferredAdapter}' not available, trying fallback`);
      }
    }

    if (this.defaultAdapter && (!preferredAdapter || preferredAdapter !== this.defaultAdapter)) {
      try {
        const adapter = this.getAdapter(this.defaultAdapter);
        if (adapter.isReady()) return adapter;
      } catch (error) {
        if (!this.enableFallback) throw error;
        console.warn(`Default adapter '${this.defaultAdapter}' not available, trying fallback`);
      }
    }

    if (this.enableFallback) {
      const sortedAdapters = this.getSortedAdapters();
      for (const [name, adapter] of sortedAdapters) {
        if (adapter.isReady() && name !== preferredAdapter && name !== this.defaultAdapter) {
          console.warn(`Using fallback adapter: ${name}`);
          return adapter;
        }
      }
    }

    return null;
  }

  getAvailableAdapters(): string[] {
    return Array.from(this.adapters.keys());
  }

  getReadyAdapters(): string[] {
    return Array.from(this.adapters.entries())
      .filter(([, adapter]) => adapter.isReady())
      .map(([name]) => name);
  }

  hasAdapter(name: string): boolean {
    return this.adapters.has(name.toLowerCase());
  }

  isAdapterReady(name: string): boolean {
    const adapter = this.adapters.get(name.toLowerCase());
    return adapter ? adapter.isReady() : false;
  }

  setDefaultAdapter(name: string): this {
    if (!this.hasAdapter(name)) {
      throw new VerificationConfigurationException(
        `Cannot set '${name}' as default adapter. Adapter not registered.`,
        {
          adapterName: name,
          availableAdapters: this.getAvailableAdapters(),
        },
      );
    }

    this.defaultAdapter = name.toLowerCase();
    return this;
  }

  setFallbackEnabled(enabled: boolean): this {
    this.enableFallback = enabled;
    return this;
  }

  removeAdapter(name: string): this {
    this.adapters.delete(name.toLowerCase());
    this.factories.delete(name.toLowerCase());
    this.adapterConfigs.delete(name.toLowerCase());

    if (this.defaultAdapter === name.toLowerCase()) {
      this.defaultAdapter = undefined;
    }

    return this;
  }

  clear(): this {
    this.adapters.clear();
    this.factories.clear();
    this.adapterConfigs.clear();
    this.defaultAdapter = undefined;
    return this;
  }

  private getSortedAdapters(): Array<[string, IVerificationAdapter]> {
    return Array.from(this.adapters.entries()).sort((a, b) => {
      const configA = this.adapterConfigs.get(a[0]);
      const configB = this.adapterConfigs.get(b[0]);
      const priorityA = configA?.priority ?? 0;
      const priorityB = configB?.priority ?? 0;
      return priorityB - priorityA;
    });
  }
}
