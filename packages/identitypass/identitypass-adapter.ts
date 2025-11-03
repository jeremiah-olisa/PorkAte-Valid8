import axios, { AxiosInstance } from 'axios';
import {
  IVerificationAdapter,
  NINVerificationRequest,
  BVNVerificationRequest,
  VotersCardVerificationRequest,
  PassportVerificationRequest,
  TINVerificationRequest,
  VehicleVerificationRequest,
  CACVerificationRequest,
  PhoneVerificationRequest,
  BankAccountVerificationRequest,
  CreditBureauVerificationRequest,
  VerificationResponse,
} from 'porkate-valid8';
import {
  IdentityPassConfig,
  IdentityPassVerificationResponse,
} from './types';

/**
 * IdentityPass adapter for Nigerian verification services
 */
export class IdentityPassAdapter implements IVerificationAdapter {
  private readonly client: AxiosInstance;
  private readonly config: IdentityPassConfig;
  private readonly providerName = 'identitypass';

  constructor(config: IdentityPassConfig) {
    this.config = {
      baseUrl: 'https://api.myidentitypass.com',
      timeout: 30000,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'x-api-key': this.config.apiKey,
        'app-id': this.config.appId,
        'Content-Type': 'application/json',
      },
    });
  }

  async verifyNIN(data: NINVerificationRequest): Promise<VerificationResponse> {
    return this.makeRequest('/api/v2/biometrics/merchant/data/verification/nin', {
      number: data.nin,
      firstname: data.firstName,
      lastname: data.lastName,
      dob: data.dateOfBirth,
    });
  }

  async verifyBVN(data: BVNVerificationRequest): Promise<VerificationResponse> {
    return this.makeRequest('/api/v1/biometrics/merchant/data/verification/bvn', {
      number: data.bvn,
      firstname: data.firstName,
      lastname: data.lastName,
      dob: data.dateOfBirth,
    });
  }

  async verifyVotersCard(data: VotersCardVerificationRequest): Promise<VerificationResponse> {
    return this.makeRequest('/api/v1/biometrics/merchant/data/verification/voter', {
      number: data.vin,
      firstname: data.firstName,
      lastname: data.lastName,
      state: data.state,
    });
  }

  async verifyPassport(data: PassportVerificationRequest): Promise<VerificationResponse> {
    return this.makeRequest('/api/v1/biometrics/merchant/data/verification/passport', {
      number: data.passportNumber,
      firstname: data.firstName,
      lastname: data.lastName,
      dob: data.dateOfBirth,
    });
  }

  async verifyTIN(data: TINVerificationRequest): Promise<VerificationResponse> {
    return this.makeRequest('/api/v1/biometrics/merchant/data/verification/tin', {
      number: data.tin,
      channel: data.channel,
    });
  }

  async verifyVehicle(data: VehicleVerificationRequest): Promise<VerificationResponse> {
    return this.makeRequest('/api/v1/biometrics/merchant/data/verification/vehicle', {
      number: data.plateNumber,
    });
  }

  async verifyCAC(data: CACVerificationRequest): Promise<VerificationResponse> {
    return this.makeRequest('/api/v1/biometrics/merchant/data/verification/cac', {
      rc_number: data.rcNumber,
      bn_number: data.bnNumber,
      company_name: data.companyName,
    });
  }

  async verifyPhoneNumber(data: PhoneVerificationRequest): Promise<VerificationResponse> {
    return this.makeRequest('/api/v1/biometrics/merchant/data/verification/phone_number', {
      number: data.phoneNumber,
    });
  }

  async verifyBankAccount(data: BankAccountVerificationRequest): Promise<VerificationResponse> {
    return this.makeRequest('/api/v1/biometrics/merchant/data/verification/bank_account', {
      account_number: data.accountNumber,
      bank_code: data.bankCode,
    });
  }

  async verifyCreditBureau(data: CreditBureauVerificationRequest): Promise<VerificationResponse> {
    return this.makeRequest('/api/v1/biometrics/merchant/data/verification/credit_bureau', {
      bvn: data.bvn,
      phone_number: data.phoneNumber,
      firstname: data.firstName,
      lastname: data.lastName,
    });
  }

  isReady(): boolean {
    return !!this.config.apiKey && !!this.config.appId;
  }

  private async makeRequest(endpoint: string, payload: any): Promise<VerificationResponse> {
    try {
      const response = await this.client.post<IdentityPassVerificationResponse>(
        endpoint,
        payload
      );

      return this.parseResponse(response.data);
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        provider: this.providerName,
        timestamp: new Date(),
        meta: error.response?.data, // Include error response
      };
    }
  }

  private parseResponse(data: IdentityPassVerificationResponse): VerificationResponse {
    const isSuccess = !!(data.status && data.verification?.status);

    return {
      success: isSuccess,
      data: data.verification,
      message: data.detail,
      provider: this.providerName,
      timestamp: new Date(),
      meta: data, // Include original IdentityPass response
    };
  }
}
