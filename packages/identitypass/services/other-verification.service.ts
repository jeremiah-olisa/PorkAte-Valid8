/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from 'porkate-valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Other Verification Service
 * Handles miscellaneous verification types: Address, NYSC, Insurance, National ID, WAEC, Documents
 */
export class IdentityPassOtherService
  extends BaseIdentityPassService
  implements IOtherVerificationService
{
  /**
   * Verify Address
   * @see https://docs.prembly.com/docs/address-verification-copy
   */
  async verifyAddress(
    data: AddressVerificationRequest,
  ): Promise<VerificationResponse<AddressVerificationData>> {
    return this.makeRequest(
      '/verification/address',
      {
        ...data, // spread first to allow overrides
        address: data?.address,
        state: data?.state,
        lga: data?.lga,
        verification_type: 'person',
      },
      this.mapAddressData,
    );
  }

  /**
   * Verify NYSC Certificate
   * @see https://docs.prembly.com/docs/nysc-copy-1
   */
  async verifyNYSC(
    data: NYSCVerificationRequest,
  ): Promise<VerificationResponse<NYSCVerificationData>> {
    return this.makeRequest(
      '/verification/nysc',
      {
        nysc_number: data?.certificateNumber,
      },
      this.mapNYSCData,
    );
  }

  /**
   * Verify Insurance Policy
   * @see https://docs.prembly.com/docs/insurance-policy
   */
  async verifyInsurancePolicy(
    data: InsurancePolicyVerificationRequest,
  ): Promise<VerificationResponse<InsurancePolicyVerificationData>> {
    return this.makeRequest(
      '/verification/insurance_policy',
      {
        number: data?.policyNumber,
        channel: 'insurance', // default channel
      },
      this.mapInsurancePolicyData,
    );
  }

  /**
   * Verify National ID (Virtual NIN Basic)
   * @see https://docs.prembly.com/docs/national-id-basic-1
   */
  async verifyNationalID(
    data: NationalIDVerificationRequest,
  ): Promise<VerificationResponse<NationalIDVerificationData>> {
    return this.makeRequest(
      '/verification/vnin-basic',
      {
        number: data?.nationalIdNumber,
      },
      this.mapNationalIDData,
    );
  }

  /**
   * Verify WAEC Result
   * @see https://docs.prembly.com/docs/waec
   */
  async verifyWAEC(
    data: WAECVerificationRequest,
  ): Promise<VerificationResponse<WAECVerificationData>> {
    return this.makeRequest(
      '/verification/waec',
      {
        exam_number: data?.examNumber,
        exam_year: data?.examYear,
        exam_type: data?.examType || 'waec',
      },
      this.mapWAECData,
    );
  }

  /**
   * Verify Document (without face)
   * @see https://docs.prembly.com/docs/document-verification-copy-82
   */
  async verifyDocument(
    data: DocumentVerificationRequest,
  ): Promise<VerificationResponse<DocumentVerificationData>> {
    return this.makeRequest(
      '/verification/document',
      {
        doc_type: data?.documentType,
        doc_country: (data as any).documentCountry || 'NGA', // Default to Nigeria
        doc_image: data?.image,
      },
      this.mapDocumentData,
    );
  }

  /**
   * Verify Document with Face
   * @see https://docs.prembly.com/docs/document-verification-with-face-copy-82
   */
  async verifyDocumentWithFace(
    data: DocumentWithFaceVerificationRequest,
  ): Promise<VerificationResponse<DocumentVerificationData>> {
    return this.makeRequest(
      '/verification/document_w_face',
      {
        doc_type: data?.documentType,
        doc_country: (data as any).documentCountry || 'NGA', // Default to Nigeria
        doc_image: data?.image,
        selfie_image: data?.faceImage,
      },
      this.mapDocumentData,
    );
  }

  private mapAddressData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): AddressVerificationData {
    const address = (verificationData?.address as Record<string, unknown>) || {};

    return {
      address: (verificationData?.address || address?.address || payload?.address || '') as string,
      verified: Boolean(verificationData?.verified || verificationData?.status),
      state: (verificationData?.state || address?.state) as string | undefined,
      lga: (verificationData?.lga || address?.lga) as string | undefined,
      landmark: (verificationData?.landmark || address?.landmark) as string | undefined,
      firstName: (verificationData?.first_name || address?.first_name) as string | undefined,
      lastName: (verificationData?.last_name || address?.last_name) as string | undefined,
      phone: (verificationData?.phone || address?.phone) as string | undefined,
      latitude: (verificationData?.latitude || address?.latitude) as string | undefined,
      longitude: (verificationData?.longitude || address?.longitude) as string | undefined,
      street: (verificationData?.street || address?.street) as string | undefined,
      city: (verificationData?.city || address?.city) as string | undefined,
      reference: (verificationData?.reference || verificationData?._id) as string | undefined,
      jobId: (verificationData?._id || verificationData?.job_id) as string | undefined,
      addressStatus: (verificationData?.addressStatus || verificationData?.status) as
        | string
        | undefined,
      ...verificationData,
    };
  }

  private mapNYSCData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): NYSCVerificationData {
    return {
      certificateNumber: (verificationData?.certificate_number ||
        verificationData?.certificateNumber ||
        verificationData?.callUpNo ||
        payload?.nysc_number ||
        '') as string,
      firstName: (verificationData?.first_name ||
        verificationData?.firstname ||
        verificationData?.firstName ||
        '') as string,
      lastName: (verificationData?.last_name ||
        verificationData?.lastname ||
        verificationData?.lastName ||
        verificationData?.surname ||
        '') as string,
      middleName: (verificationData?.middle_name || verificationData?.middleName) as
        | string
        | undefined,
      stateOfService: (verificationData?.state_of_service ||
        verificationData?.stateOfService ||
        verificationData?.deployedState) as string | undefined,
      yearOfService: (verificationData?.year_of_service || verificationData?.yearOfService) as
        | string
        | undefined,
      institution: (verificationData?.institution || verificationData?.Institution) as
        | string
        | undefined,
      course: (verificationData?.course || verificationData?.Course) as string | undefined,
      matricNo: (verificationData?.matricNo || verificationData?.MatricNo) as string | undefined,
      grade: (verificationData?.grade || verificationData?.Grade) as string | undefined,
      dateOfBirth: (verificationData?.dateOfBirth || verificationData?.DateOfBirth) as
        | string
        | undefined,
      stateRegNumber: (verificationData?.stateRegNumber || verificationData?.StateRegNumber) as
        | string
        | undefined,
      gender: (verificationData?.gender || verificationData?.Gender) as string | undefined,
      status: (verificationData?.status || verificationData?.Status) as string | undefined,
      startPeriod: (verificationData?.startPeriod || verificationData?.StartPeriod) as
        | string
        | undefined,
      endPeriod: (verificationData?.endPeriod || verificationData?.EndPeriod) as string | undefined,
      image: (verificationData?.image || verificationData?.Image) as string | undefined,
      ...verificationData,
    };
  }

  private mapInsurancePolicyData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): InsurancePolicyVerificationData {
    return {
      policyNumber: (verificationData?.policy_number ||
        verificationData?.policyNumber ||
        payload?.number ||
        '') as string,
      policyHolderName: (verificationData?.policy_holder_name ||
        verificationData?.policyHolderName) as string | undefined,
      status: (verificationData?.status || verificationData?.policy_status) as string | undefined,
      expiryDate: (verificationData?.expiry_date || verificationData?.expiryDate) as
        | string
        | undefined,
      issueDate: (verificationData?.issue_date || verificationData?.issueDate) as
        | string
        | undefined,
      insuranceCompany: (verificationData?.insurance_company ||
        verificationData?.insuranceCompany) as string | undefined,
      typeOfCover: (verificationData?.type_of_cover || verificationData?.typeOfCover) as
        | string
        | undefined,
      vehicleType: (verificationData?.vehicle_type || verificationData?.vehicleType) as
        | string
        | undefined,
      vehicleMake: (verificationData?.vehicle_make || verificationData?.vehicleMake) as
        | string
        | undefined,
      vehicleModel: (verificationData?.vehicle_model || verificationData?.vehicleModel) as
        | string
        | undefined,
      vehicleColor: (verificationData?.vehicle_color || verificationData?.vehicleColor) as
        | string
        | undefined,
      vehicleChasis: (verificationData?.vehicle_chasis || verificationData?.vehicleChasis) as
        | string
        | undefined,
      regNumber: (verificationData?.reg_number || verificationData?.regNumber) as
        | string
        | undefined,
      newRegNumber: (verificationData?.new_reg_number || verificationData?.newRegNumber) as
        | string
        | undefined,
      ...verificationData,
    };
  }

  private mapNationalIDData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): NationalIDVerificationData {
    const ninData = (verificationData?.nin_data as Record<string, unknown>) || {};

    return {
      nationalIdNumber: (verificationData?.national_id_number ||
        verificationData?.nationalIdNumber ||
        ninData?.nin ||
        payload?.number ||
        '') as string,
      firstName: (verificationData?.first_name ||
        verificationData?.firstname ||
        verificationData?.firstName ||
        ninData?.firstname ||
        '') as string,
      lastName: (verificationData?.last_name ||
        verificationData?.lastname ||
        verificationData?.lastName ||
        ninData?.surname ||
        '') as string,
      middleName: (verificationData?.middle_name ||
        verificationData?.middleName ||
        ninData?.middlename) as string | undefined,
      dateOfBirth: (verificationData?.date_of_birth ||
        verificationData?.dob ||
        verificationData?.dateOfBirth ||
        ninData?.birthdate) as string | undefined,
      gender: (verificationData?.gender || ninData?.gender) as string | undefined,
      phoneNumber: (verificationData?.phone_number ||
        verificationData?.phoneNumber ||
        ninData?.telephoneno) as string | undefined,
      address: (verificationData?.address || ninData?.residence_address) as string | undefined,
      photo: (verificationData?.photo || ninData?.photo) as string | undefined,
      ...verificationData,
    };
  }

  private mapWAECData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): WAECVerificationData {
    const candidateResult = verificationData?.CandidateResult || verificationData?.candidateResult;

    return {
      examNumber: (verificationData?.exam_number ||
        verificationData?.examNumber ||
        verificationData?.CandidateNo ||
        payload?.exam_number ||
        '') as string,
      examYear: (verificationData?.exam_year ||
        verificationData?.examYear ||
        payload?.exam_year ||
        '') as string,
      candidateName: (verificationData?.candidate_name ||
        verificationData?.candidateName ||
        verificationData?.Surname) as string | undefined,
      firstName: (verificationData?.first_name || verificationData?.FirstName) as
        | string
        | undefined,
      surname: (verificationData?.surname || verificationData?.Surname) as string | undefined,
      otherNames: (verificationData?.other_names || verificationData?.OtherNames) as
        | string
        | undefined,
      sex: (verificationData?.sex || verificationData?.Sex) as string | undefined,
      dateOfBirth: (verificationData?.dob || verificationData?.Dob) as string | undefined,
      centreCode: (verificationData?.centre_code || verificationData?.CentreCode) as
        | number
        | undefined,
      centreName: (verificationData?.centre_name || verificationData?.CentreName) as
        | string
        | undefined,
      photo: (verificationData?.photo || verificationData?.Passport) as string | undefined,
      results: Array.isArray(candidateResult)
        ? candidateResult.map((result: Record<string, unknown>) => ({
            subject: (result?.subject || result?.Subject) as string,
            grade: (result?.grade || result?.Grade) as string,
            gradeDescription: (result?.grade_desc || result?.GradeDesc) as string | undefined,
          }))
        : undefined,
      ...verificationData,
    };
  }

  private mapDocumentData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): DocumentVerificationData {
    return {
      documentType: (verificationData?.document_type ||
        verificationData?.documentType ||
        payload?.doc_type ||
        '') as string,
      documentNumber: (verificationData?.document_number ||
        verificationData?.documentNumber ||
        '') as string,
      verified: (verificationData?.verified || verificationData?.status === true) as boolean,
      ownerName: (verificationData?.owner_name ||
        verificationData?.ownerName ||
        verificationData?.fullName) as string | undefined,
      fullName: (verificationData?.fullName || verificationData?.full_name) as string | undefined,
      firstName: (verificationData?.first_name || verificationData?.firstName) as
        | string
        | undefined,
      lastName: (verificationData?.last_name || verificationData?.lastName) as string | undefined,
      gender: (verificationData?.gender || verificationData?.Gender) as string | undefined,
      dateOfBirth: (verificationData?.dob || verificationData?.dateOfBirth) as string | undefined,
      address: (verificationData?.address || verificationData?.Address) as string | undefined,
      documentName: (verificationData?.document_name || verificationData?.documentName) as
        | string
        | undefined,
      documentCountry: (verificationData?.documentCountry || verificationData?.document_country) as
        | string
        | undefined,
      nationality: (verificationData?.nationality || verificationData?.Nationality) as
        | string
        | undefined,
      issuer: (verificationData?.issuer || verificationData?.Issuer) as string | undefined,
      placeOfIssue: (verificationData?.place_of_issue || verificationData?.placeOfIssue) as
        | string
        | undefined,
      dateOfIssue: (verificationData?.date_of_issue || verificationData?.dateOfIssue) as
        | string
        | undefined,
      expirationDate: (verificationData?.expirationDate || verificationData?.expiration_date) as
        | string
        | undefined,
      age: (verificationData?.age || verificationData?.Age) as number | undefined,
      image: (verificationData?.image || verificationData?.Image) as string | undefined,
      ...verificationData,
    };
  }
}
