import { Injectable } from '@nestjs/common';
import {
  VerificationManager,
  IVerificationAdapter,
  NINVerificationRequest,
  BVNVerificationRequest,
  VerificationResponse,
} from '@porkate/valid8';

@Injectable()
export class Valid8Service {
  constructor(private readonly verificationManager: VerificationManager) {}

  getAdapter(name: string): IVerificationAdapter | undefined {
    return this.verificationManager.getAdapter(name);
  }

  getDefaultAdapter(): IVerificationAdapter | undefined {
    return this.verificationManager.getDefaultAdapter();
  }

  getAvailableAdapters(): string[] {
    return this.verificationManager.getAvailableAdapters();
  }

  async verifyNIN(data: NINVerificationRequest, adapterName?: string): Promise<VerificationResponse> {
    const adapter = adapterName 
      ? this.getAdapter(adapterName) 
      : this.getDefaultAdapter();
    
    if (!adapter) {
      throw new Error('No adapter available');
    }

    return adapter.verifyNIN(data);
  }

  async verifyBVN(data: BVNVerificationRequest, adapterName?: string): Promise<VerificationResponse> {
    const adapter = adapterName 
      ? this.getAdapter(adapterName) 
      : this.getDefaultAdapter();
    
    if (!adapter) {
      throw new Error('No adapter available');
    }

    return adapter.verifyBVN(data);
  }
}
