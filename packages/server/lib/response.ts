import * as vary from "vary";
import * as onHeaders from "on-headers";
import * as accepts from "accepts";
import * as send from "send";
import { Buffer } from "safe-buffer";

import * as http from "node:http";
import * as https from "node:https";
import * as http2 from "node:http2";

const {
    HTTP_STATUS_OK,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_INTERNAL_SERVER_ERROR
} = http2.constants;

import { CookieOptions } from "../interfaces/cookies-options.interface";

import { Server } from "./server";

export class Response {
    public buffer: Buffer;
    public statusCode: number = HTTP_STATUS_OK;
    public accept;
    public headers: any = {};
    public sended: boolean = false;

    constructor(
        public readonly app: Server,
        private readonly req: http.IncomingMessage | http2.Http2ServerRequest, 
        private readonly res: http.ServerResponse | http2.Http2ServerResponse
    ){
        this.accept = accepts(req);
        const self = this;

        onHeaders(this.res, function (this: http.ServerResponse | http2.Http2ServerResponse) {
            for(const keyHeader in self.headers){
                this.setHeader(keyHeader, self.headers[keyHeader]);
            }                
        });
    }

    get httpResponse() {
        return this.res;
    }

    public append(appendName: string, value: any){
        
    }

    public attachment(contentType?: string){

    }

    public cookie(name: string, value: string, options?: CookieOptions) {

    }

    public clearCookie(name: string, options?: CookieOptions) {

    }

    public download(path: string, filename?: string, ){

    }

    public end(data?: string, encoding?: string){
        this.buffer = Buffer.from(data, encoding);
    }

    public format(object: Object){

    }

    public get(headerName: string): string {
        return this.headers[headerName];
    }

    public json(body?: any){

    }

    public jsonp(body?: any){
        
    }

    public links(links?: Object){
        
    }

    public location(path: string){
        
    }

    public redirect(pathOrStatus: string | number, path?: string) {
        
    }

    public render(view: string, locals?: any, callback?: (err: any, html: string) => void) {

    }

    public send(body?: string | Object | Buffer) {
        if(!this.sended){
            if(typeof body === "object") {
                if(!this.headers["Content-Type"] && this.accept.type(['json']) === "json")
                    this.headers["Content-Type"] = "application/json";
    
                this.buffer = Buffer.from(JSON.stringify(body), "utf8");
            }
            else if(typeof body === "string") {
                if(!this.headers["Content-Type"] && this.accept.type(['html']) === "html")
                    this.headers["Content-Type"] = "text/html";
    
                this.buffer = Buffer.from(body, "utf8");
            }
            else {
                if(!this.headers["Content-Type"])
                    this.headers["Content-Type"] = "application/octet-stream";
    
                this.buffer = new Buffer(body);
            }
        }
    }

    public sendFile(path: string, options?: send.SendOptions, fn?: (err: any) => void): void {
        if(!this.sended){      
            this.sended = true;      
            const stream = send(this.req, path, options);

            stream.on('error', (err) => {
                if (fn) return fn(err);
                this.res.writeHead(HTTP_STATUS_NOT_FOUND);
                return this.res.end('File not found');
            });
        
            stream.pipe(this.res);
        }
    }   

    public sendStatus(statusCode: number): Response {
        this.statusCode = statusCode;
        this.res.statusCode = statusCode;
        this.res.end(http.STATUS_CODES[statusCode]);
        return this;
    }
    
    public set(field: string | Object, value?: string) : void {
        if(typeof field == "object"){
            for(const key in field)
                this.headers[key] = field[key];
        }
        else {
            this.headers[field] = value;
        }
    }

    public setHeader(field: string, value?: string){
        this.set(field, value);
    }

    public remove(field: string){
        delete this.headers[field];
    }

    public removeHeader(field: string){
        this.remove(field);
    }

    public status(code: number) : Response {
        
        return this;
    }

    public type(type: string) : Response {
        
        return this;
    }

    public vary(field: string) : Response {
        vary(this.res, field);
        return this;
    } 
}