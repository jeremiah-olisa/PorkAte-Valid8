import { VerificationResponse, CreditBureauVerificationRequest as BaseCreditBureauVerificationRequest } from '../verification-adapter.interface';

// Re-export the base type
export type CreditBureauVerificationRequest = BaseCreditBureauVerificationRequest;

// Consumer credit bureau - basic
export interface CreditBureauConsumerBasicRequest extends CreditBureauVerificationRequest {
  // Basic consumer credit check
}

// Consumer credit bureau - advanced
export interface CreditBureauConsumerAdvanceRequest extends CreditBureauVerificationRequest {
  includeHistory?: boolean;
}

// Commercial credit bureau - basic
export interface CreditBureauCommercialBasicRequest {
  companyName?: string;
  rcNumber?: string;
}

// Commercial credit bureau - advanced
export interface CreditBureauCommercialAdvanceRequest extends CreditBureauCommercialBasicRequest {
  includeHistory?: boolean;
}

// Standard credit bureau verification data structure
export interface CreditBureauVerificationData {
  creditScore?: number;
  creditHistory?: Array<{
    lender: string;
    amount: number;
    status: string;
    date?: string;
    [key: string]: any;
  }>;
  defaultRecords?: Array<{
    lender: string;
    amount: number;
    date?: string;
    [key: string]: any;
  }>;
  activeLoans?: number;
  totalDebt?: number;
  [key: string]: any;
}

/**
 * Interface for Credit Bureau verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface ICreditBureauVerificationService {
  /**
   * Basic credit bureau verification - REQUIRED
   */
  verifyCreditBureau(data: CreditBureauVerificationRequest): Promise<VerificationResponse<CreditBureauVerificationData>>;
  
  /**
   * Consumer credit bureau verification - basic - OPTIONAL
   */
  verifyCreditBureauConsumerBasic?(data: CreditBureauConsumerBasicRequest): Promise<VerificationResponse<CreditBureauVerificationData>>;
  
  /**
   * Consumer credit bureau verification - advanced - OPTIONAL
   */
  verifyCreditBureauConsumerAdvance?(data: CreditBureauConsumerAdvanceRequest): Promise<VerificationResponse<CreditBureauVerificationData>>;
  
  /**
   * Commercial credit bureau verification - basic - OPTIONAL
   */
  verifyCreditBureauCommercialBasic?(data: CreditBureauCommercialBasicRequest): Promise<VerificationResponse<CreditBureauVerificationData>>;
  
  /**
   * Commercial credit bureau verification - advanced - OPTIONAL
   */
  verifyCreditBureauCommercialAdvance?(data: CreditBureauCommercialAdvanceRequest): Promise<VerificationResponse<CreditBureauVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
