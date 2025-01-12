import { Request, Response, NextFunction } from 'express';
import { createRateLimiter } from './InMemoryRateLimiter.js';
import { IHelpers } from '../helpers/IHelpers.js';
import { UserSession } from '../../shared/types.js';

const makeRateLimitMiddleware = (helpers: IHelpers) => {
    const { rateLimit } = helpers.getSettings();

    const rateLimiter = createRateLimiter(rateLimit.maxRequests, rateLimit.timeWindowSec * 1000); // 5 requests per 60 seconds

    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.ip as string; // You can use other identifiers like the user ID if authenticated

        try {
            rateLimiter(key); // Check if the user has exceeded their limit
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const { email, 'custom:user_id': userId, name } = req?.body?.user as UserSession;
            helpers.logger(`Rate limit exceeded: ${JSON.stringify({
                error,
                user: { email, user_id: userId, name },
                ip: key
            })}`, "error");
            res.status(429).json({ error: 'Too many requests, please try again later.' });
        }
    };
}

export default makeRateLimitMiddleware;