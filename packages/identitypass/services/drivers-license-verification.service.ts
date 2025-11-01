import {
  IDriversLicenseVerificationService,
  DriversLicenseVerificationRequest,
  DriversLicenseAdvanceVerificationRequest,
  DriversLicenseWithFaceVerificationRequest,
  DriversLicenseImageVerificationRequest,
  DriversLicenseVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Driver's License Verification Service
 */
export class IdentityPassDriversLicenseService
  extends BaseIdentityPassService
  implements IDriversLicenseVerificationService
{
  async verifyDriversLicense(
    data: DriversLicenseVerificationRequest
  ): Promise<VerificationResponse<DriversLicenseVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/drivers_license',
      {
        number: data.licenseNumber,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
      },
      this.mapDriversLicenseData
    );
  }

  async verifyDriversLicenseAdvance(
    data: DriversLicenseAdvanceVerificationRequest
  ): Promise<VerificationResponse<DriversLicenseVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/drivers_license/advance',
      {
        number: data.licenseNumber,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
        include_history: data.includeHistory,
      },
      this.mapDriversLicenseData
    );
  }

  async verifyDriversLicenseWithFace(
    data: DriversLicenseWithFaceVerificationRequest
  ): Promise<VerificationResponse<DriversLicenseVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/drivers_license/face',
      {
        number: data.licenseNumber,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
        image: data.image,
      },
      this.mapDriversLicenseData
    );
  }

  async verifyDriversLicenseImage(
    data: DriversLicenseImageVerificationRequest
  ): Promise<VerificationResponse<DriversLicenseVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/drivers_license/image',
      {
        number: data.licenseNumber,
        image: data.image,
      },
      this.mapDriversLicenseData
    );
  }

  async verifyDriversLicenseV2(
    data: DriversLicenseVerificationRequest
  ): Promise<VerificationResponse<DriversLicenseVerificationData>> {
    return this.makeRequest(
      '/api/v2/biometrics/merchant/data/verification/drivers_license',
      {
        number: data.licenseNumber,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
      },
      this.mapDriversLicenseData
    );
  }

  private mapDriversLicenseData(verificationData: any, payload: any): DriversLicenseVerificationData {
    return {
      licenseNumber: verificationData.license_number || verificationData.licenseNumber || payload.number || '',
      firstName: verificationData.first_name || verificationData.firstname || verificationData.firstName || '',
      lastName: verificationData.last_name || verificationData.lastname || verificationData.lastName || '',
      middleName: verificationData.middle_name || verificationData.middlename || verificationData.middleName,
      dateOfBirth: verificationData.date_of_birth || verificationData.dob || verificationData.dateOfBirth || '',
      gender: verificationData.gender,
      stateOfIssue: verificationData.state_of_issue || verificationData.stateOfIssue,
      expiryDate: verificationData.expiry_date || verificationData.expiryDate,
      issueDate: verificationData.issue_date || verificationData.issueDate,
      photo: verificationData.photo || verificationData.image,
      address: verificationData.address,
      bloodGroup: verificationData.blood_group || verificationData.bloodGroup,
      ...verificationData,
    };
  }
}
