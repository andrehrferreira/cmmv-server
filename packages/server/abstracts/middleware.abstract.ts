import * as http from "node:http";
import { Request, Response } from "../lib"

export abstract class ServerMiddleware {
    public afterProcess: boolean = false;
    abstract middlewareName: string;    
    abstract process(req: Request | http.IncomingMessage, res: Response | http.ServerResponse, next?: Function);
}