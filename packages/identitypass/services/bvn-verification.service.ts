import {
  IBVNVerificationService,
  BVNVerificationRequest,
  BVNWithFaceVerificationRequest,
  BVNAdvanceVerificationRequest,
  BVNByPhoneNumberRequest,
  BVNVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass BVN Verification Service
 */
export class IdentityPassBVNService extends BaseIdentityPassService implements IBVNVerificationService {
  async verifyBVN(data: BVNVerificationRequest): Promise<VerificationResponse<BVNVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/bvn',
      {
        number: data.bvn,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
      },
      this.mapBVNData
    );
  }

  async verifyBVNAdvance(data: BVNAdvanceVerificationRequest): Promise<VerificationResponse<BVNVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/bvn/advance',
      {
        number: data.bvn,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
      },
      this.mapBVNData
    );
  }

  async verifyBVNWithFace(data: BVNWithFaceVerificationRequest): Promise<VerificationResponse<BVNVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/bvn/face',
      {
        number: data.bvn,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
        image: data.image,
      },
      this.mapBVNData
    );
  }

  async getBVNByPhoneNumber(data: BVNByPhoneNumberRequest): Promise<VerificationResponse<BVNVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/bvn/phone',
      {
        phone_number: data.phoneNumber,
      },
      this.mapBVNData
    );
  }

  private mapBVNData(verificationData: any, payload: any): BVNVerificationData {
    return {
      bvn: verificationData.bvn || verificationData.number || payload.number,
      firstName: verificationData.first_name || verificationData.firstname || verificationData.firstName || '',
      lastName: verificationData.last_name || verificationData.lastname || verificationData.lastName || '',
      middleName: verificationData.middle_name || verificationData.middlename || verificationData.middleName,
      dateOfBirth: verificationData.date_of_birth || verificationData.dob || verificationData.dateOfBirth || '',
      phoneNumber: verificationData.phone_number || verificationData.phoneNumber,
      email: verificationData.email,
      gender: verificationData.gender,
      address: verificationData.residential_address || verificationData.address,
      photo: verificationData.photo || verificationData.image,
      enrollmentBank: verificationData.enrollment_bank || verificationData.enrollmentBank,
      enrollmentBranch: verificationData.enrollment_branch || verificationData.enrollmentBranch,
      registrationDate: verificationData.registration_date || verificationData.registrationDate,
      watchListed: verificationData.watch_listed || verificationData.watchListed,
      ...verificationData,
    };
  }
}
