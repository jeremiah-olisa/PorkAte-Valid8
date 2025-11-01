import { VerificationResponse, PassportVerificationRequest as BasePassportVerificationRequest } from '../verification-adapter.interface';

// Re-export the base type
export type PassportVerificationRequest = BasePassportVerificationRequest;

// Passport verification with face matching
export interface PassportWithFaceVerificationRequest extends PassportVerificationRequest {
  image: string; // Base64 encoded face image for matching
}

// Passport verification using document image
export interface PassportImageVerificationRequest {
  passportNumber: string;
  image: string; // Base64 encoded image of the passport
}

// Standard passport verification data structure
export interface PassportVerificationData {
  passportNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender?: string;
  nationality?: string;
  expiryDate?: string;
  issueDate?: string;
  photo?: string;
  placeOfIssue?: string;
  [key: string]: any;
}

/**
 * Interface for International Passport verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface IPassportVerificationService {
  /**
   * Basic passport verification - REQUIRED
   */
  verifyPassport(data: PassportVerificationRequest): Promise<VerificationResponse<PassportVerificationData>>;
  
  /**
   * Passport verification V2 (alternative endpoint) - OPTIONAL
   */
  verifyPassportV2?(data: PassportVerificationRequest): Promise<VerificationResponse<PassportVerificationData>>;
  
  /**
   * Passport verification with face matching - OPTIONAL
   */
  verifyPassportWithFace?(data: PassportWithFaceVerificationRequest): Promise<VerificationResponse<PassportVerificationData>>;
  
  /**
   * Passport verification using document image - OPTIONAL
   */
  verifyPassportImage?(data: PassportImageVerificationRequest): Promise<VerificationResponse<PassportVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
