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
  /**
   * Verify Credit Bureau (Consumer/Individual) - Basic
   * @see https://docs.prembly.com/docs/credit-bureau-consumerindividual-basic-copy
   */
  async verifyCreditBureau(
    data: CreditBureauVerificationRequest,
  ): Promise<VerificationResponse<CreditBureauVerificationData>> {
    return this.makeRequest(
      '/verification/credit_bureau/consumer/basic',
      {
        mode: 'ID',
        number: data?.bvn,
        customer_name: `${data?.firstName} ${data?.lastName}`,
        customer_reference: data?.phoneNumber,
        crb_provider: 'crc', // default provider
      },
      this.mapCreditBureauData,
    );
  }

  /**
   * Verify Credit Bureau Consumer (Individual) - Basic
   * @see https://docs.prembly.com/docs/credit-bureau-consumerindividual-basic-copy
   */
  async verifyCreditBureauConsumerBasic(
    data: CreditBureauConsumerBasicRequest,
  ): Promise<VerificationResponse<CreditBureauVerificationData>> {
    return this.makeRequest(
      '/verification/credit_bureau/consumer/basic',
      {
        mode: 'ID',
        number: data?.bvn,
        customer_name: `${data?.firstName} ${data?.lastName}`,
        customer_reference: data?.phoneNumber,
        crb_provider: 'crc', // default provider
      },
      this.mapCreditBureauData,
    );
  }

  /**
   * Verify Credit Bureau Consumer (Individual) - Advance
   * @see https://docs.prembly.com/docs/credit-bureau-consumerindividual-advance-copy-1
   */
  async verifyCreditBureauConsumerAdvance(
    data: CreditBureauConsumerAdvanceRequest,
  ): Promise<VerificationResponse<CreditBureauVerificationData>> {
    return this.makeRequest(
      '/verification/credit_bureau/consumer/advance',
      {
        mode: 'ID',
        number: data?.bvn,
        customer_name: `${data?.firstName} ${data?.lastName}`,
        customer_reference: data?.phoneNumber,
        crb_provider: 'crc', // default provider
      },
      this.mapCreditBureauData,
    );
  }

  /**
   * Verify Credit Bureau Commercial (Business) - Basic
   * @see https://docs.prembly.com/docs/credit-bureau-commercialbusiness-basic-copy-1
   */
  async verifyCreditBureauCommercialBasic(
    data: CreditBureauCommercialBasicRequest,
  ): Promise<VerificationResponse<CreditBureauVerificationData>> {
    return this.makeRequest(
      '/verification/credit_bureau/commercial/basic',
      {
        rc_number: data?.rcNumber,
        customer_name: data?.companyName,
      },
      this.mapCreditBureauData,
    );
  }

  /**
   * Verify Credit Bureau Commercial (Business) - Advance
   * @see https://docs.prembly.com/docs/credit-bureau-commercialbusiness-advance-copy-1
   */
  async verifyCreditBureauCommercialAdvance(
    data: CreditBureauCommercialAdvanceRequest,
  ): Promise<VerificationResponse<CreditBureauVerificationData>> {
    return this.makeRequest(
      '/verification/credit_bureau/commercial/advance',
      {
        rc_number: data?.rcNumber,
        customer_name: data?.companyName,
      },
      this.mapCreditBureauData,
    );
  }

  private mapCreditBureauData(
    verificationData: Record<string, unknown>,
  ): CreditBureauVerificationData {
    const creditHistory = verificationData?.credit_history || verificationData?.creditHistory;
    const defaultRecords = verificationData?.default_records || verificationData?.defaultRecords;
    const score = verificationData?.score as Record<string, unknown> | undefined;

    return {
      creditScore: (verificationData?.credit_score || verificationData?.creditScore) as
        | number
        | undefined,
      creditHistory: Array.isArray(creditHistory)
        ? creditHistory.map((item: Record<string, unknown>) => ({
            lender: (item?.lender as string) || '',
            amount: (item?.amount as number) || 0,
            status: (item?.status as string) || '',
            date: item?.date as string | undefined,
            ...item,
          }))
        : undefined,
      defaultRecords: Array.isArray(defaultRecords)
        ? defaultRecords.map((item: Record<string, unknown>) => ({
            lender: (item?.lender as string) || '',
            amount: (item?.amount as number) || 0,
            date: item?.date as string | undefined,
            ...item,
          }))
        : undefined,
      activeLoans: (verificationData?.active_loans || verificationData?.activeLoans) as
        | number
        | undefined,
      totalDebt: (verificationData?.total_debt || verificationData?.totalDebt) as
        | number
        | undefined,
      // Consumer fields
      bvn: (verificationData?.bvn || verificationData?.BankVerificationNo) as string | undefined,
      name: (verificationData?.name || verificationData?.fullName || verificationData?.Surname) as
        | string
        | undefined,
      phone: (verificationData?.phone ||
        verificationData?.phoneNumber ||
        verificationData?.HomeTelephoneNo ||
        verificationData?.CellularNo) as string | undefined,
      gender: (verificationData?.gender || verificationData?.Gender) as string | undefined,
      dateOfBirth: (verificationData?.dateOfBirth ||
        verificationData?.date_of_birth ||
        verificationData?.BirthDate) as string | undefined,
      address: (verificationData?.address || verificationData?.ResidentialAddress1) as
        | string
        | undefined,
      email: (verificationData?.email || verificationData?.EmailAddress) as string | undefined,
      // Commercial fields
      businessName: (verificationData?.businessName || verificationData?.BusinessName) as
        | string
        | undefined,
      rcNumber: (verificationData?.rcNumber ||
        verificationData?.rc_number ||
        verificationData?.BusinessRegistrationNumber) as string | undefined,
      taxIdentificationNumber: (verificationData?.taxIdentificationNumber ||
        verificationData?.TaxIdentificationNumber) as string | undefined,
      // Advanced scoring (CRC)
      totalNoOfLoans: (verificationData?.totalNoOfLoans || score?.totalNoOfLoans) as
        | string
        | undefined,
      totalNoOfActiveLoans: (verificationData?.totalNoOfActiveLoans ||
        score?.totalNoOfActiveLoans) as string | undefined,
      totalBorrowed: (verificationData?.totalBorrowed || score?.totalBorrowed) as
        | string
        | undefined,
      totalOutstanding: (verificationData?.totalOutstanding || score?.totalOutstanding) as
        | string
        | undefined,
      totalOverdue: (verificationData?.totalOverdue || score?.totalOverdue) as string | undefined,
      // First Central specific fields
      consumerScore: (verificationData?.consumerScore || verificationData?.TotalConsumerScore) as
        | string
        | undefined,
      riskDescription: (verificationData?.riskDescription || verificationData?.Description) as
        | string
        | undefined,
      ...verificationData,
    };
  }
}
