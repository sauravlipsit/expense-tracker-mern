import { Router } from 'express';
import { createExpense, deleteExpense, listExpenses } from '../controllers/expenseController';
import { requireAuth } from '../middleware/auth';
const router = Router(); router.use(requireAuth); router.get('/', listExpenses); router.post('/', createExpense); router.delete('/:id', deleteExpense);
export default router;
