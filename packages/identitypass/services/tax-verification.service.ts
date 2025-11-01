import {
  ITaxVerificationService,
  TINVerificationRequest,
  StampDutyVerificationRequest,
  TaxVerificationData,
  StampDutyVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Tax Verification Service
 */
export class IdentityPassTaxService extends BaseIdentityPassService implements ITaxVerificationService {
  async verifyTIN(data: TINVerificationRequest): Promise<VerificationResponse<TaxVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/tin',
      {
        number: data.tin,
        channel: data.channel,
      },
      this.mapTaxData
    );
  }

  async verifyStampDuty(
    data: StampDutyVerificationRequest
  ): Promise<VerificationResponse<StampDutyVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/stamp_duty',
      {
        reference_number: data.referenceNumber,
      },
      this.mapStampDutyData
    );
  }

  private mapTaxData(verificationData: any, payload: any): TaxVerificationData {
    return {
      tin: verificationData.tin || verificationData.number || payload.number,
      taxpayerName: verificationData.taxpayer_name || verificationData.taxpayerName,
      taxpayerType: verificationData.taxpayer_type || verificationData.taxpayerType,
      status: verificationData.status,
      registrationDate: verificationData.registration_date || verificationData.registrationDate,
      address: verificationData.address,
      taxOffice: verificationData.tax_office || verificationData.taxOffice,
      ...verificationData,
    };
  }

  private mapStampDutyData(verificationData: any, payload: any): StampDutyVerificationData {
    return {
      referenceNumber: verificationData.reference_number || verificationData.referenceNumber || payload.reference_number || '',
      amount: verificationData.amount || 0,
      status: verificationData.status || '',
      dateIssued: verificationData.date_issued || verificationData.dateIssued,
      description: verificationData.description,
      ...verificationData,
    };
  }
}
