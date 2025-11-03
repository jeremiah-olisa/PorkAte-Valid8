import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

export class VerifyNINDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'NIN must be exactly 11 characters' })
  @Matches(/^\d+$/, { message: 'NIN must contain only digits' })
  nin: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;
}

export class VerifyNINWithFaceDto extends VerifyNINDto {
  @IsString()
  @IsNotEmpty()
  image: string; // Base64 encoded image
}

export class VerifyNINSlipDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  nin: string;

  @IsString()
  @IsNotEmpty()
  slipNumber: string;
}

export class VerifyVirtualNINDto {
  @IsString()
  @IsNotEmpty()
  virtualNin: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
