import { Router } from 'express';
import { expensesController } from './expenses.controller';

const expensesRouter = Router();

// Expenses endpoints — authentication is omitted per user request

// GET /api/expenses
expensesRouter.get('/', expensesController.getAll);

// GET /api/expenses/:id
expensesRouter.get('/:id', expensesController.getById);

// POST /api/expenses
expensesRouter.post('/', expensesController.create);

// PUT /api/expenses/:id
expensesRouter.put('/:id', expensesController.update);

// DELETE /api/expenses/:id
expensesRouter.delete('/:id', expensesController.delete);

export default expensesRouter;
