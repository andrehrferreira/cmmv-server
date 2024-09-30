import * as http from 'node:http';
import * as http2 from 'node:http2';
import { IServerApplication } from './application.interface';
import { IRequest } from './request.interface';
export interface IRespose {
    readonly app: IServerApplication;
    readonly httpResponse: http.ServerResponse | http2.Http2ServerResponse;
    readonly req: IRequest;
    readonly res: http.ServerResponse | http2.Http2ServerResponse;
    statusCode: number;
    append(appendName: string, value: any): any;
    getHeader(headerName: string): any;
    setHeader(name: string, value: string): any;
    end(data?: string, encoding?: string, cb?: () => void): any;
}
