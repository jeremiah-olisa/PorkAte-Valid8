import { VerificationResponse, NINVerificationRequest as BaseNINVerificationRequest } from '../verification-adapter.interface';

// Re-export the base type
export type NINVerificationRequest = BaseNINVerificationRequest;

// NIN verification with face matching
export interface NINWithFaceVerificationRequest extends NINVerificationRequest {
  image: string; // Base64 encoded image for face matching
}

// NIN slip verification
export interface NINSlipVerificationRequest {
  nin: string; // The NIN number
  slipNumber: string;
}

// Virtual NIN verification
export interface VirtualNINVerificationRequest {
  virtualNin: string;
  firstName?: string;
  lastName?: string;
}

// Standard NIN verification data structure
export interface NINVerificationData {
  nin: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber?: string;
  address?: string;
  photo?: string;
  maritalStatus?: string;
  nationality?: string;
  stateOfOrigin?: string;
  lga?: string;
  [key: string]: any;
}

/**
 * Interface for NIN (National Identification Number) verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface ININVerificationService {
  /**
   * Basic NIN verification - REQUIRED
   */
  verifyNIN(data: NINVerificationRequest): Promise<VerificationResponse<NINVerificationData>>;
  
  /**
   * NIN verification with face matching - OPTIONAL
   */
  verifyNINWithFace?(data: NINWithFaceVerificationRequest): Promise<VerificationResponse<NINVerificationData>>;
  
  /**
   * NIN slip verification - OPTIONAL
   */
  verifyNINSlip?(data: NINSlipVerificationRequest): Promise<VerificationResponse<NINVerificationData>>;
  
  /**
   * Virtual NIN verification - OPTIONAL
   */
  verifyVirtualNIN?(data: VirtualNINVerificationRequest): Promise<VerificationResponse<NINVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
