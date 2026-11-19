import mongoose, { Document, Schema, Types } from 'mongoose';

export const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Other'] as const;
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export interface IExpense extends Document { user: Types.ObjectId; title: string; category: ExpenseCategory; amount: number; date: Date; notes?: string; }
const expenseSchema = new Schema<IExpense>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, enum: EXPENSE_CATEGORIES, required: true },
  amount: { type: Number, required: true, min: 0.01 }, date: { type: Date, required: true }, notes: { type: String, maxlength: 500 }
}, { timestamps: true });
expenseSchema.index({ user: 1, date: -1 });
export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
