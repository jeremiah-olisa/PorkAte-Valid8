import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class VerifyCACDto {
  @IsString()
  @IsOptional()
  rcNumber?: string;

  @IsString()
  @IsOptional()
  bnNumber?: string;

  @IsString()
  @IsOptional()
  companyName?: string;
}

export class VerifyCACAdvanceDto extends VerifyCACDto {
  @IsBoolean()
  @IsOptional()
  includeDirectors?: boolean;

  @IsBoolean()
  @IsOptional()
  includeShareholdings?: boolean;
}

export class SearchCompanyByNameDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;
}

export class SearchCompanyByRCDto {
  @IsString()
  @IsNotEmpty()
  rcNumber: string;
}
