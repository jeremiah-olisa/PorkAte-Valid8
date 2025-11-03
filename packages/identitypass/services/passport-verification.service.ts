import {
  IPassportVerificationService,
  PassportVerificationRequest,
  PassportWithFaceVerificationRequest,
  PassportImageVerificationRequest,
  PassportVerificationData,
  VerificationResponse,
} from 'porkate-valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass International Passport Verification Service
 */
export class IdentityPassPassportService
  extends BaseIdentityPassService
  implements IPassportVerificationService
{
  /**
   * Verify International Passport
   * @see https://docs.prembly.com/docs/international-passport-copy
   */
  async verifyPassport(
    data: PassportVerificationRequest,
  ): Promise<VerificationResponse<PassportVerificationData>> {
    return this.makeRequest(
      '/verification/national_passport',
      {
        number: data?.passportNumber,
        last_name: data?.lastName,
      },
      this.mapPassportData,
    );
  }

  /**
   * Verify International Passport V2
   * @see https://docs.prembly.com/docs/passport-version-2-1
   */
  async verifyPassportV2(
    data: PassportVerificationRequest,
  ): Promise<VerificationResponse<PassportVerificationData>> {
    return this.makeRequest(
      '/verification/national_passport_v2',
      {
        number: data?.passportNumber,
        last_name: data?.lastName,
        dob: data?.dateOfBirth,
      },
      this.mapPassportData,
    );
  }

  /**
   * Verify International Passport with Face Validation
   * @see https://docs.prembly.com/docs/international-passport-face-validation-copy
   */
  async verifyPassportWithFace(
    data: PassportWithFaceVerificationRequest,
  ): Promise<VerificationResponse<PassportVerificationData>> {
    return this.makeRequest(
      '/verification/national_passport_with_face',
      {
        number: data?.passportNumber,
        last_name: data?.lastName,
        image: data?.image,
      },
      this.mapPassportData,
    );
  }

  /**
   * Verify International Passport Image (Extract and Verify)
   * @see https://docs.prembly.com/docs/international-passport-image-copy
   */
  async verifyPassportImage(
    data: PassportImageVerificationRequest,
  ): Promise<VerificationResponse<PassportVerificationData>> {
    return this.makeRequest(
      '/verification/national_passport_image',
      {
        image: data?.image,
      },
      this.mapPassportData,
    );
  }

  /**
   * Map Passport API response to PassportVerificationData
   * Handles various response field formats from Prembly API
   */
  private mapPassportData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): PassportVerificationData {
    return {
      passportNumber:
        (verificationData?.passport_number as string) ||
        (verificationData?.passportNumber as string) ||
        (verificationData?.number as string) ||
        (verificationData?.currentPassportNumber as string) ||
        (payload?.number as string) ||
        '',
      firstName:
        (verificationData?.first_name as string) ||
        (verificationData?.firstname as string) ||
        (verificationData?.firstName as string) ||
        (verificationData?.currentFirstName as string) ||
        '',
      lastName:
        (verificationData?.last_name as string) ||
        (verificationData?.lastname as string) ||
        (verificationData?.lastName as string) ||
        (verificationData?.currentLastName as string) ||
        (payload?.last_name as string) ||
        '',
      middleName:
        (verificationData?.middle_name as string) ||
        (verificationData?.middlename as string) ||
        (verificationData?.middleName as string) ||
        (verificationData?.currentMiddleName as string),
      dateOfBirth:
        (verificationData?.date_of_birth as string) ||
        (verificationData?.dob as string) ||
        (verificationData?.dateOfBirth as string) ||
        (verificationData?.currentDateOfBirthLabel as string) ||
        '',
      gender: (verificationData?.gender as string) || (verificationData?.currentGender as string),
      nationality: verificationData?.nationality as string,
      expiryDate:
        (verificationData?.expiry_date as string) || (verificationData?.expiryDate as string),
      issueDate:
        (verificationData?.issue_date as string) ||
        (verificationData?.issueDate as string) ||
        (verificationData?.issued_date as string),
      photo: (verificationData?.photo as string) || (verificationData?.image as string),
      placeOfIssue:
        (verificationData?.place_of_issue as string) ||
        (verificationData?.placeOfIssue as string) ||
        (verificationData?.issued_at as string),
      mobile: verificationData?.mobile as string,
      signature: verificationData?.signature as string,
      referenceId:
        (verificationData?.reference_id as string) || (verificationData?.referenceId as string),
      passportType:
        (verificationData?.currentPassportType as string) ||
        (verificationData?.passport_type as string),
      title: (verificationData?.currentTitle as string) || (verificationData?.title as string),
      placeOfBirth:
        (verificationData?.currentPlaceOfBirth as string) ||
        (verificationData?.place_of_birth as string),
      successful: verificationData?.successful as boolean,
      ...verificationData,
    };
  }
}
