import { Session, UserSession } from "../shared/types.js";

export interface ISessionManager {
  createSession(userData: UserSession, expiresIn: number): Promise<string>;
  getSession(sessionId: string): Promise<Session | null>;
  removeSession(sessionId: string): Promise<void>;
}
