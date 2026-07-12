import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma Client instance to prevent multiple connections in development.
 * This is a common pattern for Next.js/Node environments to avoid connection limit issues.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
