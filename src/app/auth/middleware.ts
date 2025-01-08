import { Request, Response, NextFunction } from 'express';
import { ISessionManager } from '../../gateways/session-manager.js';

export const makeAuthMiddleware = (sessionManager: ISessionManager) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const sessionId = req.headers['x-session-id'] as string;
    
    if (!sessionId) {
      res.status(401).json({ error: 'No session provided' });
      return;
    }

    try {
      const session = await sessionManager.getSession(sessionId);
      if (!session) {
        res.status(401).json({ error: 'Invalid session' });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      req.body['user'] = session.user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }
  };
}; 