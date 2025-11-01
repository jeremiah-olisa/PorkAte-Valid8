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
export class IdentityPassPhoneService
  extends BaseIdentityPassService
  implements IPhoneVerificationService
{
  /**
   * Verify Phone Number (Basic)
   * Returns basic information linked to phone number
   * @see https://docs.prembly.com/docs/basic-phone-number-copy
   */
  async verifyPhoneNumber(
    data: PhoneVerificationRequest,
  ): Promise<VerificationResponse<PhoneVerificationData>> {
    return this.makeRequest(
      '/verification/phone_number',
      {
        number: data?.phoneNumber,
      },
      this.mapPhoneData,
    );
  }

  /**
   * Verify Phone Number (Advance)
   * Returns full NIN data linked to phone number
   * @see https://docs.prembly.com/docs/advance-phone-number-copy
   */
  async verifyPhoneNumberAdvance(
    data: PhoneAdvanceVerificationRequest,
  ): Promise<VerificationResponse<PhoneVerificationData>> {
    return this.makeRequest(
      '/verification/phone_number/advance',
      {
        number: data?.phoneNumber,
      },
      this.mapPhoneData,
    );
  }

  /**
   * Map Phone API response to PhoneVerificationData
   * Handles various response field formats from Prembly API
   */
  private mapPhoneData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): PhoneVerificationData {
    return {
      phoneNumber:
        (verificationData?.phone_number as string) ||
        (verificationData?.phoneNumber as string) ||
        (verificationData?.telephoneno as string) ||
        (payload?.number as string) ||
        '',
      carrier: verificationData?.carrier as string,
      lineType: (verificationData?.line_type as string) || (verificationData?.lineType as string),
      status: verificationData?.status as string,
      ownerName:
        (verificationData?.owner_name as string) || (verificationData?.ownerName as string),
      network: verificationData?.network as string,
      // NIN-related fields from advance endpoint
      nin: verificationData?.nin as string,
      firstName:
        (verificationData?.firstname as string) ||
        (verificationData?.firstName as string) ||
        (verificationData?.pfirstname as string),
      lastName:
        (verificationData?.surname as string) ||
        (verificationData?.lastName as string) ||
        (verificationData?.psurname as string),
      middleName:
        (verificationData?.middlename as string) ||
        (verificationData?.middleName as string) ||
        (verificationData?.pmiddlename as string),
      dateOfBirth:
        (verificationData?.dateOfBirth as string) || (verificationData?.birthdate as string),
      gender: verificationData?.gender as string,
      email: verificationData?.email as string,
      title: verificationData?.title as string,
      maritalStatus:
        (verificationData?.maritalstatus as string) || (verificationData?.maritalStatus as string),
      employmentStatus:
        (verificationData?.employmentstatus as string) ||
        (verificationData?.employmentStatus as string),
      educationalLevel:
        (verificationData?.educationallevel as string) ||
        (verificationData?.educationalLevel as string),
      profession: verificationData?.profession as string,
      religion: verificationData?.religion as string,
      height: verificationData?.heigth as number, // Note: API has typo "heigth"
      photo: verificationData?.photo as string,
      signature: verificationData?.signature as string,
      // Birth location
      birthCountry:
        (verificationData?.birthcountry as string) || (verificationData?.birthCountry as string),
      birthState:
        (verificationData?.birthstate as string) || (verificationData?.birthState as string),
      birthLga: (verificationData?.birthlga as string) || (verificationData?.birthLga as string),
      // Residence information
      residenceAddress:
        (verificationData?.residence_address as string) ||
        (verificationData?.residenceAddress as string),
      residenceTown:
        (verificationData?.residence_town as string) || (verificationData?.residenceTown as string),
      residenceLga:
        (verificationData?.residence_lga as string) || (verificationData?.residenceLga as string),
      residenceState:
        (verificationData?.residence_state as string) ||
        (verificationData?.residenceState as string),
      residenceStatus:
        (verificationData?.residencestatus as string) ||
        (verificationData?.residenceStatus as string),
      // Self origin
      selfOriginLga:
        (verificationData?.self_origin_lga as string) ||
        (verificationData?.selfOriginLga as string),
      selfOriginPlace:
        (verificationData?.self_origin_place as string) ||
        (verificationData?.selfOriginPlace as string),
      selfOriginState:
        (verificationData?.self_origin_state as string) ||
        (verificationData?.selfOriginState as string),
      // Next of Kin (NOK)
      nokFirstName:
        (verificationData?.nok_firstname as string) || (verificationData?.nokFirstName as string),
      nokMiddleName:
        (verificationData?.nok_middlename as string) || (verificationData?.nokMiddleName as string),
      nokSurname:
        (verificationData?.nok_surname as string) || (verificationData?.nokSurname as string),
      nokAddress1:
        (verificationData?.nok_address1 as string) || (verificationData?.nokAddress1 as string),
      nokAddress2:
        (verificationData?.nok_address2 as string) || (verificationData?.nokAddress2 as string),
      nokTown: (verificationData?.nok_town as string) || (verificationData?.nokTown as string),
      nokLga: (verificationData?.nok_lga as string) || (verificationData?.nokLga as string),
      nokState: (verificationData?.nok_state as string) || (verificationData?.nokState as string),
      nokPostalCode:
        (verificationData?.nok_postalcode as string) || (verificationData?.nokPostalCode as string),
      // Additional fields
      spokenLanguage:
        (verificationData?.spoken_language as string) ||
        (verificationData?.spokenLanguage as string) ||
        (verificationData?.ospokenlang as string),
      trackingId:
        (verificationData?.trackingId as string) || (verificationData?.tracking_id as string),
      ...verificationData,
    };
  }
}
