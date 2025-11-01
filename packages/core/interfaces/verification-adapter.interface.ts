/**
 * @deprecated Use specialized verification service interfaces instead
 * This interface is maintained for backward compatibility
 */
export interface IVerificationAdapter {
  verifyNIN(data: any): Promise<VerificationResponse>;
  verifyBVN(data: any): Promise<VerificationResponse>;
  verifyVotersCard(data: any): Promise<VerificationResponse>;
  verifyPassport(data: any): Promise<VerificationResponse>;
  verifyTIN(data: any): Promise<VerificationResponse>;
  verifyVehicle(data: any): Promise<VerificationResponse>;
  verifyCAC(data: any): Promise<VerificationResponse>;
  verifyPhoneNumber(data: any): Promise<VerificationResponse>;
  verifyBankAccount(data: any): Promise<VerificationResponse>;
  verifyCreditBureau(data: any): Promise<VerificationResponse>;
  isReady(): boolean;
}

/**
 * Generic verification response structure
 * @template T - The type of the verified data
 * @template M - The type of the adapter-specific metadata/raw response
 */
export interface VerificationResponse<T = any, M = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  provider: string;
  timestamp: Date;
  meta?: M; // Original adapter-specific response
}

// Legacy request types - kept for backward compatibility
// New code should use the types from specialized verification service interfaces
export interface NINVerificationRequest {
  nin: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export interface BVNVerificationRequest {
  bvn: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export interface VotersCardVerificationRequest {
  vin: string;
  firstName?: string;
  lastName?: string;
  state?: string;
}

export interface PassportVerificationRequest {
  passportNumber: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export interface TINVerificationRequest {
  tin: string;
  channel?: string;
}

export interface VehicleVerificationRequest {
  plateNumber: string;
}

export interface CACVerificationRequest {
  rcNumber?: string;
  bnNumber?: string;
  companyName?: string;
}

export interface PhoneVerificationRequest {
  phoneNumber: string;
}

export interface BankAccountVerificationRequest {
  accountNumber: string;
  bankCode: string;
}

export interface CreditBureauVerificationRequest {
  bvn?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
}
