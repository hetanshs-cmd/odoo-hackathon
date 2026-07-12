import { expensesRepository } from './expenses.repository';
import { AppError } from '../../utils/AppError';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.validator';

export class ExpensesService {
  async getAllExpenses(filters?: { vehicleId?: number; driverId?: number; category?: string }) {
    return expensesRepository.findAll(filters);
  }

  async getExpenseById(id: number) {
    const expense = await expensesRepository.findById(id);
    if (!expense) {
      throw new AppError('NOT_FOUND', 404, 'Expense not found');
    }
    return expense;
  }

  async createExpense(data: CreateExpenseDto) {
    return expensesRepository.create(data);
  }

  async updateExpense(id: number, data: UpdateExpenseDto) {
    const expense = await expensesRepository.findById(id);
    if (!expense) {
      throw new AppError('NOT_FOUND', 404, 'Expense not found');
    }
    return expensesRepository.update(id, data);
  }

  async deleteExpense(id: number) {
    const expense = await expensesRepository.findById(id);
    if (!expense) {
      throw new AppError('NOT_FOUND', 404, 'Expense not found');
    }
    return expensesRepository.delete(id);
  }

  async getSummary() {
    return expensesRepository.getSummary();
  }
}

export const expensesService = new ExpensesService();
