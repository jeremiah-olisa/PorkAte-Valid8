import {
  IVotersCardVerificationService,
  VotersCardVerificationRequest,
  VotersCardVerificationData,
  VerificationResponse,
} from 'porkate-valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Voter's Card Verification Service
 */
export class IdentityPassVotersCardService
  extends BaseIdentityPassService
  implements IVotersCardVerificationService
{
  /**
   * Verify Voter's Card
   * @see https://docs.prembly.com/docs/voters-identification-number-copy
   */
  async verifyVotersCard(
    data: VotersCardVerificationRequest,
  ): Promise<VerificationResponse<VotersCardVerificationData>> {
    return this.makeRequest(
      '/verification/voters_card',
      {
        number: data?.vin,
      },
      this.mapVotersCardData,
    );
  }

  private mapVotersCardData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): VotersCardVerificationData {
    return {
      vin: (verificationData?.vin || verificationData?.number || payload?.number || '') as string,
      firstName: (verificationData?.first_name ||
        verificationData?.firstname ||
        verificationData?.firstName ||
        '') as string,
      lastName: (verificationData?.last_name ||
        verificationData?.lastname ||
        verificationData?.lastName ||
        '') as string,
      fullName: (verificationData?.fullName || verificationData?.full_name) as string | undefined,
      gender: (verificationData?.gender || verificationData?.Gender) as string | undefined,
      dateOfBirth: (verificationData?.date_of_birth ||
        verificationData?.dob ||
        verificationData?.dateOfBirth) as string | undefined,
      state: (verificationData?.state || verificationData?.State) as string | undefined,
      lga: (verificationData?.lga || verificationData?.Lga || verificationData?.LGA) as
        | string
        | undefined,
      address: (verificationData?.address || verificationData?.Address) as string | undefined,
      pollingUnit: (verificationData?.polling_unit ||
        verificationData?.pollingUnit ||
        verificationData?.PollingUnit) as string | undefined,
      pollingUnitCode: (verificationData?.polling_unit_code ||
        verificationData?.pollingUnitCode ||
        verificationData?.PollingUnitCode) as string | undefined,
      registrationDate: (verificationData?.registration_date ||
        verificationData?.registrationDate) as string | undefined,
      timeOfRegistration: (verificationData?.time_of_registration ||
        verificationData?.timeOfRegistration) as string | undefined,
      registrationAreaWard: (verificationData?.registration_area_ward ||
        verificationData?.registrationAreaWard) as string | undefined,
      occupation: (verificationData?.occupation || verificationData?.Occupation) as
        | string
        | undefined,
      photo: (verificationData?.photo || verificationData?.Photo) as string | undefined,
      phoneNumber: (verificationData?.phone_number || verificationData?.phoneNumber) as
        | string
        | undefined,
      country: (verificationData?.country || verificationData?.Country) as string | undefined,
      ...verificationData,
    };
  }
}
