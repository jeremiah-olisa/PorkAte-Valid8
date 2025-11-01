import { VerificationResponse, VehicleVerificationRequest as BaseVehicleVerificationRequest } from '../verification-adapter.interface';

// Re-export the base type (extended to support VIN)
export interface VehicleVerificationRequest extends BaseVehicleVerificationRequest {
  vinNumber?: string; // Vehicle Identification Number / Chassis number
}

// Standard vehicle verification data structure
export interface VehicleVerificationData {
  plateNumber?: string;
  vinNumber?: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  ownerName?: string;
  registrationDate?: string;
  expiryDate?: string;
  engineNumber?: string;
  chassisNumber?: string;
  vehicleType?: string;
  [key: string]: any;
}

/**
 * Interface for Vehicle verification services
 * Implementations should throw NotImplementedException for unsupported methods
 */
export interface IVehicleVerificationService {
  /**
   * General vehicle verification (plate or VIN) - REQUIRED
   */
  verifyVehicle(data: VehicleVerificationRequest): Promise<VerificationResponse<VehicleVerificationData>>;
  
  /**
   * Verify vehicle by VIN/Chassis number - OPTIONAL
   */
  verifyVINChasis?(data: { vinNumber: string }): Promise<VerificationResponse<VehicleVerificationData>>;
  
  /**
   * Verify vehicle by plate number - OPTIONAL
   */
  verifyPlateNumber?(data: { plateNumber: string }): Promise<VerificationResponse<VehicleVerificationData>>;
  
  /**
   * Check if the service is ready and configured
   */
  isReady(): boolean;
}
