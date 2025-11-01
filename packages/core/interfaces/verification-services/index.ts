/**
 * Specialized verification service interfaces
 * Each service represents a specific category of verification
 */

// Export service interfaces and specialized request/response types
// Basic request types (NINVerificationRequest, BVNVerificationRequest, etc.) 
// are kept in verification-adapter.interface.ts for backward compatibility

export type {
  ININVerificationService,
  NINWithFaceVerificationRequest,
  NINSlipVerificationRequest,
  VirtualNINVerificationRequest,
  NINVerificationData,
} from './nin-verification.interface';

export type {
  IBVNVerificationService,
  BVNWithFaceVerificationRequest,
  BVNAdvanceVerificationRequest,
  BVNByPhoneNumberRequest,
  BVNVerificationData,
} from './bvn-verification.interface';

export type {
  ICACVerificationService,
  CACAdvanceVerificationRequest,
  CompanySearchByNameRequest,
  CompanySearchByPersonRequest,
  CompanySearchByRegistrationNumberRequest,
  CACVerificationData,
} from './cac-verification.interface';

export type {
  IDriversLicenseVerificationService,
  DriversLicenseVerificationRequest,
  DriversLicenseAdvanceVerificationRequest,
  DriversLicenseWithFaceVerificationRequest,
  DriversLicenseImageVerificationRequest,
  DriversLicenseVerificationData,
} from './drivers-license-verification.interface';

export type {
  IPassportVerificationService,
  PassportWithFaceVerificationRequest,
  PassportImageVerificationRequest,
  PassportVerificationData,
} from './passport-verification.interface';

export type {
  IPhoneVerificationService,
  PhoneAdvanceVerificationRequest,
  PhoneVerificationData,
} from './phone-verification.interface';

export type {
  IBankAccountVerificationService,
  BankAccountAdvanceVerificationRequest,
  BankAccountComparisonRequest,
  BankAccountVerificationData,
  BankCode,
} from './bank-account-verification.interface';

export type {
  IVehicleVerificationService,
  VehicleVerificationData,
} from './vehicle-verification.interface';

export type {
  ITaxVerificationService,
  StampDutyVerificationRequest,
  TaxVerificationData,
  StampDutyVerificationData,
} from './tax-verification.interface';

export type {
  IVotersCardVerificationService,
  VotersCardVerificationData,
} from './voters-card-verification.interface';

export type {
  ICreditBureauVerificationService,
  CreditBureauConsumerBasicRequest,
  CreditBureauConsumerAdvanceRequest,
  CreditBureauCommercialBasicRequest,
  CreditBureauCommercialAdvanceRequest,
  CreditBureauVerificationData,
} from './credit-bureau-verification.interface';

export type {
  IOtherVerificationService,
  AddressVerificationRequest,
  NYSCVerificationRequest,
  InsurancePolicyVerificationRequest,
  NationalIDVerificationRequest,
  WAECVerificationRequest,
  DocumentVerificationRequest,
  DocumentWithFaceVerificationRequest,
  AddressVerificationData,
  NYSCVerificationData,
  InsurancePolicyVerificationData,
  NationalIDVerificationData,
  WAECVerificationData,
  DocumentVerificationData,
} from './other-verification.interface';


