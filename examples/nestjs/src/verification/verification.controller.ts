import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import * as dto from './dto';

@Controller('verification')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  private handleError(error: unknown): never {
    const message =
      error instanceof Error ? error.message : 'Verification failed';
    throw new BadRequestException(message);
  }

  // NIN Endpoints
  @Post('nin')
  @HttpCode(HttpStatus.OK)
  async verifyNIN(@Body() body: dto.VerifyNINDto) {
    try {
      return await this.verificationService.verifyNIN(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('nin/face')
  @HttpCode(HttpStatus.OK)
  async verifyNINWithFace(@Body() body: dto.VerifyNINWithFaceDto) {
    try {
      return await this.verificationService.verifyNINWithFace(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('nin/slip')
  @HttpCode(HttpStatus.OK)
  async verifyNINSlip(@Body() body: dto.VerifyNINSlipDto) {
    try {
      return await this.verificationService.verifyNINSlip(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('nin/virtual')
  @HttpCode(HttpStatus.OK)
  async verifyVirtualNIN(@Body() body: dto.VerifyVirtualNINDto) {
    try {
      return await this.verificationService.verifyVirtualNIN(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // BVN Endpoints
  @Post('bvn')
  @HttpCode(HttpStatus.OK)
  async verifyBVN(@Body() body: dto.VerifyBVNDto) {
    try {
      return await this.verificationService.verifyBVN(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('bvn/advance')
  @HttpCode(HttpStatus.OK)
  async verifyBVNAdvance(@Body() body: dto.VerifyBVNAdvanceDto) {
    try {
      return await this.verificationService.verifyBVNAdvance(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('bvn/face')
  @HttpCode(HttpStatus.OK)
  async verifyBVNWithFace(@Body() body: dto.VerifyBVNWithFaceDto) {
    try {
      return await this.verificationService.verifyBVNWithFace(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('bvn/phone')
  @HttpCode(HttpStatus.OK)
  async getBVNByPhone(@Body() body: dto.GetBVNByPhoneDto) {
    try {
      return await this.verificationService.getBVNByPhone(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // CAC Endpoints
  @Post('cac')
  @HttpCode(HttpStatus.OK)
  async verifyCAC(@Body() body: dto.VerifyCACDto) {
    try {
      return await this.verificationService.verifyCAC(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('cac/advance')
  @HttpCode(HttpStatus.OK)
  async verifyCACAdvance(@Body() body: dto.VerifyCACAdvanceDto) {
    try {
      return await this.verificationService.verifyCACAdvance(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('cac/search-name')
  @HttpCode(HttpStatus.OK)
  async searchCompanyByName(@Body() body: dto.SearchCompanyByNameDto) {
    try {
      return await this.verificationService.searchCompanyByName(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('cac/search-rc')
  @HttpCode(HttpStatus.OK)
  async searchCompanyByRC(@Body() body: dto.SearchCompanyByRCDto) {
    try {
      return await this.verificationService.searchCompanyByRC(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Driver's License Endpoints
  @Post('drivers-license')
  @HttpCode(HttpStatus.OK)
  async verifyDriversLicense(@Body() body: dto.VerifyDriversLicenseDto) {
    try {
      return await this.verificationService.verifyDriversLicense(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('drivers-license/face')
  @HttpCode(HttpStatus.OK)
  async verifyDriversLicenseWithFace(
    @Body() body: dto.VerifyDriversLicenseWithFaceDto,
  ) {
    try {
      return await this.verificationService.verifyDriversLicenseWithFace(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('drivers-license/advance')
  @HttpCode(HttpStatus.OK)
  async verifyDriversLicenseAdvance(
    @Body() body: dto.VerifyDriversLicenseAdvanceDto,
  ) {
    try {
      return await this.verificationService.verifyDriversLicenseAdvance(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Passport Endpoints
  @Post('passport')
  @HttpCode(HttpStatus.OK)
  async verifyPassport(@Body() body: dto.VerifyPassportDto) {
    try {
      return await this.verificationService.verifyPassport(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('passport/face')
  @HttpCode(HttpStatus.OK)
  async verifyPassportWithFace(@Body() body: dto.VerifyPassportWithFaceDto) {
    try {
      return await this.verificationService.verifyPassportWithFace(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Phone Endpoints
  @Post('phone')
  @HttpCode(HttpStatus.OK)
  async verifyPhone(@Body() body: dto.VerifyPhoneNumberDto) {
    try {
      return await this.verificationService.verifyPhone(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('phone/advance')
  @HttpCode(HttpStatus.OK)
  async verifyPhoneAdvance(@Body() body: dto.VerifyPhoneNumberAdvanceDto) {
    try {
      return await this.verificationService.verifyPhoneAdvance(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Bank Account Endpoints
  @Post('bank-account')
  @HttpCode(HttpStatus.OK)
  async verifyBankAccount(@Body() body: dto.VerifyBankAccountDto) {
    try {
      return await this.verificationService.verifyBankAccount(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('bank-account/compare')
  @HttpCode(HttpStatus.OK)
  async compareBankAccount(@Body() body: dto.CompareBankAccountDto) {
    try {
      return await this.verificationService.compareBankAccount(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get('bank-account/codes')
  async listBankCodes() {
    try {
      return await this.verificationService.listBankCodes();
    } catch (error) {
      this.handleError(error);
    }
  }

  // Vehicle Endpoints
  @Post('vehicle/plate')
  @HttpCode(HttpStatus.OK)
  async verifyPlateNumber(@Body() body: dto.VerifyPlateNumberDto) {
    try {
      return await this.verificationService.verifyPlateNumber(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('vehicle/vin')
  @HttpCode(HttpStatus.OK)
  async verifyVIN(@Body() body: dto.VerifyVINDto) {
    try {
      return await this.verificationService.verifyVIN(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Tax Endpoints
  @Post('tax/tin')
  @HttpCode(HttpStatus.OK)
  async verifyTIN(@Body() body: dto.VerifyTINDto) {
    try {
      return await this.verificationService.verifyTIN(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('tax/stamp-duty')
  @HttpCode(HttpStatus.OK)
  async verifyStampDuty(@Body() body: dto.VerifyStampDutyDto) {
    try {
      return await this.verificationService.verifyStampDuty(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Voter's Card Endpoint
  @Post('voters-card')
  @HttpCode(HttpStatus.OK)
  async verifyVotersCard(@Body() body: dto.VerifyVotersCardDto) {
    try {
      return await this.verificationService.verifyVotersCard(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Credit Bureau Endpoints
  @Post('credit/consumer-basic')
  @HttpCode(HttpStatus.OK)
  async verifyCreditConsumerBasic(
    @Body() body: dto.VerifyCreditBureauConsumerBasicDto,
  ) {
    try {
      return await this.verificationService.verifyCreditConsumerBasic(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('credit/consumer-advance')
  @HttpCode(HttpStatus.OK)
  async verifyCreditConsumerAdvance(
    @Body() body: dto.VerifyCreditBureauConsumerAdvanceDto,
  ) {
    try {
      return await this.verificationService.verifyCreditConsumerAdvance(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('credit/commercial-basic')
  @HttpCode(HttpStatus.OK)
  async verifyCreditCommercialBasic(
    @Body() body: dto.VerifyCreditBureauCommercialBasicDto,
  ) {
    try {
      return await this.verificationService.verifyCreditCommercialBasic(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Other Verification Endpoints
  @Post('other/address')
  @HttpCode(HttpStatus.OK)
  async verifyAddress(@Body() body: dto.VerifyAddressDto) {
    try {
      return await this.verificationService.verifyAddress(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('other/nysc')
  @HttpCode(HttpStatus.OK)
  async verifyNYSC(@Body() body: dto.VerifyNYSCDto) {
    try {
      return await this.verificationService.verifyNYSC(body);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('other/waec')
  @HttpCode(HttpStatus.OK)
  async verifyWAEC(@Body() body: dto.VerifyWAECDto) {
    try {
      return await this.verificationService.verifyWAEC(body);
    } catch (error) {
      this.handleError(error);
    }
  }
}
