import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Valid8Service } from '@porkate/valid8-nest';
import { VerificationResponse } from '@porkate/valid8';
import { IdentityPassCompositeAdapter } from '@porkate/valid8-identitypass';
import * as dto from './dto';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(private readonly valid8Service: Valid8Service) {}

  private getIdentityPassAdapter(): IdentityPassCompositeAdapter {
    const adapter = this.valid8Service.getDefaultAdapter();

    if (!adapter) {
      throw new BadRequestException('No verification adapter available');
    }

    // Check if adapter is IdentityPassCompositeAdapter
    if (!('getNINService' in adapter)) {
      throw new BadRequestException('IdentityPass adapter not configured');
    }

    return adapter as any as IdentityPassCompositeAdapter;
  }

  // NIN Verification Methods
  async verifyNIN(data: dto.VerifyNINDto): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const ninService = adapter.getNINService();

    if (!ninService) {
      throw new BadRequestException('NIN verification service not available');
    }

    this.logger.log(`Verifying NIN: ${data.nin.substring(0, 4)}***`);
    const result = await ninService.verifyNIN(data);

    if (!result.success) {
      this.logger.warn(`NIN verification failed: ${result.error}`);
    }

    return result;
  }

  async verifyNINWithFace(
    data: dto.VerifyNINWithFaceDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const ninService = adapter.getNINService();

    if (!ninService || !ninService.verifyNINWithFace) {
      throw new BadRequestException('NIN face verification not available');
    }

    this.logger.log(`Verifying NIN with face: ${data.nin.substring(0, 4)}***`);
    return await ninService.verifyNINWithFace(data);
  }

  async verifyNINSlip(
    data: dto.VerifyNINSlipDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const ninService = adapter.getNINService();

    if (!ninService || !ninService.verifyNINSlip) {
      throw new BadRequestException('NIN slip verification not available');
    }

    this.logger.log(`Verifying NIN slip: ${data.nin.substring(0, 4)}***`);
    return await ninService.verifyNINSlip(data);
  }

  async verifyVirtualNIN(
    data: dto.VerifyVirtualNINDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const ninService = adapter.getNINService();

    if (!ninService || !ninService.verifyVirtualNIN) {
      throw new BadRequestException('Virtual NIN verification not available');
    }

    this.logger.log(`Verifying Virtual NIN`);
    return await ninService.verifyVirtualNIN(data);
  }

  // BVN Verification Methods
  async verifyBVN(data: dto.VerifyBVNDto): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const bvnService = adapter.getBVNService();

    if (!bvnService) {
      throw new BadRequestException('BVN verification service not available');
    }

    this.logger.log(`Verifying BVN: ${data.bvn.substring(0, 4)}***`);
    return await bvnService.verifyBVN(data);
  }

  async verifyBVNAdvance(
    data: dto.VerifyBVNAdvanceDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const bvnService = adapter.getBVNService();

    if (!bvnService || !bvnService.verifyBVNAdvance) {
      throw new BadRequestException('BVN advance verification not available');
    }

    this.logger.log(`Verifying BVN (advance): ${data.bvn.substring(0, 4)}***`);
    return await bvnService.verifyBVNAdvance(data);
  }

  async verifyBVNWithFace(
    data: dto.VerifyBVNWithFaceDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const bvnService = adapter.getBVNService();

    if (!bvnService || !bvnService.verifyBVNWithFace) {
      throw new BadRequestException('BVN face verification not available');
    }

    this.logger.log(`Verifying BVN with face: ${data.bvn.substring(0, 4)}***`);
    return await bvnService.verifyBVNWithFace(data);
  }

  async getBVNByPhone(
    data: dto.GetBVNByPhoneDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const bvnService = adapter.getBVNService();

    if (!bvnService || !bvnService.getBVNByPhoneNumber) {
      throw new BadRequestException('BVN by phone lookup not available');
    }

    this.logger.log(`Looking up BVN by phone`);
    return await bvnService.getBVNByPhoneNumber(data);
  }

  // CAC Verification Methods
  async verifyCAC(data: dto.VerifyCACDto): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const cacService = adapter.getCACService();

    if (!cacService) {
      throw new BadRequestException('CAC verification service not available');
    }

    this.logger.log(`Verifying CAC: ${data.rcNumber || data.companyName}`);
    return await cacService.verifyCAC(data);
  }

  async verifyCACAdvance(
    data: dto.VerifyCACAdvanceDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const cacService = adapter.getCACService();

    if (!cacService || !cacService.verifyCACAdvance) {
      throw new BadRequestException('CAC advance verification not available');
    }

    this.logger.log(
      `Verifying CAC (advance): ${data.rcNumber || data.companyName}`,
    );
    return await cacService.verifyCACAdvance(data);
  }

  async searchCompanyByName(
    data: dto.SearchCompanyByNameDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const cacService = adapter.getCACService();

    if (!cacService || !cacService.searchCompanyByName) {
      throw new BadRequestException('Company search not available');
    }

    this.logger.log(`Searching company by name: ${data.companyName}`);
    return await cacService.searchCompanyByName(data);
  }

  async searchCompanyByRC(
    data: dto.SearchCompanyByRCDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const cacService = adapter.getCACService();

    if (!cacService || !cacService.searchCompanyByRegistrationNumber) {
      throw new BadRequestException('Company RC search not available');
    }

    this.logger.log(`Searching company by RC: ${data.rcNumber}`);
    return await cacService.searchCompanyByRegistrationNumber(data);
  }

  // Driver's License Methods
  async verifyDriversLicense(
    data: dto.VerifyDriversLicenseDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const dlService = adapter.getDriversLicenseService();

    if (!dlService) {
      throw new BadRequestException(
        "Driver's license verification not available",
      );
    }

    this.logger.log(`Verifying driver's license: ${data.licenseNumber}`);
    return await dlService.verifyDriversLicense(data);
  }

  async verifyDriversLicenseWithFace(
    data: dto.VerifyDriversLicenseWithFaceDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const dlService = adapter.getDriversLicenseService();

    if (!dlService || !dlService.verifyDriversLicenseWithFace) {
      throw new BadRequestException(
        "Driver's license face verification not available",
      );
    }

    this.logger.log(
      `Verifying driver's license with face: ${data.licenseNumber}`,
    );
    return await dlService.verifyDriversLicenseWithFace(data);
  }

  async verifyDriversLicenseAdvance(
    data: dto.VerifyDriversLicenseAdvanceDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const dlService = adapter.getDriversLicenseService();

    if (!dlService || !dlService.verifyDriversLicenseAdvance) {
      throw new BadRequestException(
        "Driver's license advance verification not available",
      );
    }

    this.logger.log(
      `Verifying driver's license (advance): ${data.licenseNumber}`,
    );
    return await dlService.verifyDriversLicenseAdvance(data);
  }

  // Passport Methods
  async verifyPassport(
    data: dto.VerifyPassportDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const passportService = adapter.getPassportService();

    if (!passportService) {
      throw new BadRequestException('Passport verification not available');
    }

    this.logger.log(`Verifying passport: ${data.passportNumber}`);
    return await passportService.verifyPassport(data);
  }

  async verifyPassportWithFace(
    data: dto.VerifyPassportWithFaceDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const passportService = adapter.getPassportService();

    if (!passportService || !passportService.verifyPassportWithFace) {
      throw new BadRequestException('Passport face verification not available');
    }

    this.logger.log(`Verifying passport with face: ${data.passportNumber}`);
    return await passportService.verifyPassportWithFace(data);
  }

  // Phone Verification Methods
  async verifyPhone(
    data: dto.VerifyPhoneNumberDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const phoneService = adapter.getPhoneService();

    if (!phoneService) {
      throw new BadRequestException('Phone verification not available');
    }

    this.logger.log(`Verifying phone: ${data.phoneNumber}`);
    return await phoneService.verifyPhoneNumber(data);
  }

  async verifyPhoneAdvance(
    data: dto.VerifyPhoneNumberAdvanceDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const phoneService = adapter.getPhoneService();

    if (!phoneService || !phoneService.verifyPhoneNumberAdvance) {
      throw new BadRequestException('Phone advance verification not available');
    }

    this.logger.log(`Verifying phone (advance): ${data.phoneNumber}`);
    return await phoneService.verifyPhoneNumberAdvance(data);
  }

  // Bank Account Methods
  async verifyBankAccount(
    data: dto.VerifyBankAccountDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const bankService = adapter.getBankAccountService();

    if (!bankService) {
      throw new BadRequestException('Bank account verification not available');
    }

    this.logger.log(`Verifying bank account: ${data.accountNumber}`);
    return await bankService.verifyBankAccount(data);
  }

  async compareBankAccount(
    data: dto.CompareBankAccountDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const bankService = adapter.getBankAccountService();

    if (!bankService || !bankService.compareBankAccount) {
      throw new BadRequestException('Bank account comparison not available');
    }

    this.logger.log(`Comparing bank account: ${data.accountNumber}`);
    return await bankService.compareBankAccount(data);
  }

  async listBankCodes(): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const bankService = adapter.getBankAccountService();

    if (!bankService || !bankService.listBankCodes) {
      throw new BadRequestException('Bank code listing not available');
    }

    this.logger.log(`Listing bank codes`);
    return await bankService.listBankCodes();
  }

  // Vehicle Methods
  async verifyPlateNumber(
    data: dto.VerifyPlateNumberDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const vehicleService = adapter.getVehicleService();

    if (!vehicleService || !vehicleService.verifyPlateNumber) {
      throw new BadRequestException('Vehicle verification not available');
    }

    this.logger.log(`Verifying plate number: ${data.plateNumber}`);
    return await vehicleService.verifyPlateNumber(data);
  }

  async verifyVIN(data: dto.VerifyVINDto): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const vehicleService = adapter.getVehicleService();

    if (!vehicleService || !vehicleService.verifyVINChasis) {
      throw new BadRequestException('VIN verification not available');
    }

    this.logger.log(`Verifying VIN: ${data.vinNumber}`);
    return await vehicleService.verifyVINChasis(data);
  }

  // Tax Methods
  async verifyTIN(data: dto.VerifyTINDto): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const taxService = adapter.getTaxService();

    if (!taxService) {
      throw new BadRequestException('TIN verification not available');
    }

    this.logger.log(`Verifying TIN: ${data.tin}`);
    return await taxService.verifyTIN(data);
  }

  async verifyStampDuty(
    data: dto.VerifyStampDutyDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const taxService = adapter.getTaxService();

    if (!taxService || !taxService.verifyStampDuty) {
      throw new BadRequestException('Stamp duty verification not available');
    }

    this.logger.log(`Verifying stamp duty: ${data.referenceNumber}`);
    return await taxService.verifyStampDuty(data);
  }

  // Voter's Card Method
  async verifyVotersCard(
    data: dto.VerifyVotersCardDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const votersService = adapter.getVotersCardService();

    if (!votersService) {
      throw new BadRequestException("Voter's card verification not available");
    }

    this.logger.log(`Verifying voter's card: ${data.vin}`);
    return await votersService.verifyVotersCard(data);
  }

  // Credit Bureau Methods
  async verifyCreditConsumerBasic(
    data: dto.VerifyCreditBureauConsumerBasicDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const creditService = adapter.getCreditBureauService();

    if (!creditService || !creditService.verifyCreditBureauConsumerBasic) {
      throw new BadRequestException(
        'Credit bureau consumer verification not available',
      );
    }

    this.logger.log(`Verifying credit bureau (consumer basic)`);
    return await creditService.verifyCreditBureauConsumerBasic(data);
  }

  async verifyCreditConsumerAdvance(
    data: dto.VerifyCreditBureauConsumerAdvanceDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const creditService = adapter.getCreditBureauService();

    if (!creditService || !creditService.verifyCreditBureauConsumerAdvance) {
      throw new BadRequestException(
        'Credit bureau consumer advance verification not available',
      );
    }

    this.logger.log(`Verifying credit bureau (consumer advance)`);
    return await creditService.verifyCreditBureauConsumerAdvance(data);
  }

  async verifyCreditCommercialBasic(
    data: dto.VerifyCreditBureauCommercialBasicDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const creditService = adapter.getCreditBureauService();

    if (!creditService || !creditService.verifyCreditBureauCommercialBasic) {
      throw new BadRequestException(
        'Credit bureau commercial verification not available',
      );
    }

    this.logger.log(`Verifying credit bureau (commercial basic)`);
    return await creditService.verifyCreditBureauCommercialBasic(data);
  }

  // Other Verification Methods
  async verifyAddress(
    data: dto.VerifyAddressDto,
  ): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const otherService = adapter.getOtherService();

    if (!otherService || !otherService.verifyAddress) {
      throw new BadRequestException('Address verification not available');
    }

    this.logger.log(`Verifying address`);
    return await otherService.verifyAddress(data);
  }

  async verifyNYSC(data: dto.VerifyNYSCDto): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const otherService = adapter.getOtherService();

    if (!otherService || !otherService.verifyNYSC) {
      throw new BadRequestException('NYSC verification not available');
    }

    this.logger.log(`Verifying NYSC certificate`);
    return await otherService.verifyNYSC(data);
  }

  async verifyWAEC(data: dto.VerifyWAECDto): Promise<VerificationResponse> {
    const adapter = this.getIdentityPassAdapter();
    const otherService = adapter.getOtherService();

    if (!otherService || !otherService.verifyWAEC) {
      throw new BadRequestException('WAEC verification not available');
    }

    this.logger.log(`Verifying WAEC certificate`);
    return await otherService.verifyWAEC(data);
  }
}
