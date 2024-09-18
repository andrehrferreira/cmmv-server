import * as http from "node:http";
import * as https from "node:https";
import * as http2 from "node:http2";

import { 
    StaticOptions,
    ServerStaticMiddleware 
} from "@cmmv/server-static";

import { Router } from "./router";
import { ServerMiddleware } from "../abstracts";
import { Request } from "./request";
import { Response } from "./response";

import { 
    ServerOptions, 
    ServerHTTP2Options,
    DefaultServerOptions,
    DefaultServerHTTP2Options
} from "../interfaces";

const {
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_INTERNAL_SERVER_ERROR
} = http2.constants;

export class Server {
    private isHTTP2: boolean = false;
    private socket: http.Server | https.Server | http2.Http2Server | http2.Http2SecureServer;
    private options: http.ServerOptions | https.ServerOptions | http2.ServerOptions | http2.SecureServerOptions;
    private middlewares: Set<ServerMiddleware> = new Set<ServerMiddleware>();
    private staticServer: ServerStaticMiddleware | null = null;
    private router: Router = new Router();

    constructor(options?: ServerOptions){
        this.isHTTP2 = (options?.http2 === true) || false;

        this.options = this.isHTTP2 ? 
            new DefaultServerHTTP2Options(options).ToOptions() :
            new DefaultServerOptions(options).ToOptions() ;

        if(!this.isHTTP2){
            this.socket = (options.key && options.cert) ? 
                https.createServer(this.options as https.ServerOptions, (req, res) => this.onListener(req, res)) :
                http.createServer(this.options as http.ServerOptions, (req, res) => this.onListener(req, res));
        }
        else {
            this.socket = (options.key && options.cert) ? 
                http2.createSecureServer(this.options as http2.SecureServerOptions, (req, res) => this.onListener(req, res)) :
                http2.createServer(this.options as http2.ServerOptions, (req, res) => this.onListener(req, res));
        }
    }

    private async onListener(req, res){
        const path = req.url;
        const hasFileExtension = /\.\w+$/.test(path);

        if (hasFileExtension && this.staticServer) {
            this.staticServer.process(req, res, (err) => this.processRequest(req, res));
        } else {
            this.processRequest(req, res);
        }
    }

    private async processRequest(req, res) {
        const middlewares = Array.from(this.middlewares);
        const route = await this.router.process(req, res);

        try {   
            const processMiddleware = async (index: number, after: boolean = false) => {
                if (index < middlewares.length && route) {
                    const middleware = middlewares[index];

                    if(!route.response.sended){
                        if(middleware.afterProcess === after)
                            middleware.process(route.request, route.response, () => 
                                processMiddleware(index + 1, after)
                            );
                        else 
                            processMiddleware(index + 1, after);
                    }
                } else if(route) { 
                    if(!route.response.sended){
                        if(!after){
                            await route?.fn(route.request, route.response);
                            processMiddleware(0, true);   
                        }    
                        else if (route) {        
                            res.writeHead(route.response.statusCode);
                            res.end(route.response.buffer);                   
                        } else {
                            res.writeHead(HTTP_STATUS_NOT_FOUND);
                            res.end("Not Found");
                        }
                    }                    
                }
                else {
                    res.writeHead(HTTP_STATUS_NOT_FOUND);
                    res.end("Not Found");
                }
            };

            await processMiddleware(0);
        }
        catch(err){
            console.error(err);
            res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            res.end(err.message);
        }
    }

    public Router() : Router{
        return new Router();
    }

    public static(root: string, options?: StaticOptions): ServerStaticMiddleware {
        return new ServerStaticMiddleware(root, options);
    }

    public use(app: ServerMiddleware | Router | ServerStaticMiddleware): void {
        if(app instanceof Router) {
            this.router = app;
        } else if (app instanceof ServerStaticMiddleware) {
            this.staticServer = app;  
        } else {
            this.middlewares.add(app);
        }
    }

    public get(path: string | RegExp, callback: (req: Request, res?: Response, next?: Function) => void){
        this.router.get(path, callback);
    }

    public listen(port: number, host?: string, callback?: () => void): void {
        this.socket.listen({
            port, host
        }, callback);
    }
}

export const CmmvServer = (options?: ServerOptions) => {
    return new Server(options);
}