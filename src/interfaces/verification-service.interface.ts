export interface IVerificationService {
  verify(data: any): Promise<any>;
  isReady(): boolean;
  getName(): string;
}
