import { VerificationResponse, PhoneVerificationRequest as BasePhoneVerificationRequest } from '../verification-adapter.interface';

// Re-export the base type
export type PhoneVerificationRequest = BasePhoneVerificationRequest;

// Advanced phone number verification
export interface PhoneAdvanceVerificationRequest extends PhoneVerificationRequest {
  includeCarrierInfo?: boolean;
}

// Standard phone verification data structure
export interface PhoneVerificationData {
  phoneNumber: string;
  carrier?: string;
  lineType?: string;
  status?: string;
  ownerName?: string;
  network?: string;
  [key: string]: any;
}

/**
 * Interface for Phone Number verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface IPhoneVerificationService {
  /**
   * Basic phone number verification - REQUIRED
   */
  verifyPhoneNumber(data: PhoneVerificationRequest): Promise<VerificationResponse<PhoneVerificationData>>;
  
  /**
   * Advanced phone number verification with carrier info - OPTIONAL
   */
  verifyPhoneNumberAdvance?(data: PhoneAdvanceVerificationRequest): Promise<VerificationResponse<PhoneVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
