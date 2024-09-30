import { Hooks } from '../lib/hooks';
export declare function hookIterator(fn: any, req: any, res: any, next: any): any;
export declare const hookRunnerGenerator: (iterator: any) => (functions: any, req: any, res: any, cb: any) => void;
export declare const onListenHookRunner: (server: any) => void;
export declare const preParsingHookRunner: (functions: any, req: any, res: any, cb: any) => void;
export declare const buildHooks: (h: any) => Hooks;
