import {
  IPassportVerificationService,
  PassportVerificationRequest,
  PassportWithFaceVerificationRequest,
  PassportImageVerificationRequest,
  PassportVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass International Passport Verification Service
 */
export class IdentityPassPassportService extends BaseIdentityPassService implements IPassportVerificationService {
  async verifyPassport(data: PassportVerificationRequest): Promise<VerificationResponse<PassportVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/passport',
      {
        number: data.passportNumber,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
      },
      this.mapPassportData
    );
  }

  async verifyPassportV2(data: PassportVerificationRequest): Promise<VerificationResponse<PassportVerificationData>> {
    return this.makeRequest(
      '/api/v2/biometrics/merchant/data/verification/passport',
      {
        number: data.passportNumber,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
      },
      this.mapPassportData
    );
  }

  async verifyPassportWithFace(
    data: PassportWithFaceVerificationRequest
  ): Promise<VerificationResponse<PassportVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/passport/face',
      {
        number: data.passportNumber,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
        image: data.image,
      },
      this.mapPassportData
    );
  }

  async verifyPassportImage(
    data: PassportImageVerificationRequest
  ): Promise<VerificationResponse<PassportVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/passport/image',
      {
        number: data.passportNumber,
        image: data.image,
      },
      this.mapPassportData
    );
  }

  private mapPassportData(verificationData: any, payload: any): PassportVerificationData {
    return {
      passportNumber: verificationData.passport_number || verificationData.passportNumber || payload.number || '',
      firstName: verificationData.first_name || verificationData.firstname || verificationData.firstName || '',
      lastName: verificationData.last_name || verificationData.lastname || verificationData.lastName || '',
      middleName: verificationData.middle_name || verificationData.middlename || verificationData.middleName,
      dateOfBirth: verificationData.date_of_birth || verificationData.dob || verificationData.dateOfBirth || '',
      gender: verificationData.gender,
      nationality: verificationData.nationality,
      expiryDate: verificationData.expiry_date || verificationData.expiryDate,
      issueDate: verificationData.issue_date || verificationData.issueDate,
      photo: verificationData.photo || verificationData.image,
      placeOfIssue: verificationData.place_of_issue || verificationData.placeOfIssue,
      ...verificationData,
    };
  }
}
