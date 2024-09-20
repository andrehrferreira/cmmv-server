import * as http from 'node:http';
import { IRequest, IRespose } from '../interfaces';
import { INext } from '../types';
export declare abstract class ServerMiddleware {
    afterProcess: boolean;
    abstract middlewareName: string;
    abstract process(req: IRequest | http.IncomingMessage, res: IRespose | http.ServerResponse, next?: INext | Function): any;
}
