import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class VerifyCreditBureauConsumerBasicDto {
  @IsString()
  @IsNotEmpty()
  bvn: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

export class VerifyCreditBureauConsumerAdvanceDto {
  @IsString()
  @IsNotEmpty()
  bvn: string;

  @IsBoolean()
  @IsOptional()
  includeHistory?: boolean;
}

export class VerifyCreditBureauCommercialBasicDto {
  @IsString()
  @IsNotEmpty()
  rcNumber: string;
}

export class VerifyAddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  state?: string;
}

export class VerifyNYSCDto {
  @IsString()
  @IsNotEmpty()
  certificateNumber: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

export class VerifyWAECDto {
  @IsString()
  @IsNotEmpty()
  examNumber: string;

  @IsString()
  @IsNotEmpty()
  examYear: string;
}
