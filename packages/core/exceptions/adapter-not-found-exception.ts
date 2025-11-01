import { VerificationException } from './verification-exception';
import { ExceptionCode, ExceptionName } from '../types/exception-types';

export class AdapterNotFoundException extends VerificationException {
  constructor(message: string, details?: any) {
    super(message, ExceptionCode.ADAPTER_NOT_FOUND, details);
    this.name = ExceptionName.ADAPTER_NOT_FOUND_EXCEPTION;
  }
}