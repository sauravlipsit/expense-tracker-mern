import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export function issueAuthCookie(res: Response, user: IUser): void {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  const token = jwt.sign({ sub: user._id.toString() }, secret, { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'] });
  res.cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' });
}
export function clearAuthCookie(res: Response): void { res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' }); }
