import { VerificationResponse, TINVerificationRequest as BaseTINVerificationRequest } from '../verification-adapter.interface';

// Re-export the base type
export type TINVerificationRequest = BaseTINVerificationRequest;

// Stamp duty verification request
export interface StampDutyVerificationRequest {
  referenceNumber: string;
}

// Standard tax verification data structure
export interface TaxVerificationData {
  tin?: string;
  taxpayerName?: string;
  taxpayerType?: string;
  status?: string;
  registrationDate?: string;
  address?: string;
  taxOffice?: string;
  [key: string]: any;
}

// Stamp duty verification data structure
export interface StampDutyVerificationData {
  referenceNumber: string;
  amount: number;
  status: string;
  dateIssued?: string;
  description?: string;
  [key: string]: any;
}

/**
 * Interface for Tax verification services (TIN, Stamp Duty)
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface ITaxVerificationService {
  /**
   * TIN (Tax Identification Number) verification - REQUIRED
   */
  verifyTIN(data: TINVerificationRequest): Promise<VerificationResponse<TaxVerificationData>>;
  
  /**
   * Stamp duty verification - OPTIONAL
   */
  verifyStampDuty?(data: StampDutyVerificationRequest): Promise<VerificationResponse<StampDutyVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
