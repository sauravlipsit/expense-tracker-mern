import { Request, Response } from 'express';
import { z } from 'zod';
import { Types } from 'mongoose';
import { Expense, EXPENSE_CATEGORIES } from '../models/Expense';

const expenseInput = z.object({ title: z.string().trim().min(2).max(120), category: z.enum(EXPENSE_CATEGORIES), amount: z.number().positive().max(100000000), date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)), notes: z.string().max(500).optional() });
export async function listExpenses(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, Number(req.query.page) || 1); const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 8));
  const category = String(req.query.category || ''); const search = String(req.query.search || '').trim();
  const filter: Record<string, any> = { user: req.userId };
  if (category && category !== 'All categories' && EXPENSE_CATEGORIES.includes(category as typeof EXPENSE_CATEGORIES[number])) filter.category = category;
  if (search) filter.title = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const [items, total, totalAgg] = await Promise.all([
    Expense.find(filter).sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Expense.countDocuments(filter),
    Expense.aggregate([{ $match: { user: new Types.ObjectId(req.userId!) } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
  ]);
  res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }, totalSpent: totalAgg[0]?.total || 0 });
}
export async function createExpense(req: Request, res: Response): Promise<void> {
  const parsed = expenseInput.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ message: 'Invalid expense details.', errors: parsed.error.flatten().fieldErrors }); return; }
  const expense = await Expense.create({ ...parsed.data, user: req.userId, date: new Date(parsed.data.date) });
  res.status(201).json({ item: expense });
}
export async function deleteExpense(req: Request, res: Response): Promise<void> {
  const deleted = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!deleted) { res.status(404).json({ message: 'Expense not found' }); return; }
  res.json({ message: 'Expense deleted' });
}
