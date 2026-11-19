export interface User { id: string; name: string; email: string; avatar?: string; provider?: string }
export const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Other'] as const;
export type Category = typeof CATEGORIES[number];
export interface Expense { _id: string; title: string; category: Category; amount: number; date: string; notes?: string }
export interface ExpenseResponse { items: Expense[]; pagination: { page: number; limit: number; total: number; totalPages: number }; totalSpent: number }
