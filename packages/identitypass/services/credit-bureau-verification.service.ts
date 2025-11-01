import {
  ICreditBureauVerificationService,
  CreditBureauVerificationRequest,
  CreditBureauConsumerBasicRequest,
  CreditBureauConsumerAdvanceRequest,
  CreditBureauCommercialBasicRequest,
  CreditBureauCommercialAdvanceRequest,
  CreditBureauVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Credit Bureau Verification Service
 */
export class IdentityPassCreditBureauService
  extends BaseIdentityPassService
  implements ICreditBureauVerificationService
{
  async verifyCreditBureau(
    data: CreditBureauVerificationRequest
  ): Promise<VerificationResponse<CreditBureauVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/credit_bureau',
      {
        bvn: data.bvn,
        phone_number: data.phoneNumber,
        firstname: data.firstName,
        lastname: data.lastName,
      },
      this.mapCreditBureauData
    );
  }

  async verifyCreditBureauConsumerBasic(
    data: CreditBureauConsumerBasicRequest
  ): Promise<VerificationResponse<CreditBureauVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/credit_bureau/consumer/basic',
      {
        bvn: data.bvn,
        phone_number: data.phoneNumber,
        firstname: data.firstName,
        lastname: data.lastName,
      },
      this.mapCreditBureauData
    );
  }

  async verifyCreditBureauConsumerAdvance(
    data: CreditBureauConsumerAdvanceRequest
  ): Promise<VerificationResponse<CreditBureauVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/credit_bureau/consumer/advance',
      {
        bvn: data.bvn,
        phone_number: data.phoneNumber,
        firstname: data.firstName,
        lastname: data.lastName,
        include_history: data.includeHistory,
      },
      this.mapCreditBureauData
    );
  }

  async verifyCreditBureauCommercialBasic(
    data: CreditBureauCommercialBasicRequest
  ): Promise<VerificationResponse<CreditBureauVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/credit_bureau/commercial/basic',
      {
        company_name: data.companyName,
        rc_number: data.rcNumber,
      },
      this.mapCreditBureauData
    );
  }

  async verifyCreditBureauCommercialAdvance(
    data: CreditBureauCommercialAdvanceRequest
  ): Promise<VerificationResponse<CreditBureauVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/credit_bureau/commercial/advance',
      {
        company_name: data.companyName,
        rc_number: data.rcNumber,
        include_history: data.includeHistory,
      },
      this.mapCreditBureauData
    );
  }

  private mapCreditBureauData(verificationData: any, _payload: any): CreditBureauVerificationData {
    return {
      creditScore: verificationData.credit_score || verificationData.creditScore,
      creditHistory: verificationData.credit_history?.map((item: any) => ({
        lender: item.lender,
        amount: item.amount,
        status: item.status,
        date: item.date,
        ...item,
      })),
      defaultRecords: verificationData.default_records?.map((item: any) => ({
        lender: item.lender,
        amount: item.amount,
        date: item.date,
        ...item,
      })),
      activeLoans: verificationData.active_loans || verificationData.activeLoans,
      totalDebt: verificationData.total_debt || verificationData.totalDebt,
      ...verificationData,
    };
  }
}
