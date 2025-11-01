import { ExceptionCode, ExceptionName } from '../types/exception-types';

export class VerificationException extends Error {
  constructor(
    message: string,
    public readonly code: ExceptionCode,
    public readonly details?: any,
  ) {
    super(message);
    this.name = ExceptionName.VERIFICATION_EXCEPTION;
  }
}