import { SetMetadata } from '@nestjs/common';
import { ServiceType } from 'porkate-valid8';

export const VERIFY_METADATA_KEY = 'valid8:verify';

export interface VerifyOptions {
  serviceType: ServiceType;
  adapter?: string;
}

export const Verify = (options: VerifyOptions) =>
  SetMetadata(VERIFY_METADATA_KEY, options);
