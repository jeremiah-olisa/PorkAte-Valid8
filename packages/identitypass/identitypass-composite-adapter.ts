import axios, { AxiosInstance } from 'axios';
import {
  ICompositeVerificationAdapter,
  ININVerificationService,
  IBVNVerificationService,
  ICACVerificationService,
  IDriversLicenseVerificationService,
  IPassportVerificationService,
  IPhoneVerificationService,
  IBankAccountVerificationService,
  IVehicleVerificationService,
  ITaxVerificationService,
  IVotersCardVerificationService,
  ICreditBureauVerificationService,
  IOtherVerificationService,
} from '@porkate/valid8';
import { IdentityPassConfig } from './types';
import { IdentityPassNINService } from './services/nin-verification.service';
import { IdentityPassBVNService } from './services/bvn-verification.service';

/**
 * Modern IdentityPass adapter implementing composite verification pattern
 * with specialized services for each verification type
 */
export class IdentityPassCompositeAdapter implements ICompositeVerificationAdapter {
  private readonly client: AxiosInstance;
  private readonly config: IdentityPassConfig;
  private readonly providerName = 'identitypass';

  // Lazy-loaded services
  private ninService?: IdentityPassNINService;
  private bvnService?: IdentityPassBVNService;

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
        'Content-Type': 'application/json',
      },
    });
  }

  getName(): string {
    return this.providerName;
  }

  isReady(): boolean {
    return !!this.config.apiKey;
  }

  getNINService(): ININVerificationService {
    if (!this.ninService) {
      this.ninService = new IdentityPassNINService(this.client, this.providerName);
    }
    return this.ninService;
  }

  getBVNService(): IBVNVerificationService {
    if (!this.bvnService) {
      this.bvnService = new IdentityPassBVNService(this.client, this.providerName);
    }
    return this.bvnService;
  }

  // These methods return null for unsupported services
  // In future implementations, these can be added
  getCACService(): ICACVerificationService | null {
    return null;
  }

  getDriversLicenseService(): IDriversLicenseVerificationService | null {
    return null;
  }

  getPassportService(): IPassportVerificationService | null {
    return null;
  }

  getPhoneService(): IPhoneVerificationService | null {
    return null;
  }

  getBankAccountService(): IBankAccountVerificationService | null {
    return null;
  }

  getVehicleService(): IVehicleVerificationService | null {
    return null;
  }

  getTaxService(): ITaxVerificationService | null {
    return null;
  }

  getVotersCardService(): IVotersCardVerificationService | null {
    return null;
  }

  getCreditBureauService(): ICreditBureauVerificationService | null {
    return null;
  }

  getOtherService(): IOtherVerificationService | null {
    return null;
  }
}
