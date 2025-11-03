import { IsString, IsNotEmpty, IsOptional, Length, Matches, IsBoolean } from 'class-validator';

export class VerifyBVNDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'BVN must be exactly 11 characters' })
  @Matches(/^\d+$/, { message: 'BVN must contain only digits' })
  bvn: string;

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

export class VerifyBVNAdvanceDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  bvn: string;

  @IsBoolean()
  @IsOptional()
  includeHistory?: boolean;
}

export class VerifyBVNWithFaceDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  bvn: string;

  @IsString()
  @IsNotEmpty()
  image: string; // Base64 encoded image
}

export class GetBVNByPhoneDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?234\d{10}$|^0\d{10}$/, { message: 'Invalid Nigerian phone number format' })
  phoneNumber: string;
}
