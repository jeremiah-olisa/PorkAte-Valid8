import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'porkate-valid8 NestJS Example API',
      version: '1.0.0',
      description:
        'Comprehensive KYC/KYB verification API using porkate-valid8 packages',
      endpoints: {
        health: 'GET /health',
        nin: {
          basic: 'POST /verification/nin',
          withFace: 'POST /verification/nin/face',
          slip: 'POST /verification/nin/slip',
          virtual: 'POST /verification/nin/virtual',
        },
        bvn: {
          basic: 'POST /verification/bvn',
          advance: 'POST /verification/bvn/advance',
          withFace: 'POST /verification/bvn/face',
          byPhone: 'POST /verification/bvn/phone',
        },
        cac: {
          basic: 'POST /verification/cac',
          advance: 'POST /verification/cac/advance',
          searchByName: 'POST /verification/cac/search-name',
          searchByRC: 'POST /verification/cac/search-rc',
        },
        driversLicense: {
          basic: 'POST /verification/drivers-license',
          withFace: 'POST /verification/drivers-license/face',
          advance: 'POST /verification/drivers-license/advance',
        },
        passport: {
          basic: 'POST /verification/passport',
          withFace: 'POST /verification/passport/face',
        },
        phone: {
          basic: 'POST /verification/phone',
          advance: 'POST /verification/phone/advance',
        },
        bankAccount: {
          basic: 'POST /verification/bank-account',
          compare: 'POST /verification/bank-account/compare',
          listCodes: 'GET /verification/bank-account/codes',
        },
        vehicle: {
          plate: 'POST /verification/vehicle/plate',
          vin: 'POST /verification/vehicle/vin',
        },
        tax: {
          tin: 'POST /verification/tax/tin',
          stampDuty: 'POST /verification/tax/stamp-duty',
        },
        votersCard: 'POST /verification/voters-card',
        creditBureau: {
          consumerBasic: 'POST /verification/credit/consumer-basic',
          consumerAdvance: 'POST /verification/credit/consumer-advance',
          commercialBasic: 'POST /verification/credit/commercial-basic',
        },
        other: {
          address: 'POST /verification/other/address',
          nysc: 'POST /verification/other/nysc',
          waec: 'POST /verification/other/waec',
        },
      },
      documentation: 'See README.md for detailed usage examples',
    };
  }
}
