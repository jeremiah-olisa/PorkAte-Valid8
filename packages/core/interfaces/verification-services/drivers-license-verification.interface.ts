import { VerificationResponse } from '../verification-adapter.interface';

// Base request for driver's license verification
export interface DriversLicenseVerificationRequest {
  licenseNumber: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

// Advanced driver's license verification
export interface DriversLicenseAdvanceVerificationRequest extends DriversLicenseVerificationRequest {
  includeHistory?: boolean;
}

// Driver's license verification with face matching
export interface DriversLicenseWithFaceVerificationRequest extends DriversLicenseVerificationRequest {
  image: string; // Base64 encoded face image for matching
}

// Driver's license verification using document image
export interface DriversLicenseImageVerificationRequest {
  licenseNumber: string;
  image: string; // Base64 encoded image of the driver's license
}

// Standard driver's license verification data structure
export interface DriversLicenseVerificationData {
  licenseNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender?: string;
  stateOfIssue?: string;
  expiryDate?: string;
  issueDate?: string;
  photo?: string;
  address?: string;
  bloodGroup?: string;
  [key: string]: any;
}

/**
 * Interface for Driver's License verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface IDriversLicenseVerificationService {
  /**
   * Basic driver's license verification - REQUIRED
   */
  verifyDriversLicense(data: DriversLicenseVerificationRequest): Promise<VerificationResponse<DriversLicenseVerificationData>>;
  
  /**
   * Advanced driver's license verification with history - OPTIONAL
   */
  verifyDriversLicenseAdvance?(data: DriversLicenseAdvanceVerificationRequest): Promise<VerificationResponse<DriversLicenseVerificationData>>;
  
  /**
   * Driver's license verification with face matching - OPTIONAL
   */
  verifyDriversLicenseWithFace?(data: DriversLicenseWithFaceVerificationRequest): Promise<VerificationResponse<DriversLicenseVerificationData>>;
  
  /**
   * Driver's license verification using document image - OPTIONAL
   */
  verifyDriversLicenseImage?(data: DriversLicenseImageVerificationRequest): Promise<VerificationResponse<DriversLicenseVerificationData>>;
  
  /**
   * Driver's license verification V2 (alternative endpoint) - OPTIONAL
   */
  verifyDriversLicenseV2?(data: DriversLicenseVerificationRequest): Promise<VerificationResponse<DriversLicenseVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
