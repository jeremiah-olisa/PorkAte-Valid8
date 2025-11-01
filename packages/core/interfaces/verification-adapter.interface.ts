export interface IVerificationAdapter {
  verifyNIN(data: NINVerificationRequest): Promise<VerificationResponse>;
  verifyBVN(data: BVNVerificationRequest): Promise<VerificationResponse>;
  verifyVotersCard(data: VotersCardVerificationRequest): Promise<VerificationResponse>;
  verifyPassport(data: PassportVerificationRequest): Promise<VerificationResponse>;
  verifyTIN(data: TINVerificationRequest): Promise<VerificationResponse>;
  verifyVehicle(data: VehicleVerificationRequest): Promise<VerificationResponse>;
  verifyCAC(data: CACVerificationRequest): Promise<VerificationResponse>;
  verifyPhoneNumber(data: PhoneVerificationRequest): Promise<VerificationResponse>;
  verifyBankAccount(data: BankAccountVerificationRequest): Promise<VerificationResponse>;
  verifyCreditBureau(data: CreditBureauVerificationRequest): Promise<VerificationResponse>;
  isReady(): boolean;
}

export interface NINVerificationRequest {
  nin: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export interface BVNVerificationRequest {
  bvn: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export interface VotersCardVerificationRequest {
  vin: string;
  firstName?: string;
  lastName?: string;
  state?: string;
}

export interface PassportVerificationRequest {
  passportNumber: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export interface TINVerificationRequest {
  tin: string;
  channel?: string;
}

export interface VehicleVerificationRequest {
  plateNumber: string;
}

export interface CACVerificationRequest {
  rcNumber?: string;
  bnNumber?: string;
  companyName?: string;
}

export interface PhoneVerificationRequest {
  phoneNumber: string;
}

export interface BankAccountVerificationRequest {
  accountNumber: string;
  bankCode: string;
}

export interface CreditBureauVerificationRequest {
  bvn?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
}

export interface VerificationResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  provider: string;
  timestamp: Date;
}
