import * as FindMyWay from 'find-my-way';

export class Router {
    public router: FindMyWay.Instance<FindMyWay.HTTPVersion.V2>;

    public stack: Map<FindMyWay.HTTPMethod, Array<Function>> = new Map<
        FindMyWay.HTTPMethod,
        Array<Function>
    >();

    constructor(private path: string = '') {
        if (!this.router) {
            this.router = FindMyWay({
                caseSensitive: false,
                ignoreTrailingSlash: true,
                ignoreDuplicateSlashes: true,
                allowUnsafeRegex: true,
            });

            this.stack = new Map<FindMyWay.HTTPMethod, Array<Function>>();
        }
    }

    public route: FindMyWay.Instance<FindMyWay.HTTPVersion.V2>;

    public find(method: string, path: string) {
        return new Promise((resolve, reject) => {
            const httpMethod = method as FindMyWay.HTTPMethod;

            if (this.router.hasRoute(httpMethod, path)) {
                const route = this.router.find(httpMethod, path);
                resolve(route);
            } else {
                reject();
            }
        });
    }

    private mergeRoutes(
        method: FindMyWay.HTTPMethod,
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (typeof path !== 'function') {
            let finalPath = this.path ? this.path + path : path;

            if (!this.router.hasRoute(method, finalPath)) {
                this.router.on(method, finalPath, (req, res) => {}, {
                    stack: callbacks,
                });
            } else {
                const handler = this.router.find(method, finalPath);
                this.router.off(method, finalPath);
                this.router.on(method, finalPath, (req, res) => {}, {
                    stack: [...handler.store.stack, ...callbacks],
                });
            }
        }
    }

    public get(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('GET', path, ...callbacks);
        this.mergeRoutes('HEAD', path, ...callbacks);
    }

    public use(path: string, fn: Function) {
        console.log(path, fn);
    }
}
