import * as Cookies from 'cookies';
import * as onHeaders from 'on-headers';
import { Buffer } from 'safe-buffer';

import { 
    ServerMiddleware, 
    Request, Response 
} from '@cmmv/server';

interface CookieParserOptions {
    name?: string;
    keys?: string[];
    secret?: string;
    overwrite?: boolean;
    httpOnly?: boolean;
    signed?: boolean;
}

export class CookieParserMiddleware extends ServerMiddleware {
    public middlewareName: string = "cookie-parser";
    private options: CookieParserOptions;

    constructor(options: CookieParserOptions) {
        super();
        this.options = options || {};
        this.options.name = this.options.name || 'session';
        this.options.overwrite = this.options.overwrite !== false;
        this.options.httpOnly = this.options.httpOnly !== false;
        this.options.signed = this.options.signed !== false;
        if (!this.options.keys && this.options.secret) this.options.keys = [this.options.secret];
        if (this.options.signed && !this.options.keys) throw new Error('.keys required.');
    }

    async process(req: Request, res: Response, next: Function) {
        const cookies = new Cookies(req.httpRequest, res.httpResponse, { keys: this.options.keys });
        let session: any;

        Object.defineProperty(req, 'session', {
            configurable: true,
            enumerable: true,
            get: () => session || (session = this.getSession(cookies, this.options.name)),
            set: (val) => session = val ? this.setSession(val) : false
        });

        onHeaders(res.httpResponse, () => this.saveSession(cookies, session));

        next();
    }

    private getSession(cookies: Cookies, name: string) {
        const str = cookies.get(name);
        if (str) return this.deserialize(str);
        return {};
    }

    private setSession(val: object) {
        return { ...val, isNew: true };
    }

    private saveSession(cookies: Cookies, session: any) {
        if (!session) return;
        if (session.isNew || session.isChanged) {
            const serialized = this.serialize(session);
            cookies.set(this.options.name, serialized, this.options);
        }
    }

    private serialize(session: any): string {
        const json = JSON.stringify(session);
        return Buffer.from(json).toString('base64');
    }

    private deserialize(str: string): object {
        const decoded = Buffer.from(str, 'base64').toString('utf8');
        return JSON.parse(decoded);
    }
}

export default function (options: CookieParserOptions) {
    return new CookieParserMiddleware(options);
}
