import { VerificationResponse, BVNVerificationRequest as BaseBVNVerificationRequest } from '../verification-adapter.interface';

// Re-export the base type
export type BVNVerificationRequest = BaseBVNVerificationRequest;

// BVN verification with face matching
export interface BVNWithFaceVerificationRequest extends BVNVerificationRequest {
  image: string; // Base64 encoded image for face matching
}

// Advanced BVN verification with additional details
export interface BVNAdvanceVerificationRequest extends BVNVerificationRequest {
  includeHistory?: boolean;
}

// Get BVN by phone number
export interface BVNByPhoneNumberRequest {
  phoneNumber: string;
}

// Standard BVN verification data structure
export interface BVNVerificationData {
  bvn: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  phoneNumber?: string;
  email?: string;
  gender?: string;
  address?: string;
  photo?: string;
  enrollmentBank?: string;
  enrollmentBranch?: string;
  registrationDate?: string;
  watchListed?: boolean;
  [key: string]: any;
}

/**
 * Interface for BVN (Bank Verification Number) verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface IBVNVerificationService {
  /**
   * Basic BVN verification - REQUIRED
   */
  verifyBVN(data: BVNVerificationRequest): Promise<VerificationResponse<BVNVerificationData>>;
  
  /**
   * Advanced BVN verification with additional details - OPTIONAL
   */
  verifyBVNAdvance?(data: BVNAdvanceVerificationRequest): Promise<VerificationResponse<BVNVerificationData>>;
  
  /**
   * BVN verification with face matching - OPTIONAL
   */
  verifyBVNWithFace?(data: BVNWithFaceVerificationRequest): Promise<VerificationResponse<BVNVerificationData>>;
  
  /**
   * Get BVN details by phone number - OPTIONAL
   */
  getBVNByPhoneNumber?(data: BVNByPhoneNumberRequest): Promise<VerificationResponse<BVNVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
