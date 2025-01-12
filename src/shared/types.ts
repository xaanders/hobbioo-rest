export type Session = {
  user: UserSession;
  expiresAt: number;
};

export type UserSession = {
  sub: string;
  email_verified: boolean;
  iss: string;
  "custom:user_id": string;
  "cognito:username": string;
  email: string;
  origin_jti: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  name: string;
  exp: number;
  iat: number;
};
