export interface CookieOptions {
    domain?: string;
    encode?: Function;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    partitioned?: boolean;
    priority?: string;
    secure: boolean;
    signed: boolean;
    sameSite: boolean | string;
}
