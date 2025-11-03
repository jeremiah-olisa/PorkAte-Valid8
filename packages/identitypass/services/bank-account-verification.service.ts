import {
  IBankAccountVerificationService,
  BankAccountVerificationRequest,
  BankAccountAdvanceVerificationRequest,
  BankAccountComparisonRequest,
  BankAccountVerificationData,
  BankCode,
  VerificationResponse,
} from 'porkate-valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Bank Account Verification Service
 */
export class IdentityPassBankAccountService
  extends BaseIdentityPassService
  implements IBankAccountVerificationService
{
  /**
   * Verify Bank Account Number (Basic)
   * @see https://docs.prembly.com/docs/bank-accounts-basic-copy
   */
  async verifyBankAccount(
    data: BankAccountVerificationRequest
  ): Promise<VerificationResponse<BankAccountVerificationData>> {
    return this.makeRequest(
      '/verification/bank_account/basic',
      {
        number: data?.accountNumber,
        bank_code: data?.bankCode,
      },
      this.mapBankAccountData
    );
  }

  /**
   * Retrieve Financial Accounts Linked to BVN (Advance)
   * This is a multi-step process (Initialize → Get Consent → Retrieve)
   * @see https://docs.prembly.com/docs/financial-accounts-advance-copy
   * @deprecated This method requires multi-step OTP flow - use verifyBankAccount for simple verification
   */
  async verifyBankAccountAdvance(
    data: BankAccountAdvanceVerificationRequest
  ): Promise<VerificationResponse<BankAccountVerificationData>> {
    return this.makeRequest(
      '/verification/list/financial_accounts/advance',
      {
        number: data?.accountNumber,
        verify_with: data?.includeBalance, // This needs proper implementation for OTP flow
      },
      this.mapBankAccountData
    );
  }

  /**
   * Compare Bank Account with Name
   * @see https://docs.prembly.com/docs/bank-accounts-comparism-copy
   */
  async compareBankAccount(
    data: BankAccountComparisonRequest
  ): Promise<VerificationResponse<BankAccountVerificationData>> {
    return this.makeRequest(
      '/verification/bank_account/comparism',
      {
        number: data?.accountNumber,
        bank_code: data?.bankCode,
        customer_name: `${data?.firstName} ${data?.lastName}`,
      },
      this.mapBankAccountData
    );
  }

  /**
   * List Bank Codes
   * @see https://docs.prembly.com/docs/list-bank-codes-copy
   */
  async listBankCodes(): Promise<VerificationResponse<BankCode[]>> {
    return this.makeRequest(
      '/verification/bank_account/bank_code',
      {},
      (verificationData: Record<string, unknown>) => {
        if (Array.isArray(verificationData)) {
          return verificationData?.map((item: Record<string, unknown>) => ({
            code: (item?.code as string) || (item?.bank_code as string) || (item?.longcode as string),
            name: (item?.name as string) || (item?.bank_name as string),
          }));
        }
        return [];
      }
    );
  }

  /**
   * Map Bank Account API response to BankAccountVerificationData
   * Handles various response field formats from Prembly API
   */
  private mapBankAccountData(verificationData: Record<string, unknown>, payload: Record<string, unknown>): BankAccountVerificationData {
    // Handle account_data nested structure from comparism endpoint
    const accountData = verificationData?.account_data as Record<string, unknown> || {};
    
    return {
      accountNumber: (accountData?.account_number as string) || (verificationData?.account_number as string) || (verificationData?.accountNumber as string) || (payload?.number as string) || (payload?.account_number as string) || '',
      accountName: (accountData?.account_name as string) || (verificationData?.account_name as string) || (verificationData?.accountName as string) || (verificationData?.accountname as string) || '',
      bankCode: (accountData?.bank_code as string) || (verificationData?.bank_code as string) || (verificationData?.bankCode as string) || (payload?.bank_code as string) || '',
      bankName: (verificationData?.bank_name as string) || (verificationData?.bankName as string) || (verificationData?.bankname as string),
      accountType: (verificationData?.account_type as string) || (verificationData?.accountType as string) || (verificationData?.accounttype as string) || (verificationData?.AccountTypeName as string),
      balance: typeof verificationData?.balance === 'number' ? verificationData?.balance : (typeof verificationData?.balance === 'string' ? parseFloat(verificationData?.balance) : undefined),
      currency: verificationData?.currency as string,
      accountDesignation: (verificationData?.accountDesignation as number) || (verificationData?.AccountDesignationName as string),
      accountStatus: (verificationData?.accountstatus as number) || (verificationData?.AccountStatusName as string),
      institution: verificationData?.institution as number,
      branch: verificationData?.branch as string,
      accountTier: verificationData?.accounttier as number,
      bankType: verificationData?.bankType as string,
      bankId: (accountData?.bank_id as number) || (verificationData?.bank_id as number),
      ...verificationData,
    };
  }
}
