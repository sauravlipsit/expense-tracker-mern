import { Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/User';

export function issueAuthCookie(res: Response, user: IUser): void {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const token = jwt.sign(
    { sub: user._id.toString() },
    secret,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn']
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production'
      ? 'none' as const
      : 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };

  res.cookie('access_token', token, cookieOptions);
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production'
      ? 'none'
      : 'lax',
    path: '/'
  });
}