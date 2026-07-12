import { PrismaClient, Region } from '@prisma/client';

const prisma = new PrismaClient();

export class RegionsRepository {
  /**
   * Retrieves all regions from the database.
   */
  async findAll(): Promise<Region[]> {
    return prisma.region.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}

export const regionsRepository = new RegionsRepository();
