import { ININVerificationService } from './verification-services/nin-verification.interface';
import { IBVNVerificationService } from './verification-services/bvn-verification.interface';
import { ICACVerificationService } from './verification-services/cac-verification.interface';
import { IDriversLicenseVerificationService } from './verification-services/drivers-license-verification.interface';
import { IPassportVerificationService } from './verification-services/passport-verification.interface';
import { IPhoneVerificationService } from './verification-services/phone-verification.interface';
import { IBankAccountVerificationService } from './verification-services/bank-account-verification.interface';
import { IVehicleVerificationService } from './verification-services/vehicle-verification.interface';
import { ITaxVerificationService } from './verification-services/tax-verification.interface';
import { IVotersCardVerificationService } from './verification-services/voters-card-verification.interface';
import { ICreditBureauVerificationService } from './verification-services/credit-bureau-verification.interface';
import { IOtherVerificationService } from './verification-services/other-verification.interface';

/**
 * Composite verification adapter interface
 * Adapters can implement any combination of these specialized services
 * Unsupported methods should throw NotImplementedException
 */
export interface ICompositeVerificationAdapter {
  /**
   * Get the adapter name/provider
   */
  getName(): string;
  
  /**
   * Check if the adapter is ready and configured
   */
  isReady(): boolean;
  
  /**
   * Get NIN verification service if supported
   */
  getNINService?(): ININVerificationService | null;
  
  /**
   * Get BVN verification service if supported
   */
  getBVNService?(): IBVNVerificationService | null;
  
  /**
   * Get CAC verification service if supported
   */
  getCACService?(): ICACVerificationService | null;
  
  /**
   * Get Driver's License verification service if supported
   */
  getDriversLicenseService?(): IDriversLicenseVerificationService | null;
  
  /**
   * Get Passport verification service if supported
   */
  getPassportService?(): IPassportVerificationService | null;
  
  /**
   * Get Phone verification service if supported
   */
  getPhoneService?(): IPhoneVerificationService | null;
  
  /**
   * Get Bank Account verification service if supported
   */
  getBankAccountService?(): IBankAccountVerificationService | null;
  
  /**
   * Get Vehicle verification service if supported
   */
  getVehicleService?(): IVehicleVerificationService | null;
  
  /**
   * Get Tax verification service if supported
   */
  getTaxService?(): ITaxVerificationService | null;
  
  /**
   * Get Voters Card verification service if supported
   */
  getVotersCardService?(): IVotersCardVerificationService | null;
  
  /**
   * Get Credit Bureau verification service if supported
   */
  getCreditBureauService?(): ICreditBureauVerificationService | null;
  
  /**
   * Get Other verification services if supported
   */
  getOtherService?(): IOtherVerificationService | null;
}
