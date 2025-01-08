/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { ISessionManager } from "../../gateways/session-manager.js";
import { Session } from "../../shared/types.js";

export class InMemorySessionManager implements ISessionManager {
  private sessions: Map<string, Session> = new Map();

  async createSession(userData: any): Promise<string> {
    const sessionId = crypto.randomUUID();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

    this.sessions.set(sessionId, {
      user: userData,
      expiresAt
    });

    return sessionId;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const session = this.sessions.get(sessionId);
    
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  async removeSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }
} 