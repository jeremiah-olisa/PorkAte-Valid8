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
import { IdentityPassCACService } from './services/cac-verification.service';
import { IdentityPassVehicleService } from './services/vehicle-verification.service';
import { IdentityPassDriversLicenseService } from './services/drivers-license-verification.service';
import { IdentityPassPassportService } from './services/passport-verification.service';
import { IdentityPassPhoneService } from './services/phone-verification.service';
import { IdentityPassBankAccountService } from './services/bank-account-verification.service';
import { IdentityPassCreditBureauService } from './services/credit-bureau-verification.service';
import { IdentityPassTaxService } from './services/tax-verification.service';
import { IdentityPassVotersCardService } from './services/voters-card-verification.service';
import { IdentityPassOtherService } from './services/other-verification.service';

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
  private cacService?: IdentityPassCACService;
  private vehicleService?: IdentityPassVehicleService;
  private driversLicenseService?: IdentityPassDriversLicenseService;
  private passportService?: IdentityPassPassportService;
  private phoneService?: IdentityPassPhoneService;
  private bankAccountService?: IdentityPassBankAccountService;
  private creditBureauService?: IdentityPassCreditBureauService;
  private taxService?: IdentityPassTaxService;
  private votersCardService?: IdentityPassVotersCardService;
  private otherService?: IdentityPassOtherService;

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

  getName(): string {
    return this.providerName;
  }

  isReady(): boolean {
    return !!this.config.apiKey && !!this.config.appId;
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

  getCACService(): ICACVerificationService {
    if (!this.cacService) {
      this.cacService = new IdentityPassCACService(this.client, this.providerName);
    }
    return this.cacService;
  }

  getDriversLicenseService(): IDriversLicenseVerificationService {
    if (!this.driversLicenseService) {
      this.driversLicenseService = new IdentityPassDriversLicenseService(this.client, this.providerName);
    }
    return this.driversLicenseService;
  }

  getPassportService(): IPassportVerificationService {
    if (!this.passportService) {
      this.passportService = new IdentityPassPassportService(this.client, this.providerName);
    }
    return this.passportService;
  }

  getPhoneService(): IPhoneVerificationService {
    if (!this.phoneService) {
      this.phoneService = new IdentityPassPhoneService(this.client, this.providerName);
    }
    return this.phoneService;
  }

  getBankAccountService(): IBankAccountVerificationService {
    if (!this.bankAccountService) {
      this.bankAccountService = new IdentityPassBankAccountService(this.client, this.providerName);
    }
    return this.bankAccountService;
  }

  getVehicleService(): IVehicleVerificationService {
    if (!this.vehicleService) {
      this.vehicleService = new IdentityPassVehicleService(this.client, this.providerName);
    }
    return this.vehicleService;
  }

  getTaxService(): ITaxVerificationService {
    if (!this.taxService) {
      this.taxService = new IdentityPassTaxService(this.client, this.providerName);
    }
    return this.taxService;
  }

  getVotersCardService(): IVotersCardVerificationService {
    if (!this.votersCardService) {
      this.votersCardService = new IdentityPassVotersCardService(this.client, this.providerName);
    }
    return this.votersCardService;
  }

  getCreditBureauService(): ICreditBureauVerificationService {
    if (!this.creditBureauService) {
      this.creditBureauService = new IdentityPassCreditBureauService(this.client, this.providerName);
    }
    return this.creditBureauService;
  }

  getOtherService(): IOtherVerificationService {
    if (!this.otherService) {
      this.otherService = new IdentityPassOtherService(this.client, this.providerName);
    }
    return this.otherService;
  }
}
