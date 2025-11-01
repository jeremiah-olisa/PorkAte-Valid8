import {
  IVotersCardVerificationService,
  VotersCardVerificationRequest,
  VotersCardVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Voter's Card Verification Service
 */
export class IdentityPassVotersCardService extends BaseIdentityPassService implements IVotersCardVerificationService {
  async verifyVotersCard(
    data: VotersCardVerificationRequest
  ): Promise<VerificationResponse<VotersCardVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/voter',
      {
        number: data.vin,
        firstname: data.firstName,
        lastname: data.lastName,
        state: data.state,
      },
      this.mapVotersCardData
    );
  }

  private mapVotersCardData(verificationData: any, payload: any): VotersCardVerificationData {
    return {
      vin: verificationData.vin || verificationData.number || payload.number || '',
      firstName: verificationData.first_name || verificationData.firstname || verificationData.firstName || '',
      lastName: verificationData.last_name || verificationData.lastname || verificationData.lastName || '',
      gender: verificationData.gender,
      dateOfBirth: verificationData.date_of_birth || verificationData.dob || verificationData.dateOfBirth,
      state: verificationData.state,
      lga: verificationData.lga,
      pollingUnit: verificationData.polling_unit || verificationData.pollingUnit,
      registrationDate: verificationData.registration_date || verificationData.registrationDate,
      occupation: verificationData.occupation,
      ...verificationData,
    };
  }
}
