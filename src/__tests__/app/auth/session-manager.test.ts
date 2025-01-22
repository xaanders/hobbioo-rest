import { InMemorySessionManager } from '../../../app/auth/session-manager.js';
import { User } from '../../../entities/user.js';
import { UserSession } from '../../../app/auth/types.js';

describe('InMemorySessionManager', () => {
    let sessionManager: InMemorySessionManager;
    let mockUser: User;
    let mockUserSession: UserSession;

    beforeEach(() => {
        sessionManager = new InMemorySessionManager();

        mockUser = new User({
            user_id: 'test-user-id',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            user_type: 1,
            status: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        );

        mockUserSession = {
            sub: 'test-sub',
            email: 'john@example.com',
            name: "John Doe",
            email_verified: true,
            iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_1234567890',
            "custom:user_id": 'test-user-id',
            "cognito:username": 'test-username',
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
            iat: Math.floor(Date.now() / 1000),
            origin_jti: 'test-origin-jti',
            aud: 'test-aud',
            event_id: 'test-event-id',
            token_use: 'access',
            auth_time: Math.floor(Date.now() / 1000),
        };
    });

    describe('createSession', () => {
        it('should create a new session and return session ID', async () => {
            const sessionId = await sessionManager.createSession(mockUserSession, mockUser, 3600000);

            expect(sessionId).toBeDefined();
            expect(typeof sessionId).toBe('string');
        });
    });

    describe('getSession', () => {
        it('should return null for non-existent session', async () => {
            const session = await sessionManager.getSession('non-existent-id');
            expect(session).toBeNull();
        });

        it('should return session for valid session ID', async () => {
            const sessionId = await sessionManager.createSession(mockUserSession, mockUser, 3600000);
            const session = await sessionManager.getSession(sessionId);

            expect(session).toBeDefined();
            expect(session?.user.email).toBe(mockUser.email);
            expect(session?.user.user_id).toBe(mockUser.user_id);
        });

        it('should return null for expired session', async () => {
            const expiredUserSession = {
                ...mockUserSession,
                exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
            };

            const sessionId = await sessionManager.createSession(expiredUserSession, mockUser, -1);
            const session = await sessionManager.getSession(sessionId);

            expect(session).toBeNull();
        });
    });

    describe('removeSession', () => {
        it('should remove existing session', async () => {
            const sessionId = await sessionManager.createSession(mockUserSession, mockUser, 3600000);

            await sessionManager.removeSession(sessionId);
            const session = await sessionManager.getSession(sessionId);

            expect(session).toBeNull();
        });

        it('should not throw when removing non-existent session', async () => {
            await expect(sessionManager.removeSession('non-existent-id')).resolves.not.toThrow();
        });
    });
});
