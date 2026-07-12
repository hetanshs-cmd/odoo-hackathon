import { PrismaClient } from '@prisma/client';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.validator';

const prisma = new PrismaClient();

export class ExpensesRepository {
  async findAll(filters?: { vehicleId?: number; driverId?: number; category?: string }) {
    return prisma.expense.findMany({
      where: {
        ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
        ...(filters?.driverId && { driverId: filters.driverId }),
        ...(filters?.category && { category: filters.category }),
      },
      include: {
        vehicle: { select: { registrationNumber: true, nameModel: true } },
        driver: { select: { user: { select: { name: true } } } },
      },
      orderBy: { incurredAt: 'desc' },
    });
  }

  async findById(id: number) {
    return prisma.expense.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: { include: { user: { select: { name: true } } } },
      },
    });
  }

  async create(data: CreateExpenseDto) {
    return prisma.expense.create({
      data: {
        ...data,
        incurredAt: data.incurredAt ? new Date(data.incurredAt) : undefined,
      },
    });
  }

  async update(id: number, data: UpdateExpenseDto) {
    return prisma.expense.update({
      where: { id },
      data: {
        ...data,
        incurredAt: data.incurredAt ? new Date(data.incurredAt) : undefined,
      },
    });
  }

  async delete(id: number) {
    return prisma.expense.delete({
      where: { id },
    });
  }
}

export const expensesRepository = new ExpensesRepository();
