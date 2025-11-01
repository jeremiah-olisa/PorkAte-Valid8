import {
  IVehicleVerificationService,
  VehicleVerificationRequest,
  VehicleVerificationData,
  VerificationResponse,
} from '@porkate/valid8';
import { BaseIdentityPassService } from './base.service';

/**
 * IdentityPass Vehicle Verification Service
 */
export class IdentityPassVehicleService extends BaseIdentityPassService implements IVehicleVerificationService {
  async verifyVehicle(data: VehicleVerificationRequest): Promise<VerificationResponse<VehicleVerificationData>> {
    // The VehicleVerificationRequest from the interface can have vinNumber
    const requestData = data as VehicleVerificationRequest & { vinNumber?: string };
    
    // Determine which endpoint to use based on input
    if (requestData.vinNumber) {
      return this.verifyVINChasis({ vinNumber: requestData.vinNumber });
    } else if (data.plateNumber) {
      return this.verifyPlateNumber({ plateNumber: data.plateNumber });
    }

    return {
      success: false,
      error: 'Either plateNumber or vinNumber must be provided',
      provider: this.providerName,
      timestamp: new Date(),
    };
  }

  async verifyVINChasis(data: { vinNumber: string }): Promise<VerificationResponse<VehicleVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/vehicle/vin',
      {
        vin_number: data.vinNumber,
      },
      this.mapVehicleData
    );
  }

  async verifyPlateNumber(data: { plateNumber: string }): Promise<VerificationResponse<VehicleVerificationData>> {
    return this.makeRequest(
      '/api/v1/biometrics/merchant/data/verification/vehicle/plate',
      {
        plate_number: data.plateNumber,
      },
      this.mapVehicleData
    );
  }

  private mapVehicleData(verificationData: any, payload: any): VehicleVerificationData {
    return {
      plateNumber: verificationData.plate_number || verificationData.plateNumber || payload.plate_number,
      vinNumber: verificationData.vin_number || verificationData.vinNumber || payload.vin_number,
      make: verificationData.make,
      model: verificationData.model,
      year: verificationData.year ? parseInt(verificationData.year) : undefined,
      color: verificationData.color || verificationData.colour,
      ownerName: verificationData.owner_name || verificationData.ownerName,
      registrationDate: verificationData.registration_date || verificationData.registrationDate,
      expiryDate: verificationData.expiry_date || verificationData.expiryDate,
      engineNumber: verificationData.engine_number || verificationData.engineNumber,
      chassisNumber: verificationData.chassis_number || verificationData.chassisNumber || verificationData.vin_number,
      vehicleType: verificationData.vehicle_type || verificationData.vehicleType,
      ...verificationData,
    };
  }
}
