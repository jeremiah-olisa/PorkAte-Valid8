import {
  ININVerificationService,
  NINVerificationRequest,
  NINWithFaceVerificationRequest,
  NINSlipVerificationRequest,
  VirtualNINVerificationRequest,
  NINVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass NIN Verification Service
 */
export class IdentityPassNINService extends BaseIdentityPassService implements ININVerificationService {
  async verifyNIN(data: NINVerificationRequest): Promise<VerificationResponse<NINVerificationData>> {
    return this.makeRequest(
      '/api/v2/biometrics/merchant/data/verification/nin',
      {
        number: data.nin,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
      },
      this.mapNINData
    );
  }

  async verifyNINWithFace(data: NINWithFaceVerificationRequest): Promise<VerificationResponse<NINVerificationData>> {
    return this.makeRequest(
      '/api/v2/biometrics/merchant/data/verification/nin_face',
      {
        number: data.nin,
        firstname: data.firstName,
        lastname: data.lastName,
        dob: data.dateOfBirth,
        image: data.image,
      },
      this.mapNINData
    );
  }

  async verifyNINSlip(data: NINSlipVerificationRequest): Promise<VerificationResponse<NINVerificationData>> {
    return this.makeRequest(
      '/api/v2/biometrics/merchant/data/verification/nin_slip',
      {
        number: data.nin,
        slip_number: data.slipNumber,
      },
      this.mapNINData
    );
  }

  async verifyVirtualNIN(data: VirtualNINVerificationRequest): Promise<VerificationResponse<NINVerificationData>> {
    return this.makeRequest(
      '/api/v2/biometrics/merchant/data/verification/vnin',
      {
        number: data.virtualNin,
        firstname: data.firstName,
        lastname: data.lastName,
      },
      this.mapNINData
    );
  }

  private mapNINData(verificationData: any, payload: any): NINVerificationData {
    return {
      nin: verificationData.nin || verificationData.number || payload.number,
      firstName: verificationData.firstname || verificationData.firstName || '',
      lastName: verificationData.lastname || verificationData.lastName || '',
      middleName: verificationData.middlename || verificationData.middleName,
      dateOfBirth: verificationData.birthdate || verificationData.dob || verificationData.dateOfBirth || '',
      gender: verificationData.gender || '',
      phoneNumber: verificationData.telephoneno || verificationData.phoneNumber,
      address: verificationData.residence_address || verificationData.address,
      photo: verificationData.photo,
      maritalStatus: verificationData.maritalstatus || verificationData.maritalStatus,
      nationality: verificationData.nationality,
      stateOfOrigin: verificationData.birthstate || verificationData.stateOfOrigin,
      lga: verificationData.birthlga || verificationData.lga,
      ...verificationData,
    };
  }
}
