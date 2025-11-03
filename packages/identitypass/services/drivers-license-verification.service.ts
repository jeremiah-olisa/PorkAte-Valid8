import {
  IDriversLicenseVerificationService,
  DriversLicenseVerificationRequest,
  DriversLicenseAdvanceVerificationRequest,
  DriversLicenseWithFaceVerificationRequest,
  DriversLicenseImageVerificationRequest,
  DriversLicenseVerificationData,
  VerificationResponse,
} from 'porkate-valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Driver's License Verification Service
 */
export class IdentityPassDriversLicenseService
  extends BaseIdentityPassService
  implements IDriversLicenseVerificationService
{
  /**
   * Verify Driver's License with Face Validation
   * @see https://docs.prembly.com/docs/drivers-license-face-validation-copy
   */
  async verifyDriversLicenseWithFace(
    data: DriversLicenseWithFaceVerificationRequest,
  ): Promise<VerificationResponse<DriversLicenseVerificationData>> {
    return this.makeRequest(
      '/verification/drivers_license/face',
      {
        number: data?.licenseNumber,
        dob: data?.dateOfBirth,
        image: data?.image,
      },
      this.mapDriversLicenseData,
    );
  }

  /**
   * Verify Driver's License V2 (Advance)
   * @see https://docs.prembly.com/docs/drivers-license-v2
   */
  async verifyDriversLicenseV2(
    data: DriversLicenseVerificationRequest,
  ): Promise<VerificationResponse<DriversLicenseVerificationData>> {
    return this.makeRequest(
      '/verification/drivers_license/advance/v2',
      {
        number: data?.licenseNumber,
        first_name: data?.firstName,
        last_name: data?.lastName,
      },
      this.mapDriversLicenseData,
    );
  }

  /**
   * Verify Driver's License - Basic (deprecated - use V2)
   * @deprecated Use verifyDriversLicenseV2 instead
   */
  async verifyDriversLicense(
    data: DriversLicenseVerificationRequest,
  ): Promise<VerificationResponse<DriversLicenseVerificationData>> {
    return this.verifyDriversLicenseV2(data);
  }

  /**
   * Verify Driver's License - Advance (deprecated - use V2)
   * @deprecated Use verifyDriversLicenseV2 instead
   */
  async verifyDriversLicenseAdvance(
    data: DriversLicenseAdvanceVerificationRequest,
  ): Promise<VerificationResponse<DriversLicenseVerificationData>> {
    return this.verifyDriversLicenseV2(data);
  }

  /**
   * Verify Driver's License Image (not documented in new API)
   * @deprecated Endpoint may not be available
   */
  async verifyDriversLicenseImage(
    data: DriversLicenseImageVerificationRequest,
  ): Promise<VerificationResponse<DriversLicenseVerificationData>> {
    return this.makeRequest(
      '/verification/drivers_license/image',
      {
        number: data?.licenseNumber,
        image: data?.image,
      },
      this.mapDriversLicenseData,
    );
  }

  /**
   * Map Drivers License API response to DriversLicenseVerificationData
   * Handles various response field formats from Prembly API
   */
  private mapDriversLicenseData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): DriversLicenseVerificationData {
    // Handle nested frsc_data structure
    const frscData = (verificationData?.frsc_data as Record<string, unknown>) || verificationData;

    return {
      licenseNumber:
        (frscData?.license_number as string) ||
        (frscData?.licenseNumber as string) ||
        (frscData?.licenseNo as string) ||
        (frscData?.driversLicense as string) ||
        (payload?.number as string) ||
        '',
      firstName:
        (frscData?.first_name as string) ||
        (frscData?.firstname as string) ||
        (frscData?.firstName as string) ||
        '',
      lastName:
        (frscData?.last_name as string) ||
        (frscData?.lastname as string) ||
        (frscData?.lastName as string) ||
        '',
      middleName:
        (frscData?.middle_name as string) ||
        (frscData?.middlename as string) ||
        (frscData?.middleName as string),
      dateOfBirth:
        (frscData?.date_of_birth as string) ||
        (frscData?.dob as string) ||
        (frscData?.dateOfBirth as string) ||
        (frscData?.birthdate as string) ||
        (frscData?.birthDate as string) ||
        '',
      gender: frscData?.gender as string,
      stateOfIssue:
        (frscData?.state_of_issue as string) ||
        (frscData?.stateOfIssue as string) ||
        (frscData?.state_of_issue as string),
      expiryDate:
        (frscData?.expiry_date as string) ||
        (frscData?.expiryDate as string) ||
        (frscData?.expiry_date as string),
      issueDate:
        (frscData?.issue_date as string) ||
        (frscData?.issueDate as string) ||
        (frscData?.issued_date as string) ||
        (frscData?.issuedDate as string),
      photo: (frscData?.photo as string) || (frscData?.image as string),
      address: frscData?.address as string,
      bloodGroup: (frscData?.blood_group as string) || (frscData?.bloodGroup as string),
      message: frscData?.message as string,
      ...verificationData,
    };
  }
}
