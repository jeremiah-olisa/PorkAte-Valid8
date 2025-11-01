import { VerificationException } from './verification-exception';
import { ExceptionCode, ExceptionName } from '../types/exception-types';

export class VerificationConfigurationException extends VerificationException {
  constructor(message: string, details?: any) {
    super(message, ExceptionCode.CONFIGURATION_ERROR, details);
    this.name = ExceptionName.VERIFICATION_CONFIGURATION_EXCEPTION;
  }
}