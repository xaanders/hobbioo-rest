/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */

import { User } from "../../entities/user.js";
import { ISessionManager } from "./interfaces.js";
import { Session, UserSession } from "./types.js";
export class InMemorySessionManager implements ISessionManager {
  private sessions: Map<string, Session> = new Map();

  async createSession(userSession: UserSession, user: User, expiresIn: number): Promise<string> {
    const sessionId = crypto.randomUUID();

    const expiresAt = userSession.exp ? userSession.exp * 1000 : Date.now() + expiresIn;

    const userJson = user.toJson();
    this.sessions.set(sessionId, {
      user: {
        session: userSession,
        user: {
          user_id: userJson.user_id,
          first_name: userJson.first_name,
          last_name: userJson.last_name,
          email: userJson.email,
          user_type: userJson.user_type,
          createdAt: userJson.created_at,
          updatedAt: userJson.updated_at,
        },
      },
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

