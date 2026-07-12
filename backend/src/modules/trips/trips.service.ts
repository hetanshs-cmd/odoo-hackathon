import { tripsRepository } from './trips.repository';
import { AppError } from '../../utils/AppError';
import { CreateTripDto, UpdateTripDto, UpdateTripStatusDto } from './trips.validator';
import { TripStatus } from '@prisma/client';

export class TripsService {
  async getAllTrips(filters?: {
    status?: TripStatus;
    regionId?: number;
    driverId?: number;
    vehicleId?: number;
  }) {
    return tripsRepository.findAll(filters);
  }

  async getActiveTrips() {
    return tripsRepository.findActive();
  }

  async getTripById(id: number) {
    const trip = await tripsRepository.findById(id);
    if (!trip) {
      throw new AppError('NOT_FOUND', 404, 'Trip not found');
    }
    return trip;
  }

  async createTrip(data: CreateTripDto, userId?: number) {
    // In a full implementation, we'd also check if vehicle and driver exist and are AVAILABLE.
    // For now, we rely on DB foreign key constraints.
    return tripsRepository.create(data, userId);
  }

  async updateTrip(id: number, data: UpdateTripDto) {
    const trip = await tripsRepository.findById(id);
    if (!trip) {
      throw new AppError('NOT_FOUND', 404, 'Trip not found');
    }
    return tripsRepository.update(id, data);
  }

  async updateTripStatus(id: number, data: UpdateTripStatusDto) {
    const trip = await tripsRepository.findById(id);
    if (!trip) {
      throw new AppError('NOT_FOUND', 404, 'Trip not found');
    }

    // In a full implementation, updating status to IN_PROGRESS would set driver/vehicle status to ON_TRIP.
    // Updating status to COMPLETED would set them back to AVAILABLE.

    return tripsRepository.updateStatus(id, data);
  }

  async deleteTrip(id: number) {
    const trip = await tripsRepository.findById(id);
    if (!trip) {
      throw new AppError('NOT_FOUND', 404, 'Trip not found');
    }
    // Delete essentially cancels the trip
    return tripsRepository.delete(id);
  }
}

export const tripsService = new TripsService();
