import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User';
import { clearAuthCookie, issueAuthCookie } from '../utils/auth';

const credentials = z.object({ email: z.string().email().max(254), password: z.string().min(8).max(72) });
export async function register(req: Request, res: Response): Promise<void> {
  const parsed = credentials.extend({ name: z.string().trim().min(2).max(100) }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ message: 'Please provide a valid name, email and password (minimum 8 characters).' }); return; }
  const { name, email, password } = parsed.data;
  if (await User.exists({ email: email.toLowerCase() })) { res.status(409).json({ message: 'An account with this email already exists.' }); return; }
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  issueAuthCookie(res, user); res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
}
export async function login(req: Request, res: Response): Promise<void> {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ message: 'Enter a valid email and password.' }); return; }
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select('+password');
  if (!user?.password || !(await bcrypt.compare(parsed.data.password, user.password))) { res.status(401).json({ message: 'Incorrect email or password.' }); return; }
  issueAuthCookie(res, user); res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
}
export async function me(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.userId).select('name email avatar');
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }
  res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
}
export function logout(_req: Request, res: Response): void { clearAuthCookie(res); res.json({ message: 'Logged out successfully' }); }
