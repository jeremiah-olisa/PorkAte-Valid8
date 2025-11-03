import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class VerifyPhoneNumberDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class VerifyPhoneNumberAdvanceDto extends VerifyPhoneNumberDto {
  @IsBoolean()
  @IsOptional()
  includeCarrierInfo?: boolean;
}

export class VerifyBankAccountDto {
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  bankCode: string;
}

export class CompareBankAccountDto extends VerifyBankAccountDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class VerifyPlateNumberDto {
  @IsString()
  @IsNotEmpty()
  plateNumber: string;
}

export class VerifyVINDto {
  @IsString()
  @IsNotEmpty()
  vinNumber: string;
}

export class VerifyTINDto {
  @IsString()
  @IsNotEmpty()
  tin: string;

  @IsString()
  @IsOptional()
  channel?: string;
}

export class VerifyStampDutyDto {
  @IsString()
  @IsNotEmpty()
  referenceNumber: string;
}

export class VerifyVotersCardDto {
  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  state?: string;
}
