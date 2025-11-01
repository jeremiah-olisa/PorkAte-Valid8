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
export class IdentityPassCACService extends BaseIdentityPassService implements ICACVerificationService {
  async verifyCAC(data: CACVerificationRequest): Promise<VerificationResponse<CACVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/cac',
      {
        rc_number: data.rcNumber,
        bn_number: data.bnNumber,
        company_name: data.companyName,
      },
      this.mapCACData
    );
  }

  async verifyCACAdvance(data: CACAdvanceVerificationRequest): Promise<VerificationResponse<CACVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/cac/advance',
      {
        rc_number: data.rcNumber,
        bn_number: data.bnNumber,
        company_name: data.companyName,
        include_directors: data.includeDirectors,
        include_shareholdings: data.includeShareholdings,
      },
      this.mapCACData
    );
  }

  async searchCompanyByName(data: CompanySearchByNameRequest): Promise<VerificationResponse<CACVerificationData[]>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/cac/search/name',
      {
        company_name: data.companyName,
      },
      (verificationData: any) => {
        if (Array.isArray(verificationData)) {
          return verificationData.map((item) => this.mapCACData(item, data));
        }
        return [this.mapCACData(verificationData, data)];
      }
    );
  }

  async searchCompanyByPerson(data: CompanySearchByPersonRequest): Promise<VerificationResponse<CACVerificationData[]>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/cac/search/person',
      {
        person_name: data.personName,
        company_name: data.companyName,
      },
      (verificationData: any) => {
        if (Array.isArray(verificationData)) {
          return verificationData.map((item) => this.mapCACData(item, data));
        }
        return [this.mapCACData(verificationData, data)];
      }
    );
  }

  async searchCompanyByRegistrationNumber(
    data: CompanySearchByRegistrationNumberRequest
  ): Promise<VerificationResponse<CACVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/cac/search/rc',
      {
        rc_number: data.rcNumber,
      },
      this.mapCACData
    );
  }

  private mapCACData(verificationData: any, payload: any): CACVerificationData {
    return {
      companyName: verificationData.company_name || verificationData.companyName || payload.company_name || '',
      rcNumber: verificationData.rc_number || verificationData.rcNumber || payload.rc_number,
      bnNumber: verificationData.bn_number || verificationData.bnNumber || payload.bn_number,
      registrationDate: verificationData.registration_date || verificationData.registrationDate,
      status: verificationData.status,
      email: verificationData.email,
      address: verificationData.address || verificationData.registered_address,
      city: verificationData.city,
      state: verificationData.state,
      companyType: verificationData.company_type || verificationData.companyType,
      branchAddress: verificationData.branch_address || verificationData.branchAddress,
      headOfficeAddress: verificationData.head_office_address || verificationData.headOfficeAddress,
      directors: verificationData.directors?.map((director: any) => ({
        name: director.name || director.director_name,
        position: director.position,
        appointmentDate: director.appointment_date || director.appointmentDate,
        ...director,
      })),
      shareholders: verificationData.shareholders?.map((shareholder: any) => ({
        name: shareholder.name || shareholder.shareholder_name,
        shares: shareholder.shares || shareholder.number_of_shares,
        shareType: shareholder.share_type || shareholder.shareType,
        ...shareholder,
      })),
      ...verificationData,
    };
  }
}
