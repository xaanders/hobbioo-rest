/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Request, Response, NextFunction } from 'express';
import { ISessionManager } from '../../gateways/session-manager.js';
import { InvalidOrExpiredSessionError } from '../../shared/error/auth-error.js';

export const makeAuthMiddleware = (sessionManager: ISessionManager) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const sessionId = req.headers['authorization'] as string;

    try {
      if (!sessionId) throw new InvalidOrExpiredSessionError("No session provided", "/login");
      const session = await sessionManager.getSession(sessionId);
      if (!session) throw new InvalidOrExpiredSessionError("Invalid session", "/login");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      req.body['user'] = session.user;
      next();
    } catch (error) {
      if (error instanceof InvalidOrExpiredSessionError) {
        res.status(401).json({ error: error.message, redirect: error.redirect });
      } else {
        res.status(401).json({ error: 'Authentication failed', redirect: '/login' });
      }
      return;
    }
  };
}; 
