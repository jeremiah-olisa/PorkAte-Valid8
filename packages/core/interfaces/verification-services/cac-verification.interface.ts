import { VerificationResponse, CACVerificationRequest as BaseCACVerificationRequest } from '../verification-adapter.interface';

// Re-export the base type
export type CACVerificationRequest = BaseCACVerificationRequest;

// Advanced CAC verification with additional details
export interface CACAdvanceVerificationRequest extends CACVerificationRequest {
  includeDirectors?: boolean;
  includeShareholdings?: boolean;
}

// Search company by name
export interface CompanySearchByNameRequest {
  companyName: string;
}

// Search company by person
export interface CompanySearchByPersonRequest {
  personName: string;
  companyName?: string;
}

// Search company by registration number
export interface CompanySearchByRegistrationNumberRequest {
  rcNumber: string;
}

// Standard CAC verification data structure
export interface CACVerificationData {
  companyName: string;
  rcNumber?: string;
  bnNumber?: string;
  registrationDate?: string;
  status?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  companyType?: string;
  branchAddress?: string;
  headOfficeAddress?: string;
  directors?: Array<{
    name: string;
    position?: string;
    appointmentDate?: string;
    [key: string]: any;
  }>;
  shareholders?: Array<{
    name: string;
    shares?: number;
    shareType?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

/**
 * Interface for CAC (Corporate Affairs Commission) verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface ICACVerificationService {
  /**
   * Basic CAC verification - REQUIRED
   */
  verifyCAC(data: CACVerificationRequest): Promise<VerificationResponse<CACVerificationData>>;
  
  /**
   * Advanced CAC verification with directors and shareholdings - OPTIONAL
   */
  verifyCACAdvance?(data: CACAdvanceVerificationRequest): Promise<VerificationResponse<CACVerificationData>>;
  
  /**
   * Search for companies by name - OPTIONAL
   */
  searchCompanyByName?(data: CompanySearchByNameRequest): Promise<VerificationResponse<CACVerificationData[]>>;
  
  /**
   * Search for companies associated with a person - OPTIONAL
   */
  searchCompanyByPerson?(data: CompanySearchByPersonRequest): Promise<VerificationResponse<CACVerificationData[]>>;
  
  /**
   * Search company by registration number - OPTIONAL
   */
  searchCompanyByRegistrationNumber?(data: CompanySearchByRegistrationNumberRequest): Promise<VerificationResponse<CACVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
