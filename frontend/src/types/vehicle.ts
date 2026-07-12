export type VehicleStatus = 'AVAILABLE' | 'IN_SHOP' | 'ON_TRIP' | 'OUT_OF_SERVICE';

export interface Vehicle {
  id: number;
  registrationNumber: string;
  nameModel: string;
  type?: string | null;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  regionId?: number | null;
  currentLat?: number | null;
  currentLng?: number | null;
  createdAt: string;
  updatedAt: string;
}
