import { regionsRepository } from './regions.repository';

export class RegionsService {
  /**
   * Get all regions
   */
  async getAllRegions() {
    return regionsRepository.findAll();
  }
}

export const regionsService = new RegionsService();
