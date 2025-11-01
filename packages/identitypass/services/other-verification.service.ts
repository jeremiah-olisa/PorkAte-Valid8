import {
  IOtherVerificationService,
  AddressVerificationRequest,
  NYSCVerificationRequest,
  InsurancePolicyVerificationRequest,
  NationalIDVerificationRequest,
  WAECVerificationRequest,
  DocumentVerificationRequest,
  DocumentWithFaceVerificationRequest,
  AddressVerificationData,
  NYSCVerificationData,
  InsurancePolicyVerificationData,
  NationalIDVerificationData,
  WAECVerificationData,
  DocumentVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Other Verification Service
 * Handles miscellaneous verification types: Address, NYSC, Insurance, National ID, WAEC, Documents
 */
export class IdentityPassOtherService extends BaseIdentityPassService implements IOtherVerificationService {
  async verifyAddress(data: AddressVerificationRequest): Promise<VerificationResponse<AddressVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/address',
      {
        address: data.address,
        state: data.state,
        lga: data.lga,
      },
      this.mapAddressData
    );
  }

  async verifyNYSC(data: NYSCVerificationRequest): Promise<VerificationResponse<NYSCVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/nysc',
      {
        certificate_number: data.certificateNumber,
        firstname: data.firstName,
        lastname: data.lastName,
      },
      this.mapNYSCData
    );
  }

  async verifyInsurancePolicy(
    data: InsurancePolicyVerificationRequest
  ): Promise<VerificationResponse<InsurancePolicyVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/insurance',
      {
        policy_number: data.policyNumber,
      },
      this.mapInsurancePolicyData
    );
  }

  async verifyNationalID(
    data: NationalIDVerificationRequest
  ): Promise<VerificationResponse<NationalIDVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/national_id',
      {
        number: data.nationalIdNumber,
        firstname: data.firstName,
        lastname: data.lastName,
      },
      this.mapNationalIDData
    );
  }

  async verifyWAEC(data: WAECVerificationRequest): Promise<VerificationResponse<WAECVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/waec',
      {
        exam_number: data.examNumber,
        exam_year: data.examYear,
        exam_type: data.examType,
      },
      this.mapWAECData
    );
  }

  async verifyDocument(
    data: DocumentVerificationRequest
  ): Promise<VerificationResponse<DocumentVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/document',
      {
        document_type: data.documentType,
        document_number: data.documentNumber,
        image: data.image,
      },
      this.mapDocumentData
    );
  }

  async verifyDocumentWithFace(
    data: DocumentWithFaceVerificationRequest
  ): Promise<VerificationResponse<DocumentVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/document/face',
      {
        document_type: data.documentType,
        document_number: data.documentNumber,
        image: data.image,
        face_image: data.faceImage,
      },
      this.mapDocumentData
    );
  }

  private mapAddressData(verificationData: any, payload: any): AddressVerificationData {
    return {
      address: verificationData.address || payload.address || '',
      verified: verificationData.verified || false,
      state: verificationData.state,
      lga: verificationData.lga,
      landmark: verificationData.landmark,
      ...verificationData,
    };
  }

  private mapNYSCData(verificationData: any, payload: any): NYSCVerificationData {
    return {
      certificateNumber: verificationData.certificate_number || verificationData.certificateNumber || payload.certificate_number || '',
      firstName: verificationData.first_name || verificationData.firstname || verificationData.firstName || '',
      lastName: verificationData.last_name || verificationData.lastname || verificationData.lastName || '',
      stateOfService: verificationData.state_of_service || verificationData.stateOfService,
      yearOfService: verificationData.year_of_service || verificationData.yearOfService,
      institution: verificationData.institution,
      ...verificationData,
    };
  }

  private mapInsurancePolicyData(verificationData: any, payload: any): InsurancePolicyVerificationData {
    return {
      policyNumber: verificationData.policy_number || verificationData.policyNumber || payload.policy_number || '',
      policyHolderName: verificationData.policy_holder_name || verificationData.policyHolderName,
      status: verificationData.status,
      expiryDate: verificationData.expiry_date || verificationData.expiryDate,
      issueDate: verificationData.issue_date || verificationData.issueDate,
      insuranceCompany: verificationData.insurance_company || verificationData.insuranceCompany,
      ...verificationData,
    };
  }

  private mapNationalIDData(verificationData: any, payload: any): NationalIDVerificationData {
    return {
      nationalIdNumber: verificationData.national_id_number || verificationData.nationalIdNumber || payload.number || '',
      firstName: verificationData.first_name || verificationData.firstname || verificationData.firstName || '',
      lastName: verificationData.last_name || verificationData.lastname || verificationData.lastName || '',
      dateOfBirth: verificationData.date_of_birth || verificationData.dob || verificationData.dateOfBirth,
      ...verificationData,
    };
  }

  private mapWAECData(verificationData: any, payload: any): WAECVerificationData {
    return {
      examNumber: verificationData.exam_number || verificationData.examNumber || payload.exam_number || '',
      examYear: verificationData.exam_year || verificationData.examYear || payload.exam_year || '',
      candidateName: verificationData.candidate_name || verificationData.candidateName,
      results: verificationData.results?.map((result: any) => ({
        subject: result.subject,
        grade: result.grade,
      })),
      ...verificationData,
    };
  }

  private mapDocumentData(verificationData: any, payload: any): DocumentVerificationData {
    return {
      documentType: verificationData.document_type || verificationData.documentType || payload.document_type || '',
      documentNumber: verificationData.document_number || verificationData.documentNumber || payload.document_number || '',
      verified: verificationData.verified || false,
      ownerName: verificationData.owner_name || verificationData.ownerName,
      ...verificationData,
    };
  }
}
