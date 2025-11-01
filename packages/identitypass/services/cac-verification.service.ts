import {
  ICACVerificationService,
  CACVerificationRequest,
  CACAdvanceVerificationRequest,
  CompanySearchByNameRequest,
  CompanySearchByPersonRequest,
  CompanySearchByRegistrationNumberRequest,
  CACVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass CAC (Corporate Affairs Commission) Verification Service
 */
export class IdentityPassCACService
  extends BaseIdentityPassService
  implements ICACVerificationService
{
  /**
   * Verify CAC (Corporate Affairs Commission) - Basic
   * @see https://docs.prembly.com/docs/basic-cac-copy
   */
  async verifyCAC(
    data: CACVerificationRequest,
  ): Promise<VerificationResponse<CACVerificationData>> {
    return this.makeRequest(
      '/verification/cac',
      {
        rc_number: data?.rcNumber || data?.bnNumber,
        company_name: data?.companyName,
      },
      this.mapCACData,
    );
  }

  /**
   * Verify CAC - Advance (with detailed director information)
   * @see https://docs.prembly.com/docs/advance-cac-copy
   */
  async verifyCACAdvance(
    data: CACAdvanceVerificationRequest,
  ): Promise<VerificationResponse<CACVerificationData>> {
    return this.makeRequest(
      '/verification/cac/advance',
      {
        rc_number: data?.rcNumber || data?.bnNumber,
        company_name: data?.companyName,
      },
      this.mapCACData,
    );
  }

  /**
   * Search company by name across multiple countries
   * @see https://docs.prembly.com/docs/company-search-with-name-copy-83
   */
  async searchCompanyByName(
    data: CompanySearchByNameRequest,
  ): Promise<VerificationResponse<CACVerificationData[]>> {
    return this.makeRequest(
      '/verification/global/company/search',
      {
        company_name: data?.companyName,
        country_code: 'ng',
      },
      (verificationData: Record<string, unknown>) => {
        const payload = { company_name: data?.companyName };
        if (Array.isArray(verificationData)) {
          return verificationData?.map((item) => this.mapCACData(item, payload));
        }
        return [this.mapCACData(verificationData, payload)];
      },
    );
  }

  /**
   * Search company by person/query string
   * @see https://docs.prembly.com/docs/company-search-with-strings-copy-83
   */
  async searchCompanyByPerson(
    data: CompanySearchByPersonRequest,
  ): Promise<VerificationResponse<CACVerificationData[]>> {
    return this.makeRequest(
      '/verification/global/company/search_with_string',
      {
        query: data?.personName || data?.companyName,
      },
      (verificationData: Record<string, unknown>) => {
        const payload = { person_name: data?.personName, company_name: data?.companyName };
        if (Array.isArray(verificationData)) {
          return verificationData?.map((item) => this.mapCACData(item, payload));
        }
        return [this.mapCACData(verificationData, payload)];
      },
    );
  }

  /**
   * Search company by registration number
   * @see https://docs.prembly.com/docs/company-search-with-registration-number-copy-81
   */
  async searchCompanyByRegistrationNumber(
    data: CompanySearchByRegistrationNumberRequest,
  ): Promise<VerificationResponse<CACVerificationData>> {
    return this.makeRequest(
      '/verification/global/company',
      {
        company_number: data?.rcNumber,
        country_code: 'ng',
      },
      this.mapCACData,
    );
  }

  /**
   * Map CAC API response to CACVerificationData
   * Handles various response field formats from Prembly API
   */
  private mapCACData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): CACVerificationData {
    return {
      companyName:
        (verificationData?.company_name as string) ||
        (verificationData?.name as string) ||
        (verificationData?.companyName as string) ||
        (payload?.company_name as string) ||
        '',
      rcNumber:
        (verificationData?.rc_number as string) ||
        (verificationData?.internationalNumber as string) ||
        (verificationData?.rcNumber as string) ||
        (payload?.rc_number as string),
      bnNumber:
        (verificationData?.bn_number as string) ||
        (verificationData?.bnNumber as string) ||
        (payload?.bn_number as string),
      registrationDate:
        (verificationData?.registration_date as string) ||
        (verificationData?.registrationDate as string) ||
        (verificationData?.dateCreated as string),
      status:
        (verificationData?.status as string) ||
        (verificationData?.company_status as string) ||
        (verificationData?.companyStatus as string) ||
        (verificationData?.statusText as string),
      email: (verificationData?.email as string) || (verificationData?.email_address as string),
      address:
        (verificationData?.address as string) ||
        (verificationData?.company_address as string) ||
        (verificationData?.registered_address as string),
      city: verificationData?.city as string,
      state: verificationData?.state as string,
      companyType:
        (verificationData?.company_type as string) ||
        (verificationData?.companyType as string) ||
        (verificationData?.entity_type as string),
      branchAddress:
        (verificationData?.branch_address as string) || (verificationData?.branchAddress as string),
      headOfficeAddress:
        (verificationData?.head_office_address as string) ||
        (verificationData?.headOfficeAddress as string),
      lga: verificationData?.lga as string,
      shortName: verificationData?.shortName as string,
      brandName: verificationData?.brandName as string,
      countryCode: verificationData?.countryCode as string,
      localNumber: verificationData?.localNumber as string,
      searchScore: verificationData?.searchScore as string,
      directors: (verificationData?.directors as Array<Record<string, unknown>>)?.map(
        (director: Record<string, unknown>) => ({
          name:
            (director?.name as string) ||
            (director?.director_name as string) ||
            `${director?.firstname || ''} ${director?.surname || ''}`.trim(),
          surname: director?.surname as string,
          firstname: director?.firstname as string,
          otherName: director?.otherName as string,
          position:
            (director?.position as string) ||
            ((director?.affiliateTypeFk as Record<string, unknown>)?.name as string),
          appointmentDate:
            (director?.appointment_date as string) ||
            (director?.appointedOn as string) ||
            (director?.appointmentDate as string) ||
            (director?.dateOfAppointment as string),
          email: director?.email as string,
          phoneNumber: director?.phoneNumber as string,
          address: director?.address as string,
          nationality: director?.nationality as string,
          occupation: director?.occupation as string,
          status: director?.status as string,
          identityNumber: director?.identityNumber as string,
          ...director,
        }),
      ),
      shareholders: (verificationData?.shareholders as Array<Record<string, unknown>>)?.map(
        (shareholder: Record<string, unknown>) => ({
          name: (shareholder?.name as string) || (shareholder?.shareholder_name as string),
          shares:
            (shareholder?.shares as number) ||
            (shareholder?.number_of_shares as number) ||
            (shareholder?.numSharesAlloted as number),
          shareType:
            (shareholder?.share_type as string) ||
            (shareholder?.shareType as string) ||
            (shareholder?.typeOfShares as string),
          ...shareholder,
        }),
      ),
      ...verificationData,
    };
  }
}
