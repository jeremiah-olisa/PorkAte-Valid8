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
export class IdentityPassNINService
  extends BaseIdentityPassService
  implements ININVerificationService
{
  /**
   * Verify NIN (National Identification Number) - Basic
   * @see https://docs.prembly.com/reference/nin-and-virtual-nin
   */
  async verifyNIN(
    data: NINVerificationRequest,
  ): Promise<VerificationResponse<NINVerificationData>> {
    return this.makeRequest(
      '/verification/vnin',
      {
        number_nin: data?.nin,
      },
      this.mapNINData,
    );
  }

  /**
   * Verify NIN with face matching
   * @see https://docs.prembly.com/docs/nin-with-face-copy
   */
  async verifyNINWithFace(
    data: NINWithFaceVerificationRequest,
  ): Promise<VerificationResponse<NINVerificationData>> {
    return this.makeRequest(
      '/verification/nin_w_face',
      {
        number: data?.nin,
        image: data?.image,
      },
      this.mapNINData,
    );
  }

  /**
   * Verify NIN Slip
   * @see https://docs.prembly.com/reference/nin-and-virtual-nin
   */
  async verifyNINSlip(
    data: NINSlipVerificationRequest,
  ): Promise<VerificationResponse<NINVerificationData>> {
    return this.makeRequest(
      '/verification/nin_slip',
      {
        number: data?.nin,
        slip_number: data?.slipNumber,
      },
      this.mapNINData,
    );
  }

  /**
   * Verify Virtual NIN - Basic
   * @see https://docs.prembly.com/docs/national-id-basic-1
   */
  async verifyVirtualNIN(
    data: VirtualNINVerificationRequest,
  ): Promise<VerificationResponse<NINVerificationData>> {
    return this.makeRequest(
      '/verification/vnin-basic',
      {
        number: data?.virtualNin,
      },
      this.mapNINData,
    );
  }

  /**
   * Map NIN API response to NINVerificationData
   * Handles various response field formats from Prembly API
   */
  private mapNINData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): NINVerificationData {
    return {
      nin:
        (verificationData?.nin as string) ||
        (verificationData?.number as string) ||
        (payload?.number_nin as string) ||
        (payload?.number as string),
      firstName:
        (verificationData?.firstname as string) ||
        (verificationData?.firstName as string) ||
        (verificationData?.pfirstname as string) ||
        '',
      lastName:
        (verificationData?.surname as string) ||
        (verificationData?.lastname as string) ||
        (verificationData?.lastName as string) ||
        (verificationData?.psurname as string) ||
        '',
      middleName:
        (verificationData?.middlename as string) ||
        (verificationData?.middleName as string) ||
        (verificationData?.pmiddlename as string),
      dateOfBirth:
        (verificationData?.birthdate as string) ||
        (verificationData?.dob as string) ||
        (verificationData?.dateOfBirth as string) ||
        '',
      gender: (verificationData?.gender as string) || '',
      phoneNumber:
        (verificationData?.telephoneno as string) || (verificationData?.phoneNumber as string),
      address:
        (verificationData?.residence_address as string) ||
        (verificationData?.residentialAddress as string) ||
        (verificationData?.address as string),
      photo: verificationData?.photo as string,
      maritalStatus:
        (verificationData?.maritalstatus as string) || (verificationData?.maritalStatus as string),
      nationality: verificationData?.nationality as string,
      stateOfOrigin:
        (verificationData?.birthstate as string) ||
        (verificationData?.self_origin_state as string) ||
        (verificationData?.stateOfOrigin as string),
      lga:
        (verificationData?.birthlga as string) ||
        (verificationData?.self_origin_lga as string) ||
        (verificationData?.lga as string),
      title: verificationData?.title as string,
      birthCountry: verificationData?.birthcountry as string,
      email: verificationData?.email as string,
      employmentStatus: verificationData?.employmentstatus as string,
      height: verificationData?.heigth as number,
      educationalLevel: verificationData?.educationallevel as string,
      profession: verificationData?.profession as string,
      religion: verificationData?.religion as string,
      residenceStatus: verificationData?.residencestatus as string,
      residenceState: verificationData?.residence_state as string,
      residenceLga: verificationData?.residence_lga as string,
      residenceTown: verificationData?.residence_town as string,
      selfOriginPlace: verificationData?.self_origin_place as string,
      spokenLanguage:
        (verificationData?.spoken_language as string) || (verificationData?.ospokenlang as string),
      signature: verificationData?.signature as string,
      trackingId: verificationData?.trackingId as string,
      ...verificationData,
    };
  }
}
