import * as http from 'node:http';
import * as http2 from 'node:http2';

import { IServerApplication } from './application.interface';

export interface IRespose {
    readonly app: IServerApplication;
    readonly httpResponse: http.ServerResponse | http2.Http2ServerResponse;
    readonly req: http.IncomingMessage | http2.Http2ServerRequest;
    readonly res: http.ServerResponse | http2.Http2ServerResponse;
    statusCode: number;
    append(appendName: string, value: any);
    getHeader(headerName: string);
    setHeader(name: string, value: string);
    end(data?: string, encoding?: string, cb?: () => void);
}
