import { VerificationException } from './verification-exception';
import { ExceptionCode, ExceptionName } from '../types/exception-types';

export class NotImplementedException extends VerificationException {
  constructor(message: string = 'The method or operation is not implemented.', details?: any) {
    super(message, ExceptionCode.METHOD_NOT_IMPLEMENTED, details);
    this.name = ExceptionName.METHOD_NOT_IMPLEMENTED_EXCEPTION;
  }
}