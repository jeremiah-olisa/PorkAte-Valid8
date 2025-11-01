import { VerificationException } from './verification-exception';
import { ExceptionCode, ExceptionName } from '../types/exception-types';

export class VerificationNotReadyException extends VerificationException {
  constructor(message: string, details?: any) {
    super(message, ExceptionCode.NOT_READY, details);
    this.name = ExceptionName.VERIFICATION_NOT_READY_EXCEPTION;
  }
}