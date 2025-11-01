export class VerificationException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'VerificationException';
  }
}

export class VerificationConfigurationException extends VerificationException {
  constructor(message: string, details?: any) {
    super(message, 'CONFIGURATION_ERROR', details);
    this.name = 'VerificationConfigurationException';
  }
}

export class VerificationNotReadyException extends VerificationException {
  constructor(message: string, details?: any) {
    super(message, 'NOT_READY', details);
    this.name = 'VerificationNotReadyException';
  }
}

export class VerificationFailedException extends VerificationException {
  constructor(message: string, details?: any) {
    super(message, 'VERIFICATION_FAILED', details);
    this.name = 'VerificationFailedException';
  }
}

export class AdapterNotFoundException extends VerificationException {
  constructor(message: string, details?: any) {
    super(message, 'ADAPTER_NOT_FOUND', details);
    this.name = 'AdapterNotFoundException';
  }
}
