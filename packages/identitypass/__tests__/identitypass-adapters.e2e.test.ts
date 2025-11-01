import { IdentityPassAdapter } from '../identitypass-adapter';
import { IdentityPassCompositeAdapter } from '../identitypass-composite-adapter';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IdentityPass Adapters E2E Tests', () => {
  const mockApiKey = 'test-api-key-123';
  const mockConfig = {
    apiKey: mockApiKey,
    baseUrl: 'https://api.myidentitypass.com',
    timeout: 30000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockedAxios as any);
  });

  describe('IdentityPassAdapter (Legacy)', () => {
    let adapter: IdentityPassAdapter;

    beforeEach(() => {
      adapter = new IdentityPassAdapter(mockConfig);
    });

    describe('Configuration', () => {
      it('should initialize with provided config', () => {
        expect(adapter.isReady()).toBe(true);
      });

      it('should not be ready without API key', () => {
        const adapterWithoutKey = new IdentityPassAdapter({ apiKey: '' });
        expect(adapterWithoutKey.isReady()).toBe(false);
      });

      it('should use default configuration values', () => {
        const adapter2 = new IdentityPassAdapter({ apiKey: mockApiKey });
        expect(adapter2.isReady()).toBe(true);
      });
    });

    describe('NIN Verification', () => {
      it('should verify NIN successfully', async () => {
        const mockResponse = {
          data: {
            status: true,
            detail: 'Verification successful',
            response_code: '00',
            verification: {
              status: true,
              nin: '12345678901',
              firstname: 'John',
              lastname: 'Doe',
              birthdate: '1990-01-01',
              gender: 'Male',
            },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await adapter.verifyNIN({
          nin: '12345678901',
          firstName: 'John',
          lastName: 'Doe',
        });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.meta).toBeDefined();
        expect(result.meta).toEqual(mockResponse.data);
        expect(result.provider).toBe('identitypass');
      });

      it('should handle verification failure', async () => {
        const mockResponse = {
          data: {
            status: false,
            detail: 'Verification failed',
            response_code: '01',
            verification: null,
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await adapter.verifyNIN({
          nin: '00000000000',
        });

        expect(result.success).toBe(false);
        expect(result.meta).toEqual(mockResponse.data);
      });

      it('should handle network errors', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

        const result = await adapter.verifyNIN({
          nin: '12345678901',
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe('Network error');
      });
    });

    describe('BVN Verification', () => {
      it('should verify BVN successfully', async () => {
        const mockResponse = {
          data: {
            status: true,
            detail: 'Verification successful',
            response_code: '00',
            verification: {
              status: true,
              bvn: '12345678901',
              first_name: 'John',
              last_name: 'Doe',
              date_of_birth: '1990-01-01',
            },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await adapter.verifyBVN({
          bvn: '12345678901',
        });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.meta).toEqual(mockResponse.data);
      });
    });

    describe('Other Verifications', () => {
      it('should verify voter card', async () => {
        const mockResponse = {
          data: {
            status: true,
            detail: 'Verification successful',
            verification: { status: true, vin: 'VIN123' },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await adapter.verifyVotersCard({ vin: 'VIN123' });
        expect(result.success).toBe(true);
      });

      it('should verify passport', async () => {
        const mockResponse = {
          data: {
            status: true,
            detail: 'Verification successful',
            verification: { status: true, passportNumber: 'A12345678' },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await adapter.verifyPassport({ passportNumber: 'A12345678' });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('IdentityPassCompositeAdapter (Modern)', () => {
    let adapter: IdentityPassCompositeAdapter;

    beforeEach(() => {
      adapter = new IdentityPassCompositeAdapter(mockConfig);
    });

    describe('Configuration', () => {
      it('should initialize successfully', () => {
        expect(adapter.getName()).toBe('identitypass');
        expect(adapter.isReady()).toBe(true);
      });

      it('should not be ready without API key', () => {
        const adapter2 = new IdentityPassCompositeAdapter({ apiKey: '' });
        expect(adapter2.isReady()).toBe(false);
      });
    });

    describe('Service Getters', () => {
      it('should provide NIN service', () => {
        const ninService = adapter.getNINService();
        expect(ninService).toBeDefined();
        expect(ninService!.isReady()).toBe(true);
      });

      it('should provide BVN service', () => {
        const bvnService = adapter.getBVNService();
        expect(bvnService).toBeDefined();
        expect(bvnService!.isReady()).toBe(true);
      });

      it('should provide all supported services', () => {
        expect(adapter.getCACService()).toBeDefined();
        expect(adapter.getDriversLicenseService()).toBeDefined();
        expect(adapter.getPassportService()).toBeDefined();
        expect(adapter.getPhoneService()).toBeDefined();
        expect(adapter.getBankAccountService()).toBeDefined();
        expect(adapter.getVehicleService()).toBeDefined();
        expect(adapter.getTaxService()).toBeDefined();
        expect(adapter.getVotersCardService()).toBeDefined();
        expect(adapter.getCreditBureauService()).toBeDefined();
        expect(adapter.getOtherService()).toBeDefined();
      });
    });

    describe('NIN Service', () => {
      it('should verify NIN successfully', async () => {
        const mockResponse = {
          data: {
            status: true,
            detail: 'Success',
            verification: {
              status: true,
              nin: '12345678901',
              firstname: 'John',
              lastname: 'Doe',
              birthdate: '1990-01-01',
              gender: 'Male',
            },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const ninService = adapter.getNINService();
        const result = await ninService!.verifyNIN({
          nin: '12345678901',
          firstName: 'John',
          lastName: 'Doe',
        });

        expect(result.success).toBe(true);
        expect(result.data?.nin).toBe('12345678901');
        expect(result.data?.firstName).toBe('John');
        expect(result.meta).toEqual(mockResponse.data);
      });

      it('should verify NIN with face', async () => {
        const mockResponse = {
          data: {
            status: true,
            detail: 'Success',
            verification: {
              status: true,
              nin: '12345678901',
              firstname: 'John',
              lastname: 'Doe',
              face_match: true,
            },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const ninService = adapter.getNINService();
        const result = await ninService!.verifyNINWithFace!({
          nin: '12345678901',
          firstName: 'John',
          lastName: 'Doe',
          image: 'base64-image-data',
        });

        expect(result.success).toBe(true);
      });

      it('should verify NIN slip', async () => {
        const mockResponse = {
          data: {
            status: true,
            detail: 'Success',
            verification: {
              status: true,
              nin: '12345678901',
              slip_number: 'SLIP123',
            },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const ninService = adapter.getNINService();
        const result = await ninService!.verifyNINSlip!({
          nin: '12345678901',
          slipNumber: 'SLIP123',
        });

        expect(result.success).toBe(true);
      });

      it('should verify virtual NIN', async () => {
        const mockResponse = {
          data: {
            status: true,
            detail: 'Success',
            verification: {
              status: true,
              virtual_nin: 'VNIN123',
              firstname: 'John',
            },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const ninService = adapter.getNINService();
        const result = await ninService!.verifyVirtualNIN!({
          virtualNin: 'VNIN123',
          firstName: 'John',
          lastName: 'Doe',
        });

        expect(result.success).toBe(true);
      });
    });

    describe('BVN Service', () => {
      it('should verify BVN successfully', async () => {
        const mockResponse = {
          data: {
            status: true,
            detail: 'Success',
            verification: {
              status: true,
              bvn: '12345678901',
              first_name: 'John',
              last_name: 'Doe',
            },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const bvnService = adapter.getBVNService();
        const result = await bvnService!.verifyBVN({
          bvn: '12345678901',
        });

        expect(result.success).toBe(true);
        expect(result.data?.bvn).toBe('12345678901');
        expect(result.meta).toEqual(mockResponse.data);
      });

      it('should verify BVN advance', async () => {
        const mockResponse = {
          data: {
            status: true,
            verification: {
              status: true,
              bvn: '12345678901',
              history: [],
            },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const bvnService = adapter.getBVNService();
        const result = await bvnService!.verifyBVNAdvance!({
          bvn: '12345678901',
          includeHistory: true,
        });

        expect(result.success).toBe(true);
      });

      it('should verify BVN with face', async () => {
        const mockResponse = {
          data: {
            status: true,
            verification: {
              status: true,
              bvn: '12345678901',
              face_match: true,
            },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const bvnService = adapter.getBVNService();
        const result = await bvnService!.verifyBVNWithFace!({
          bvn: '12345678901',
          image: 'base64-image',
        });

        expect(result.success).toBe(true);
      });

      it('should get BVN by phone number', async () => {
        const mockResponse = {
          data: {
            status: true,
            verification: {
              status: true,
              bvn: '12345678901',
              phone_number: '+2348012345678',
            },
          },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const bvnService = adapter.getBVNService();
        const result = await bvnService!.getBVNByPhoneNumber!({
          phoneNumber: '+2348012345678',
        });

        expect(result.success).toBe(true);
      });
    });

    describe('Error Handling', () => {
      it('should handle API errors gracefully', async () => {
        const error = new Error('Request failed');
        (error as any).response = {
          data: {
            status: false,
            detail: 'Invalid API key',
          },
        };
        mockedAxios.post.mockRejectedValueOnce(error);

        const ninService = adapter.getNINService();
        const result = await ninService!.verifyNIN({
          nin: '12345678901',
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe('Request failed');
        expect(result.meta).toBeDefined();
      });

      it('should handle network timeouts', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Timeout'));

        const ninService = adapter.getNINService();
        const result = await ninService!.verifyNIN({
          nin: '12345678901',
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe('Timeout');
      });
    });

    describe('Service Reuse', () => {
      it('should reuse service instances', () => {
        const ninService1 = adapter.getNINService();
        const ninService2 = adapter.getNINService();
        expect(ninService1).toBe(ninService2);
      });

      it('should reuse BVN service instances', () => {
        const bvnService1 = adapter.getBVNService();
        const bvnService2 = adapter.getBVNService();
        expect(bvnService1).toBe(bvnService2);
      });
    });
  });

  describe('Adapter Comparison', () => {
    it('should have compatible interfaces between legacy and modern', async () => {
      const legacyAdapter = new IdentityPassAdapter(mockConfig);
      const modernAdapter = new IdentityPassCompositeAdapter(mockConfig);

      expect(legacyAdapter.isReady()).toBe(modernAdapter.isReady());

      const mockResponse = {
        data: {
          status: true,
          verification: { status: true, nin: '12345678901' },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      // Both should handle NIN verification
      const legacyResult = await legacyAdapter.verifyNIN({ nin: '12345678901' });
      const ninService = modernAdapter.getNINService();
      const modernResult = await ninService!.verifyNIN({ nin: '12345678901' });

      expect(legacyResult.success).toBe(modernResult.success);
      expect(legacyResult.provider).toBe(modernResult.provider);
    });
  });
});
