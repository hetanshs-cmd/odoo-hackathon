import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportsService {
  async getRevenueReport(startDate?: Date, endDate?: Date) {
    const trips = await prisma.trip.findMany({
      where: {
        completedAt: {
          gte: startDate || undefined,
          lte: endDate || undefined,
        },
        revenue: { not: null },
      },
      select: {
        completedAt: true,
        revenue: true,
      },
    });

    const revenueByDate: Record<string, number> = {};
    let totalRevenue = 0;

    trips.forEach((trip) => {
      if (!trip.completedAt || !trip.revenue) return;
      const dateStr = trip.completedAt.toISOString().split('T')[0]!;
      const amount = Number(trip.revenue);

      revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + amount;
      totalRevenue += amount;
    });

    return { totalRevenue, revenueByDate };
  }

  async getExpensesReport(startDate?: Date, endDate?: Date) {
    const expenses = await prisma.expense.findMany({
      where: {
        incurredAt: {
          gte: startDate || undefined,
          lte: endDate || undefined,
        },
      },
      select: {
        incurredAt: true,
        amount: true,
        category: true,
      },
    });

    const expensesByCategory: Record<string, number> = {};
    let totalExpenses = 0;

    expenses.forEach((expense) => {
      const amount = Number(expense.amount);
      expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + amount;
      totalExpenses += amount;
    });

    return { totalExpenses, expensesByCategory };
  }
}

export const reportsService = new ReportsService();
