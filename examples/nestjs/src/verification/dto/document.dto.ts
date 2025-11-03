import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class VerifyDriversLicenseDto {
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

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

export class VerifyDriversLicenseAdvanceDto extends VerifyDriversLicenseDto {
  @IsString()
  @IsOptional()
  state?: string;
}

export class VerifyDriversLicenseWithFaceDto {
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsString()
  @IsNotEmpty()
  image: string; // Base64 encoded image
}

export class VerifyPassportDto {
  @IsString()
  @IsNotEmpty()
  passportNumber: string;

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

export class VerifyPassportWithFaceDto {
  @IsString()
  @IsNotEmpty()
  passportNumber: string;

  @IsString()
  @IsNotEmpty()
  image: string; // Base64 encoded image
}
