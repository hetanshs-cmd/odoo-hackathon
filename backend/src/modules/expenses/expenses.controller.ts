import { Request, Response } from 'express';
import { expensesService } from './expenses.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk, sendCreated } from '../../utils/apiResponse';
import { createExpenseSchema, updateExpenseSchema } from './expenses.validator';

export const expensesController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { vehicle_id, driver_id, category } = req.query;

    const filters = {
      ...(vehicle_id && { vehicleId: parseInt(vehicle_id as string, 10) }),
      ...(driver_id && { driverId: parseInt(driver_id as string, 10) }),
      ...(category && { category: category as string }),
    };

    const expenses = await expensesService.getAllExpenses(filters);
    sendOk(res, expenses, 'Expenses retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const expense = await expensesService.getExpenseById(id);
    sendOk(res, expense, 'Expense retrieved successfully');
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createExpenseSchema.parse(req.body);
    const expense = await expensesService.createExpense(validatedData);
    sendCreated(res, expense, 'Expense created successfully');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    const validatedData = updateExpenseSchema.parse(req.body);
    const expense = await expensesService.updateExpense(id, validatedData);
    sendOk(res, expense, 'Expense updated successfully');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] || '0', 10);
    await expensesService.deleteExpense(id);
    sendOk(res, null, 'Expense deleted successfully');
  }),

  getSummary: asyncHandler(async (req: Request, res: Response) => {
    const summary = await expensesService.getSummary();
    sendOk(res, summary, 'Summary retrieved successfully');
  }),
};
