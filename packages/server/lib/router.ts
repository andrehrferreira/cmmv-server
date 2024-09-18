import * as url from "node:url";
import { BiIndexMap } from "../utils";
import { Request } from "./request";
import { Response } from "./response";

export class Router {
    private index: BiIndexMap = new BiIndexMap();

    public get(path: string | RegExp, callback: (req: Request, res?: Response, next?: Function) => void){
        this.index.set("get", path, callback);
    }

    public async process(socket, req, res): Promise<{ request: Request, response: Response, fn: Function } | null> {
        const method = req.method;
        const parsedUrl = url.parse(req.url, true);
        const fn = await this.index.get(method, parsedUrl.pathname);

        if(fn) {
            const request = new Request(socket, req, res);
            const response = new Response(socket, req, res);
            return { request, response, fn };
        }

        return null;
    }   
}