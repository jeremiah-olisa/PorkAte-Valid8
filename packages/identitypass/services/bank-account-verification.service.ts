import {
  IBankAccountVerificationService,
  BankAccountVerificationRequest,
  BankAccountAdvanceVerificationRequest,
  BankAccountComparisonRequest,
  BankAccountVerificationData,
  BankCode,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Bank Account Verification Service
 */
export class IdentityPassBankAccountService
  extends BaseIdentityPassService
  implements IBankAccountVerificationService
{
  async verifyBankAccount(
    data: BankAccountVerificationRequest
  ): Promise<VerificationResponse<BankAccountVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/bank_account',
      {
        account_number: data.accountNumber,
        bank_code: data.bankCode,
      },
      this.mapBankAccountData
    );
  }

  async verifyBankAccountAdvance(
    data: BankAccountAdvanceVerificationRequest
  ): Promise<VerificationResponse<BankAccountVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/bank_account/advance',
      {
        account_number: data.accountNumber,
        bank_code: data.bankCode,
        include_balance: data.includeBalance,
      },
      this.mapBankAccountData
    );
  }

  async compareBankAccount(
    data: BankAccountComparisonRequest
  ): Promise<VerificationResponse<BankAccountVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/bank_account/compare',
      {
        account_number: data.accountNumber,
        bank_code: data.bankCode,
        firstname: data.firstName,
        lastname: data.lastName,
      },
      this.mapBankAccountData
    );
  }

  async listBankCodes(): Promise<VerificationResponse<BankCode[]>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/bank_codes',
      {},
      (verificationData: any) => {
        if (Array.isArray(verificationData)) {
          return verificationData.map((item: any) => ({
            code: item.code || item.bank_code,
            name: item.name || item.bank_name,
          }));
        }
        return [];
      }
    );
  }

  private mapBankAccountData(verificationData: any, payload: any): BankAccountVerificationData {
    return {
      accountNumber: verificationData.account_number || verificationData.accountNumber || payload.account_number || '',
      accountName: verificationData.account_name || verificationData.accountName || '',
      bankCode: verificationData.bank_code || verificationData.bankCode || payload.bank_code || '',
      bankName: verificationData.bank_name || verificationData.bankName,
      accountType: verificationData.account_type || verificationData.accountType,
      balance: verificationData.balance,
      currency: verificationData.currency,
      ...verificationData,
    };
  }
}
