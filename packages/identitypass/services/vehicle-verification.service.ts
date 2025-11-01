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
export class IdentityPassVehicleService
  extends BaseIdentityPassService
  implements IVehicleVerificationService
{
  async verifyVehicle(
    data: VehicleVerificationRequest,
  ): Promise<VerificationResponse<VehicleVerificationData>> {
    // The VehicleVerificationRequest from the interface can have vinNumber
    const requestData = data as VehicleVerificationRequest & { vinNumber?: string };

    // Determine which endpoint to use based on input
    if (requestData?.vinNumber) {
      return this.verifyVINChasis({ vinNumber: requestData?.vinNumber });
    } else if (data?.plateNumber) {
      return this.verifyPlateNumber({ plateNumber: data?.plateNumber });
    }

    return {
      success: false,
      error: 'Either plateNumber or vinNumber must be provided',
      provider: this.providerName,
      timestamp: new Date(),
    };
  }

  /**
   * Verify VIN/Car Chassis Number
   * @see https://docs.prembly.com/docs/vincar-chasis-copy-84
   */
  async verifyVINChasis(data: {
    vinNumber: string;
  }): Promise<VerificationResponse<VehicleVerificationData>> {
    return this.makeRequest(
      '/verification/vehicle/vin',
      {
        vin: data?.vinNumber,
      },
      this.mapVehicleData,
    );
  }

  /**
   * Verify Vehicle by Plate Number
   * @see https://docs.prembly.com/docs/plate-number-verification-copy
   */
  async verifyPlateNumber(data: {
    plateNumber: string;
  }): Promise<VerificationResponse<VehicleVerificationData>> {
    return this.makeRequest(
      '/verification/vehicle',
      {
        vehicle_number: data?.plateNumber,
      },
      this.mapVehicleData,
    );
  }

  /**
   * Map Vehicle API response to VehicleVerificationData
   * Handles various response field formats from Prembly API
   */
  private mapVehicleData(
    verificationData: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): VehicleVerificationData {
    return {
      plateNumber:
        (verificationData?.plate_number as string) ||
        (verificationData?.vehicle_number as string) ||
        (verificationData?.plateNumber as string) ||
        (payload?.plate_number as string) ||
        (payload?.vehicle_number as string),
      vinNumber:
        (verificationData?.vin_number as string) ||
        (verificationData?.vin as string) ||
        (verificationData?.vinNumber as string) ||
        (payload?.vin_number as string) ||
        (payload?.vin as string),
      make: (verificationData?.make as string) || (verificationData?.vehicle_name as string),
      model: verificationData?.model as string,
      year: verificationData?.year ? parseInt(verificationData?.year as string) : undefined,
      color:
        (verificationData?.color as string) ||
        (verificationData?.colour as string) ||
        (verificationData?.vehicle_color as string),
      ownerName:
        (verificationData?.owner_name as string) || (verificationData?.ownerName as string),
      registrationDate:
        (verificationData?.registration_date as string) ||
        (verificationData?.registrationDate as string),
      expiryDate:
        (verificationData?.expiry_date as string) || (verificationData?.expiryDate as string),
      engineNumber:
        (verificationData?.engine_number as string) || (verificationData?.engineNumber as string),
      chassisNumber:
        (verificationData?.chassis_number as string) ||
        (verificationData?.chassisNumber as string) ||
        (verificationData?.vin_number as string),
      vehicleType:
        (verificationData?.vehicle_type as string) || (verificationData?.vehicleType as string),
      vehicleName: verificationData?.vehicle_name as string,
      vehicleAge: verificationData?.vehicle_age as string,
      vehicleMadeIn: verificationData?.vehicle_made_in as string,
      vehicleImage: verificationData?.vehicle_image as string,
      ...verificationData,
    };
  }
}
