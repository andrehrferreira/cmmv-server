import * as http from "node:http";
import * as http2 from "node:http2";
import * as url from "node:url";

export class Request {
    private req: http.IncomingMessage | http2.Http2ServerRequest;

    constructor(req: http.IncomingMessage | http2.Http2ServerRequest){
        this.req = req;
    }

    get httpRequest() {
        return this.req;
    }

    get method() {
        return this.req.method;
    }

    get path() {
        return url.parse(this.req.url, true).pathname;
    }
}