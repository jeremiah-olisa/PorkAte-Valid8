import { AxiosInstance } from 'axios';
import { VerificationResponse } from '@porkate/valid8';
import { IdentityPassVerificationResponse } from '../types';

/**
 * Base service for IdentityPass verification services
 * Provides common functionality for making requests and parsing responses
 */
export abstract class BaseIdentityPassService {
  protected readonly client: AxiosInstance;
  protected readonly providerName: string;

  constructor(client: AxiosInstance, providerName: string) {
    this.client = client;
    this.providerName = providerName;
  }

  isReady(): boolean {
    return !!this.client;
  }

  /**
   * Make a request to IdentityPass API
   * @param endpoint API endpoint
   * @param payload Request payload
   * @param mapData Function to map verification data to the expected format
   */
  protected async makeRequest<T>(
    endpoint: string,
    payload: any,
    mapData?: (verificationData: any, payload: any) => T
  ): Promise<VerificationResponse<T>> {
    try {
      const response = await this.client.post<IdentityPassVerificationResponse>(endpoint, payload);

      const isSuccess = !!(response.data.status && response.data.verification?.status);
      const verificationData = response.data.verification;

      let data: T | undefined = undefined;
      if (verificationData && mapData) {
        data = mapData(verificationData, payload);
      } else if (verificationData) {
        data = verificationData as T;
      }

      return {
        success: isSuccess,
        data,
        message: response.data.detail,
        provider: this.providerName,
        timestamp: new Date(),
        meta: response.data, // Include original response
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        provider: this.providerName,
        timestamp: new Date(),
        meta: error.response?.data,
      };
    }
  }
}
