import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

declare global { namespace Express { interface Request { userId?: string } } }
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.access_token;
    if (!token) { res.status(401).json({ message: 'Authentication required' }); return; }
    const payload = jwt.verify(token, process.env.JWT_SECRET || '') as jwt.JwtPayload;
    const user = await User.findById(payload.sub).select('_id');
    if (!user) { res.status(401).json({ message: 'Session is no longer valid' }); return; }
    req.userId = user.id; next();
  } catch { res.status(401).json({ message: 'Invalid or expired session' }); }
}
