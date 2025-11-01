import { VerificationResponse, VotersCardVerificationRequest as BaseVotersCardVerificationRequest } from '../verification-adapter.interface';

// Re-export the base type
export type VotersCardVerificationRequest = BaseVotersCardVerificationRequest;

// Standard voter's card verification data structure
export interface VotersCardVerificationData {
  vin: string;
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  state?: string;
  lga?: string; // Local Government Area
  pollingUnit?: string;
  registrationDate?: string;
  occupation?: string;
  [key: string]: any;
}

/**
 * Interface for Voter's Card verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface IVotersCardVerificationService {
  /**
   * Voter's card verification - REQUIRED
   */
  verifyVotersCard(data: VotersCardVerificationRequest): Promise<VerificationResponse<VotersCardVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
