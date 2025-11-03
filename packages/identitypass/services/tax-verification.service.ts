import {
  ITaxVerificationService,
  TINVerificationRequest,
  StampDutyVerificationRequest,
  TaxVerificationData,
  StampDutyVerificationData,
  VerificationResponse,
} from 'porkate-valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Tax Verification Service
 */
export class IdentityPassTaxService extends BaseIdentityPassService implements ITaxVerificationService {
  /**
   * Verify Tax Identification Number (TIN)
   * Can verify by TIN, CAC RC number, or Phone number
   * @see https://docs.prembly.com/docs/tax-identification-number-tin-copy
   */
  async verifyTIN(data: TINVerificationRequest): Promise<VerificationResponse<TaxVerificationData>> {
    return this.makeRequest(
      '/verification/tin',
      {
        number: data?.tin,
        channel: data?.channel || 'TIN', // TIN, CAC, or PHONE
      },
      this.mapTaxData
    );
  }

  /**
   * Verify Stamp Duty Certificate
   * @see https://docs.prembly.com/docs/stamp-duty-copy
   */
  async verifyStampDuty(
    data: StampDutyVerificationRequest
  ): Promise<VerificationResponse<StampDutyVerificationData>> {
    return this.makeRequest(
      '/verification/stamp_duty',
      {
        number: data?.referenceNumber,
      },
      this.mapStampDutyData
    );
  }

  /**
   * Map Tax API response to TaxVerificationData
   * Handles various response field formats from Prembly API
   */
  private mapTaxData(verificationData: Record<string, unknown>, payload: Record<string, unknown>): TaxVerificationData {
    return {
      tin: (verificationData?.tin as string) || (verificationData?.firstin as string) || (verificationData?.jittin as string) || (payload?.number as string),
      taxpayerName: (verificationData?.taxpayer_name as string) || (verificationData?.taxpayerName as string),
      taxpayerType: (verificationData?.taxpayer_type as string) || (verificationData?.taxpayerType as string),
      status: verificationData?.status as string,
      registrationDate: (verificationData?.registration_date as string) || (verificationData?.registrationDate as string),
      address: verificationData?.address as string,
      taxOffice: (verificationData?.tax_office as string) || (verificationData?.taxOffice as string),
      cacRegNumber: (verificationData?.cac_reg_number as string) || (verificationData?.cacRegNumber as string),
      firstin: verificationData?.firstin as string,
      jittin: verificationData?.jittin as string,
      phoneNumber: (verificationData?.phone_number as string) || (verificationData?.phoneNumber as string),
      email: verificationData?.email as string,
      ...verificationData,
    };
  }

  /**
   * Map Stamp Duty API response to StampDutyVerificationData
   * Handles various response field formats from Prembly API
   */
  private mapStampDutyData(verificationData: Record<string, unknown>, payload: Record<string, unknown>): StampDutyVerificationData {
    return {
      referenceNumber: (verificationData?.reference_number as string) || (verificationData?.referenceNumber as string) || (verificationData?.certificate_number as string) || (payload?.number as string) || '',
      amount: typeof verificationData?.amount === 'number' ? verificationData?.amount : 0,
      status: verificationData?.status as string || '',
      dateIssued: (verificationData?.date_issued as string) || (verificationData?.dateIssued as string) || (verificationData?.issuance_date as string),
      description: verificationData?.description as string,
      certificateNumber: (verificationData?.certificate_number as string) || (verificationData?.certificateNumber as string),
      instrument: verificationData?.instrument as string,
      reservedCompanyName: (verificationData?.reserved_company_name as string) || (verificationData?.reservedCompanyName as string),
      consideration: verificationData?.consideration as string,
      stampDutyPaid: (verificationData?.stamp_duty_paid as string) || (verificationData?.stampDutyPaid as string),
      paymentReference: (verificationData?.payment_reference as string) || (verificationData?.paymentReference as string),
      beneficiary: verificationData?.beneficiary as string,
      beneficiaryTin: (verificationData?.beneficiary_tin as string) || (verificationData?.beneficiaryTin as string),
      dateOfExecution: (verificationData?.date_of_execution as string) || (verificationData?.dateOfExecution as string),
      dateOfFiling: (verificationData?.date_of_filing as string) || (verificationData?.dateOfFiling as string),
      issuanceDate: (verificationData?.issuance_date as string) || (verificationData?.issuanceDate as string),
      ...verificationData,
    };
  }
}
