# Prembly IdentityPass API Mapping

This document maps all Prembly IdentityPass verification endpoints to the corresponding services in the PorkAte Valid8 library.

## Service Structure

### 1. NINVerificationService
- **NIN and Virtual NIN** → `POST /api/v2/biometrics/merchant/data/verification/vnin`
  - Request: `{ number: string }` (NIN or Virtual NIN)
  - Test Data: `number: 12345678901`
  
- **NIN With Face** → `POST /api/v2/biometrics/merchant/data/verification/nin_face`
  - Request: `{ number: string, image: string }` 
  - Test Data: `number: 12345678909, image: [URL]`

- **National ID Basic** → Same as NIN verification
  - This is essentially a NIN verification endpoint

### 2. BVNVerificationService  
- **BVN Basic** → `POST /api/v1/biometrics/merchant/data/verification/bvn`
  - Request: `{ number: string }`
  - Test Data: `number: 54651333604`

- **BVN Advance** → `POST /api/v1/biometrics/merchant/data/verification/bvn`
  - Request: `{ number: string }`
  - Returns more detailed information
  - Test Data: `number: 54651333604`

- **BVN + (Face Validation)** → `POST /api/v1/biometrics/merchant/data/verification/bvn_w_face`
  - Request: `{ number: string, image: string }`
  - Test Data: `number: 54651333604, image: [URL]`

- **Get BVN with Phone number** → `POST /api/v1/biometrics/merchant/data/verification/bvn/phone`
  - Request: `{ phone_number: string }`

### 3. CompanyVerificationService (CAC)
- **Company Search With Name** → `POST /api/v1/biometrics/merchant/data/verification/global/company/search`
  - Request: `{ query: string }`
  - Test Data: `Query: Pharmy`

- **Company Search By Person** → `POST /api/v1/biometrics/merchant/data/verification/global/company/search_with_string`
  - Request: `{ query: string }`
  - Test Data: `Query: Pharmy`

- **Company Search With Registration Number** → `POST /api/v1/biometrics/merchant/data/verification/global/company`
  - Request: `{ country_code: string, company_number: string }`
  - Test Data: `company_number: 1000010, country_code: ng`

- **Basic CAC** → `POST /api/v1/biometrics/merchant/data/verification/cac`
  - Request: `{ rc_number: string, company_type: string, company_name?: string }`
  - Test Data: `rc_number: 092932, company_name: Test Company, company_type: RC`
  - company_type: BN or RC or IT (Default: RC)

- **Advance CAC** → `POST /api/v1/biometrics/merchant/data/verification/cac/advance`
  - Request: `{ rc_number: string, company_type: string, company_name: string }`
  - Test Data: Same as Basic CAC

### 4. VehicleVerificationService
- **VIN/CAR CHASIS** → `POST /api/v1/biometrics/merchant/data/verification/vehicle/vin`
  - Request: `{ vin: string }`
  - Test Data: `vin: AAA00000000`

- **Plate Number Verification** → `POST /api/v1/biometrics/merchant/data/verification/vehicle/plate`
  - Request: `{ plate_number: string }`

### 5. DriversLicenseVerificationService
- **Basic Drivers License** → `POST /api/v1/biometrics/merchant/data/verification/drivers_license`
  - Request: `{ number: string, firstname?: string, lastname?: string, dob?: string }`

- **Advance Drivers License** → `POST /api/v1/biometrics/merchant/data/verification/drivers_license/advance`
  - Request: Same as basic but returns more details

- **Drivers License (Image)** → `POST /api/v1/biometrics/merchant/data/verification/drivers_license/image`
  - Request: `{ number: string, image: string }`

- **Drivers License (+Face Validation)** → `POST /api/v1/biometrics/merchant/data/verification/drivers_license/face`
  - Request: `{ number: string, image: string, firstname?: string, lastname?: string, dob?: string }`

- **Drivers License V2** → `POST /api/v2/biometrics/merchant/data/verification/drivers_license`
  - Request: Same as basic
  - Updated version with improved data

### 6. PassportVerificationService
- **International Passport** → `POST /api/v1/biometrics/merchant/data/verification/passport`
  - Request: `{ passport_number: string, firstname?: string, lastname?: string, dob?: string }`

- **Passport Version 2** → `POST /api/v2/biometrics/merchant/data/verification/passport`
  - Request: Same as v1

- **International Passport (Image)** → `POST /api/v1/biometrics/merchant/data/verification/passport/image`
  - Request: `{ passport_number: string, image: string }`

- **International Passport (+ Face Validation)** → `POST /api/v1/biometrics/merchant/data/verification/passport/face`
  - Request: `{ passport_number: string, image: string, firstname?: string, lastname?: string, dob?: string }`

### 7. DocumentVerificationService
- **Document Verification** → `POST /api/v1/biometrics/merchant/data/verification/document`
  - Request: `{ doc_type: string, doc_country: string, doc_image: string }`
  - doc_type: PP (Passport) | DL (Driver's License) | ID (Government ID)

- **Document Verification with Face** → `POST /api/v1/biometrics/merchant/data/verification/document_w_face`
  - Request: `{ doc_type: string, doc_country: string, doc_image: string, selfie_image: string }`
  - Test Data: doc_type: ID, doc_country: NGA

- **Voters Card** → `POST /api/v1/biometrics/merchant/data/verification/voters_card`
  - Request: `{ vin: string, firstname?: string, lastname?: string }`

- **WAEC Verification** → Country-specific endpoint

- **NYSC** → `POST /api/v1/biometrics/merchant/data/verification/nysc`
  - Request: `{ certificate_number: string }`

### 8. PhoneVerificationService
- **Basic Phone Number** → `POST /api/v1/biometrics/merchant/data/verification/phone_number`
  - Request: `{ number: string }`
  - Test Data: `number: 08082838283`

- **Advance Phone Number** → `POST /api/v1/biometrics/merchant/data/verification/phone_number/advance`
  - Request: `{ number: string }`
  - Returns NIN data linked to phone
  - Test Data: `number: 08082838283`

### 9. BankVerificationService
- **Bank Accounts Basic** → `POST /api/v1/biometrics/merchant/data/verification/bank_account`
  - Request: `{ account_number: string, bank_code: string }`

- **Bank Accounts Comparison** → `POST /api/v1/biometrics/merchant/data/verification/bank_account/compare`
  - Request: `{ account_number: string, bank_code: string, bvn: string }`

- **Financial Accounts Advance** → `POST /api/v1/biometrics/merchant/data/verification/list/financial_accounts/advance`
  - Multi-step process:
    1. Initialize: `{ number: string }` (BVN)
    2. Get Consent: `{ number: string, verify_with: string }`  
    3. Retrieve: `{ number: string, verify_with: string, otp: string }`
  - Test Data: `number: 54651333604, verify_with: 0701***2345, otp: 123456`

- **List Bank Codes** → `GET /api/v1/biometrics/merchant/data/verification/banks`

### 10. CreditBureauVerificationService
- **Credit Bureau Consumer(Individual)-Basic** → `POST /api/v1/biometrics/merchant/data/verification/credit_bureau/consumer/basic`
  - Request: `{ bvn: string }`

- **Credit Bureau Consumer(Individual)-Advance** → `POST /api/v1/biometrics/merchant/data/verification/credit_bureau/consumer/advance`
  - Request: `{ bvn: string }`

- **Credit Bureau Commercial(Business)-Basic** → `POST /api/v1/biometrics/merchant/data/verification/credit_bureau/commercial/basic`
  - Request: `{ rc_number: string }`

- **Credit Bureau Commercial(Business)-Advance** → `POST /api/v1/biometrics/merchant/data/verification/credit_bureau/commercial/advance`
  - Request: `{ rc_number: string }`

### 11. TaxVerificationService
- **Tax Identification Number Check** → `POST /api/v1/biometrics/merchant/data/verification/tax/tin/check`
  - Request: `{ tin: string }`

- **Tax Identification Number (TIN)** → `POST /api/v1/biometrics/merchant/data/verification/tin`
  - Request: `{ number: string, channel: string }`
  - channel: TIN | CAC | PHONE (Default: TIN)
  - Test Data: `number: Rc323479, channel: CAC` or `number: 20304753-0001`

- **Stamp Duty** → `POST /api/v1/biometrics/merchant/data/verification/stamp_duty`
  - Request: `{ account_number: string, bank_code: string }`

### 12. AddressVerificationService  
- **Address Verification** → `POST /api/v1/biometrics/merchant/data/verification/address`
  - Request: `{ address: string, state: string, lga?: string }`

### 13. InsuranceVerificationService
- **Insurance Policy** → `POST /api/v1/biometrics/merchant/data/verification/insurance`
  - Request: `{ policy_number: string, insurance_company: string }`

## API Headers
All endpoints require:
```
app-id: Your App ID
x-api-key: Your Secret Key
```

## Response Format
All endpoints return a consistent response structure:
```typescript
{
  status: boolean,
  detail?: string,
  response_code: string,
  message?: string,
  data: T,
  verification?: {
    status: string,
    reference: string
  }
}
```

## Country Codes
For endpoints requiring country codes, refer to: https://docs.prembly.com/docs/country-codes

## Bank Codes  
For bank verification endpoints, refer to: https://docs.prembly.com/docs/cbn-bank-codes

## Endpoints to Review/Update

### Priority 1: Incorrect Endpoints
1. **BVN Verification** - Current endpoints need review
2. **NIN Verification** - Update to use correct v2 endpoints  
3. **Vehicle Verification** - Verify VIN vs Plate endpoints
4. **Phone Verification** - Separate basic vs advance

### Priority 2: Missing Endpoints
1. **Document Verification** - Add new service
2. **Insurance Verification** - Add new service
3. **Address Verification** - Add to existing service
4. **WAEC Verification** - Add to document/education service
5. **NYSC Verification** - Add to document/education service

### Priority 3: Enhanced Endpoints
1. **Financial Accounts Advance** - Multi-step OTP flow
2. **Company Search** - Global search endpoints
3. **CAC Advance** - Enhanced company data
4. **Passport V2** - Updated version

## Notes
- Some endpoints have test/sandbox data provided in the docs
- Face validation endpoints require image URL or base64 encoded image
- Multi-step verification flows (like Financial Accounts) need state management
- Global company search requires country codes
