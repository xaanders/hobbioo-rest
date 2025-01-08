import { Session } from "../shared/types.js";

export interface ISessionManager {
    createSession(userData: any): Promise<string>;
    getSession(sessionId: string): Promise<Session | null>;
    removeSession(sessionId: string): Promise<void>;
}