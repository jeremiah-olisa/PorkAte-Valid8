import {
  IBVNVerificationService,
  BVNVerificationRequest,
  BVNWithFaceVerificationRequest,
  BVNAdvanceVerificationRequest,
  BVNByPhoneNumberRequest,
  BVNVerificationData,
  VerificationResponse,
} from 'porkate-valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass BVN Verification Service
 *
 * @see https://docs.prembly.com/reference/bvn-basic
 * @see https://docs.prembly.com/reference/bvn-advance
 * @see https://docs.prembly.com/reference/bvn-face-validation
 * @see https://docs.prembly.com/reference/get-bvn-with-phone-number-1
 */
export class IdentityPassBVNService
  extends BaseIdentityPassService
  implements IBVNVerificationService
{
  /**
   * BVN Basic Verification - Validate a bank verification number
   * @see https://docs.prembly.com/reference/bvn-basic
   */
  async verifyBVN(
    data: BVNVerificationRequest,
  ): Promise<VerificationResponse<BVNVerificationData>> {
    return this.makeRequest(
      '/verification/bvn_validation',
      {
        number: data?.bvn,
      },
      this.mapBVNData,
    );
  }

  /**
   * BVN Advance Verification - Get detailed BVN information
   * @see https://docs.prembly.com/reference/bvn-advance
   */
  async verifyBVNAdvance(
    data: BVNAdvanceVerificationRequest,
  ): Promise<VerificationResponse<BVNVerificationData>> {
    return this.makeRequest(
      '/verification/bvn',
      {
        number: data?.bvn,
      },
      this.mapBVNData,
    );
  }

  /**
   * BVN with Face Validation - Verify BVN against user's image
   * @see https://docs.prembly.com/reference/bvn-face-validation
   */
  async verifyBVNWithFace(
    data: BVNWithFaceVerificationRequest,
  ): Promise<VerificationResponse<BVNVerificationData>> {
    return this.makeRequest(
      '/verification/bvn_w_face',
      {
        number: data?.bvn,
        image: data?.image,
      },
      this.mapBVNData,
    );
  }

  /**
   * Get BVN by Phone Number - Retrieve BVN information using phone number
   * @see https://docs.prembly.com/reference/get-bvn-with-phone-number-1
   */
  async getBVNByPhoneNumber(
    data: BVNByPhoneNumberRequest,
  ): Promise<VerificationResponse<BVNVerificationData>> {
    return this.makeRequest(
      '/verification/bvn_with_phone_advance',
      {
        phone_number: data?.phoneNumber,
      },
      this.mapBVNData,
    );
  }

  /**
   * Map BVN API response to BVNVerificationData
   * Handles various response field formats from Prembly API
   */
  private mapBVNData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): BVNVerificationData {
    return {
      bvn:
        (verificationData?.bvn as string) ||
        (verificationData?.number as string) ||
        (payload?.number as string),
      firstName:
        (verificationData?.firstName as string) ||
        (verificationData?.first_name as string) ||
        (verificationData?.firstname as string) ||
        '',
      lastName:
        (verificationData?.lastName as string) ||
        (verificationData?.last_name as string) ||
        (verificationData?.lastname as string) ||
        '',
      middleName:
        (verificationData?.middleName as string) ||
        (verificationData?.middle_name as string) ||
        (verificationData?.middlename as string),
      dateOfBirth:
        (verificationData?.dateOfBirth as string) ||
        (verificationData?.date_of_birth as string) ||
        (verificationData?.dob as string) ||
        '',
      phoneNumber:
        (verificationData?.phoneNumber as string) ||
        (verificationData?.phoneNumber1 as string) ||
        (verificationData?.phone_number as string),
      phoneNumber2:
        (verificationData?.phoneNumber2 as string) || (verificationData?.phone_number2 as string),
      email: verificationData?.email as string,
      gender: verificationData?.gender as string,
      address:
        (verificationData?.residentialAddress as string) ||
        (verificationData?.residential_address as string) ||
        (verificationData?.address as string),
      photo:
        (verificationData?.photo as string) ||
        (verificationData?.base64Image as string) ||
        (verificationData?.image as string),
      enrollmentBank:
        (verificationData?.enrollmentBank as string) ||
        (verificationData?.enrollment_bank as string),
      enrollmentBranch:
        (verificationData?.enrollmentBranch as string) ||
        (verificationData?.enrollment_branch as string),
      registrationDate:
        (verificationData?.registrationDate as string) ||
        (verificationData?.registration_date as string),
      watchListed: this.parseWatchListed(
        verificationData?.watchListed || verificationData?.watch_listed,
      ),
      levelOfAccount: verificationData?.levelOfAccount as string,
      lgaOfOrigin: verificationData?.lgaOfOrigin as string,
      lgaOfResidence: verificationData?.lgaOfResidence as string,
      maritalStatus: verificationData?.maritalStatus as string,
      nin: verificationData?.nin as string,
      nameOnCard: verificationData?.nameOnCard as string,
      nationality: verificationData?.nationality as string,
      stateOfOrigin: verificationData?.stateOfOrigin as string,
      stateOfResidence: verificationData?.stateOfResidence as string,
      title: verificationData?.title as string,
      ...verificationData,
    };
  }

  /**
   * Parse watchListed value to boolean
   * Handles various formats: "YES"/"NO", "Yes"/"No", true/false
   */
  private parseWatchListed(value: unknown): boolean | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const normalized = value.trim().toUpperCase();
      if (normalized === 'YES' || normalized === 'TRUE') return true;
      if (normalized === 'NO' || normalized === 'FALSE') return false;
    }
    return undefined;
  }
}
