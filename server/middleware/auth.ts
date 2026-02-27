import { Request, Response, NextFunction } from 'express';
import { getProviders } from '../providers';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '') || '';
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  getProviders().auth.verifyToken(token).then(user => {
    if (!user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    req.user = { id: user.id, role: user.role };
    next();
  }).catch(() => {
    res.status(401).json({ error: 'Invalid or expired token' });
  });
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
