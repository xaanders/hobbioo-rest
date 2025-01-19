export type Session = {
    user: {
        session: UserSession;
        user: {
            user_id: string;
            first_name: string;
            last_name: string;
            email: string;
            user_type: number;
            createdAt: string;
            updatedAt: string;
        };
    };
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
