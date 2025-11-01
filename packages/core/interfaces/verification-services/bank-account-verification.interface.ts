import { VerificationResponse, BankAccountVerificationRequest as BaseBankAccountVerificationRequest } from '../verification-adapter.interface';

// Re-export the base type
export type BankAccountVerificationRequest = BaseBankAccountVerificationRequest;

// Advanced bank account verification
export interface BankAccountAdvanceVerificationRequest extends BankAccountVerificationRequest {
  includeBalance?: boolean;
}

// Bank account comparison with name
export interface BankAccountComparisonRequest {
  accountNumber: string;
  bankCode: string;
  firstName: string;
  lastName: string;
}

// Standard bank account verification data structure
export interface BankAccountVerificationData {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName?: string;
  accountType?: string;
  balance?: number;
  currency?: string;
  [key: string]: any;
}

// Bank code data structure
export interface BankCode {
  code: string;
  name: string;
}

/**
 * Interface for Bank Account verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface IBankAccountVerificationService {
  /**
   * Basic bank account verification - REQUIRED
   */
  verifyBankAccount(data: BankAccountVerificationRequest): Promise<VerificationResponse<BankAccountVerificationData>>;
  
  /**
   * Advanced bank account verification with balance - OPTIONAL
   */
  verifyBankAccountAdvance?(data: BankAccountAdvanceVerificationRequest): Promise<VerificationResponse<BankAccountVerificationData>>;
  
  /**
   * Compare bank account details with provided names - OPTIONAL
   */
  compareBankAccount?(data: BankAccountComparisonRequest): Promise<VerificationResponse<BankAccountVerificationData>>;
  
  /**
   * Get list of supported bank codes - OPTIONAL
   */
  listBankCodes?(): Promise<VerificationResponse<BankCode[]>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
