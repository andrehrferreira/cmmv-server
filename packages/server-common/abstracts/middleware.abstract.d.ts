import * as http from 'node:http';
import * as http2 from 'node:http2';
import { IRequest, IRespose } from '../interfaces';
import { INext } from '../types';
export declare abstract class ServerMiddleware {
    afterProcess: boolean;
    abstract middlewareName: string;
    abstract process(req: IRequest | http.IncomingMessage | http2.Http2ServerRequest, res: IRespose | http.ServerResponse | http2.Http2ServerResponse, next?: INext | Function): any;
}
