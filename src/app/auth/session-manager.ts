/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { ISessionManager } from "../../gateways/session-manager.js";
import { Session, UserSession } from "../../shared/types.js";

export class InMemorySessionManager implements ISessionManager {
  private sessions: Map<string, Session> = new Map();

  async createSession(userData: UserSession, expiresIn: number): Promise<string> {
    const sessionId = crypto.randomUUID();

    const expiresAt = userData.exp ? userData.exp * 1000 : Date.now() + expiresIn;

    this.sessions.set(sessionId, {
      user: userData,
      expiresAt: expiresAt,
    });
    return sessionId;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const session = this.sessions.get(sessionId);
    console.log("sessions", this.sessions);
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
