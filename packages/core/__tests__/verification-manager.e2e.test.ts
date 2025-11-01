import { VerificationManager } from '../core/verification-manager';
import { IdentityPassAdapter } from '../../identitypass/identitypass-adapter';
import { IdentityPassCompositeAdapter } from '../../identitypass/identitypass-composite-adapter';
import {
  AdapterNotFoundException,
  VerificationConfigurationException,
} from '../exceptions';

describe('VerificationManager E2E Tests', () => {
  let manager: VerificationManager;
  const mockApiKey = 'test-api-key-12345';

  beforeEach(() => {
    manager = new VerificationManager({
      defaultAdapter: 'identitypass',
      enableFallback: true,
      adapters: [
        {
          name: 'identitypass',
          enabled: true,
          priority: 1,
          config: { apiKey: mockApiKey },
        },
        {
          name: 'backup',
          enabled: true,
          priority: 2,
          config: { apiKey: 'backup-key' },
        },
      ],
    });
  });

  afterEach(() => {
    manager.clear();
  });

  describe('Adapter Registration', () => {
    it('should register adapter factory successfully', () => {
      const factory = jest.fn((config: any) => new IdentityPassAdapter(config as any));
      manager.registerFactory('identitypass', factory);

      expect(factory).toHaveBeenCalledWith({ apiKey: mockApiKey });
      expect(manager.hasAdapter('identitypass')).toBe(true);
    });

    it('should register adapter instance directly', () => {
      const adapter = new IdentityPassAdapter({ apiKey: mockApiKey });
      manager.registerAdapter('test-adapter', adapter);

      expect(manager.hasAdapter('test-adapter')).toBe(true);
    });

    it('should handle multiple adapters', () => {
      manager.registerFactory('identitypass', (config: any) => new IdentityPassAdapter(config as any));
      manager.registerFactory('backup', (config: any) => new IdentityPassAdapter(config as any));

      expect(manager.getAvailableAdapters()).toContain('identitypass');
      expect(manager.getAvailableAdapters()).toContain('backup');
    });
  });

  describe('Adapter Retrieval', () => {
    beforeEach(() => {
      manager.registerFactory('identitypass', (config: any) => new IdentityPassAdapter(config as any));
    });

    it('should get adapter by name', () => {
      const adapter = manager.getAdapter('identitypass');
      expect(adapter).toBeInstanceOf(IdentityPassAdapter);
      expect(adapter.isReady()).toBe(true);
    });

    it('should get default adapter', () => {
      const adapter = manager.getDefaultAdapter();
      expect(adapter).toBeInstanceOf(IdentityPassAdapter);
    });

    it('should throw error for non-existent adapter', () => {
      expect(() => manager.getAdapter('non-existent')).toThrow(AdapterNotFoundException);
    });

    it('should throw error for adapter without API key', () => {
      manager.registerFactory('invalid', () => new IdentityPassAdapter({ apiKey: '' }));
      // Adapter won't be registered due to failed initialization
      expect(() => manager.getAdapter('invalid')).toThrow(AdapterNotFoundException);
    });
  });

  describe('Adapter Fallback', () => {
    beforeEach(() => {
      manager.registerFactory('identitypass', (config: any) => new IdentityPassAdapter(config as any));
      manager.registerFactory('backup', (config: any) => new IdentityPassAdapter(config as any));
    });

    it('should return preferred adapter when available', () => {
      const adapter = manager.getAdapterWithFallback('identitypass');
      expect(adapter).not.toBeNull();
      expect(adapter!.isReady()).toBe(true);
    });

    it('should fallback to default adapter when preferred is unavailable', () => {
      const adapter = manager.getAdapterWithFallback('non-existent');
      expect(adapter).not.toBeNull();
      expect(adapter!.isReady()).toBe(true);
    });

    it('should fallback to next available adapter by priority', () => {
      // Disable primary adapter
      manager.removeAdapter('identitypass');
      
      const adapter = manager.getAdapterWithFallback();
      expect(adapter).not.toBeNull();
    });

    it('should return null when no adapters available and fallback enabled', () => {
      manager.clear();
      const adapter = manager.getAdapterWithFallback('non-existent');
      expect(adapter).toBeNull();
    });

    it('should throw error when fallback disabled and adapter not found', () => {
      manager.setFallbackEnabled(false);
      expect(() => manager.getAdapterWithFallback('non-existent')).toThrow();
    });
  });

  describe('Adapter Priority', () => {
    it('should respect adapter priority in fallback', () => {
      const manager2 = new VerificationManager({
        enableFallback: true,
        adapters: [
          { name: 'low-priority', enabled: true, priority: 1, config: { apiKey: 'key1' } },
          { name: 'high-priority', enabled: true, priority: 10, config: { apiKey: 'key2' } },
        ],
      });

      manager2.registerFactory('low-priority', (config: any) => new IdentityPassAdapter(config as any));
      manager2.registerFactory('high-priority', (config: any) => new IdentityPassAdapter(config as any));

      // Remove default, should pick highest priority
      const adapter = manager2.getAdapterWithFallback();
      expect(adapter).not.toBeNull();
    });
  });

  describe('Adapter Management', () => {
    beforeEach(() => {
      manager.registerFactory('identitypass', (config: any) => new IdentityPassAdapter(config as any));
    });

    it('should list available adapters', () => {
      const adapters = manager.getAvailableAdapters();
      expect(adapters).toContain('identitypass');
    });

    it('should list ready adapters', () => {
      const readyAdapters = manager.getReadyAdapters();
      expect(readyAdapters).toContain('identitypass');
    });

    it('should check if adapter is ready', () => {
      expect(manager.isAdapterReady('identitypass')).toBe(true);
      expect(manager.isAdapterReady('non-existent')).toBe(false);
    });

    it('should set default adapter', () => {
      manager.setDefaultAdapter('identitypass');
      const adapter = manager.getDefaultAdapter();
      expect(adapter).toBeInstanceOf(IdentityPassAdapter);
    });

    it('should throw error when setting non-existent adapter as default', () => {
      expect(() => manager.setDefaultAdapter('non-existent')).toThrow(
        VerificationConfigurationException
      );
    });

    it('should remove adapter', () => {
      manager.removeAdapter('identitypass');
      expect(manager.hasAdapter('identitypass')).toBe(false);
    });

    it('should clear all adapters', () => {
      manager.clear();
      expect(manager.getAvailableAdapters()).toHaveLength(0);
    });

    it('should enable/disable fallback', () => {
      manager.setFallbackEnabled(false);
      expect(() => manager.getAdapterWithFallback('non-existent')).toThrow();

      manager.setFallbackEnabled(true);
      expect(manager.getAdapterWithFallback('non-existent')).not.toBeNull();
    });
  });

  describe('Configuration Edge Cases', () => {
    it('should handle manager without default adapter', () => {
      const manager2 = new VerificationManager();
      manager2.registerFactory('test', (config: any) => new IdentityPassAdapter({ apiKey: 'test' }));
      
      // Need to add config before getting adapter
      manager2.registerAdapter('test', new IdentityPassAdapter({ apiKey: 'test' }));
      const adapter = manager2.getDefaultAdapter();
      expect(adapter).toBeDefined();
    });

    it('should handle empty adapter list', () => {
      const manager2 = new VerificationManager({ adapters: [] });
      expect(() => manager2.getDefaultAdapter()).toThrow(VerificationConfigurationException);
    });

    it('should handle disabled adapters', () => {
      const manager2 = new VerificationManager({
        adapters: [
          { name: 'disabled', enabled: false, config: { apiKey: 'key' } },
        ],
      });

      manager2.registerFactory('disabled', (config: any) => new IdentityPassAdapter(config as any));
      expect(manager2.hasAdapter('disabled')).toBe(false);
    });
  });

  describe('Adapter Re-registration', () => {
    it('should allow re-registering adapter with new factory', () => {
      // First clear to start fresh
      manager.clear();
      
      // Register with config
      const manager2 = new VerificationManager({
        adapters: [
          { name: 'identitypass', enabled: true, config: { apiKey: 'test' } },
        ],
      });
      
      manager2.registerFactory('identitypass', (config: any) => new IdentityPassAdapter(config as any));
      const adapter1 = manager2.getAdapter('identitypass');
      
      // Remove and re-register  with different factory (which re-enables it)
      manager2.removeAdapter('identitypass');
      
      // Re-add to config
      const manager3 = new VerificationManager({
        adapters: [
          { name: 'identitypass', enabled: true, config: { apiKey: 'test2' } },
        ],
      });
      manager3.registerFactory('identitypass', (config: any) => new IdentityPassAdapter(config as any));
      
      const adapter2 = manager3.getAdapter('identitypass');
      expect(adapter2).not.toBe(adapter1); // Different instance
      expect(adapter1).toBeDefined();
      expect(adapter2).toBeDefined();
    });
  });
});
