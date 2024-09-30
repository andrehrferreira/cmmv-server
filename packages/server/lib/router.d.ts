import * as FindMyWay from 'find-my-way';
export declare class Router {
    private path;
    router: FindMyWay.Instance<FindMyWay.HTTPVersion.V2>;
    stack: Map<FindMyWay.HTTPMethod, Array<Function>>;
    constructor(path?: string);
    route: FindMyWay.Instance<FindMyWay.HTTPVersion.V2>;
    find(method: string, path: string): Promise<unknown>;
    private mergeRoutes;
    get(path: string | Function, ...callbacks: Array<(req: Request, res: Response, next?: Function) => void>): void;
    use(path: string, fn: Function): void;
}
