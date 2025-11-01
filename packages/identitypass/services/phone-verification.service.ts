import {
  IPhoneVerificationService,
  PhoneVerificationRequest,
  PhoneAdvanceVerificationRequest,
  PhoneVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Phone Number Verification Service
 */
export class IdentityPassPhoneService extends BaseIdentityPassService implements IPhoneVerificationService {
  async verifyPhoneNumber(data: PhoneVerificationRequest): Promise<VerificationResponse<PhoneVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/phone_number',
      {
        phone_number: data.phoneNumber,
      },
      this.mapPhoneData
    );
  }

  async verifyPhoneNumberAdvance(
    data: PhoneAdvanceVerificationRequest
  ): Promise<VerificationResponse<PhoneVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/phone_number/advance',
      {
        phone_number: data.phoneNumber,
        include_carrier_info: data.includeCarrierInfo,
      },
      this.mapPhoneData
    );
  }

  private mapPhoneData(verificationData: any, payload: any): PhoneVerificationData {
    return {
      phoneNumber: verificationData.phone_number || verificationData.phoneNumber || payload.phone_number || '',
      carrier: verificationData.carrier,
      lineType: verificationData.line_type || verificationData.lineType,
      status: verificationData.status,
      ownerName: verificationData.owner_name || verificationData.ownerName,
      network: verificationData.network,
      ...verificationData,
    };
  }
}
