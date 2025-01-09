export class AuthError extends Error {
    debug: string;

    constructor(message: string, debug?: string) {
        super(message);
        this.name = "AuthError";
        this.debug = debug || "";
    }
}

export class InvalidOrExpiredSessionError extends AuthError {
    redirect: string;
    constructor(message: string, redirect?: string) {
        super(message);
        this.name = "InvalidOrExpiredSessionError";
        this.redirect = redirect || "";
    }
}
