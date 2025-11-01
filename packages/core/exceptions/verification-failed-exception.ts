import { VerificationException } from './verification-exception';
import { ExceptionCode, ExceptionName } from '../types/exception-types';

export class VerificationFailedException extends VerificationException {
  constructor(message: string, details?: any) {
    super(message, ExceptionCode.VERIFICATION_FAILED, details);
    this.name = ExceptionName.VERIFICATION_FAILED_EXCEPTION;
  }
}