import { VerificationResponse } from '../verification-adapter.interface';

// Address verification request
export interface AddressVerificationRequest {
  address: string;
  state?: string;
  lga?: string;
}

// NYSC verification request
export interface NYSCVerificationRequest {
  certificateNumber: string;
  firstName?: string;
  lastName?: string;
}

// Insurance policy verification request
export interface InsurancePolicyVerificationRequest {
  policyNumber: string;
}

// National ID verification request
export interface NationalIDVerificationRequest {
  nationalIdNumber: string;
  firstName?: string;
  lastName?: string;
}

// WAEC verification request
export interface WAECVerificationRequest {
  examNumber: string;
  examYear: string;
  examType?: string;
}

// Document verification request
export interface DocumentVerificationRequest {
  documentType: string;
  documentNumber: string;
  image?: string; // Base64 encoded document image
}

// Document verification with face matching
export interface DocumentWithFaceVerificationRequest extends DocumentVerificationRequest {
  faceImage: string; // Base64 encoded face image
}

// Address verification data structure
export interface AddressVerificationData {
  address: string;
  verified: boolean;
  state?: string;
  lga?: string;
  landmark?: string;
  [key: string]: any;
}

// NYSC verification data structure
export interface NYSCVerificationData {
  certificateNumber: string;
  firstName: string;
  lastName: string;
  stateOfService?: string;
  yearOfService?: string;
  institution?: string;
  [key: string]: any;
}

// Insurance policy verification data structure
export interface InsurancePolicyVerificationData {
  policyNumber: string;
  policyHolderName?: string;
  status?: string;
  expiryDate?: string;
  issueDate?: string;
  insuranceCompany?: string;
  [key: string]: any;
}

// National ID verification data structure
export interface NationalIDVerificationData {
  nationalIdNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  [key: string]: any;
}

// WAEC verification data structure
export interface WAECVerificationData {
  examNumber: string;
  examYear: string;
  candidateName?: string;
  results?: Array<{
    subject: string;
    grade: string;
  }>;
  [key: string]: any;
}

// Document verification data structure
export interface DocumentVerificationData {
  documentType: string;
  documentNumber: string;
  verified: boolean;
  ownerName?: string;
  [key: string]: any;
}

/**
 * Interface for other miscellaneous verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface IOtherVerificationService {
  /**
   * Address verification - OPTIONAL
   */
  verifyAddress?(data: AddressVerificationRequest): Promise<VerificationResponse<AddressVerificationData>>;
  
  /**
   * NYSC (National Youth Service Corps) certificate verification - OPTIONAL
   */
  verifyNYSC?(data: NYSCVerificationRequest): Promise<VerificationResponse<NYSCVerificationData>>;
  
  /**
   * Insurance policy verification - OPTIONAL
   */
  verifyInsurancePolicy?(data: InsurancePolicyVerificationRequest): Promise<VerificationResponse<InsurancePolicyVerificationData>>;
  
  /**
   * National ID verification - OPTIONAL
   */
  verifyNationalID?(data: NationalIDVerificationRequest): Promise<VerificationResponse<NationalIDVerificationData>>;
  
  /**
   * WAEC (West African Examinations Council) verification - OPTIONAL
   */
  verifyWAEC?(data: WAECVerificationRequest): Promise<VerificationResponse<WAECVerificationData>>;
  
  /**
   * Generic document verification - OPTIONAL
   */
  verifyDocument?(data: DocumentVerificationRequest): Promise<VerificationResponse<DocumentVerificationData>>;
  
  /**
   * Document verification with face matching - OPTIONAL
   */
  verifyDocumentWithFace?(data: DocumentWithFaceVerificationRequest): Promise<VerificationResponse<DocumentVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
