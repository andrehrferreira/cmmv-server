export * from './interfaces';
export * from './lib';

/*!
 * CMMV
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 */

import { json as bodyParserJSON } from '@cmmv/body-parser';
import { urlencoded as bodyParserURLEncoded } from '@cmmv/body-parser';
import { text as bodyParserText } from '@cmmv/body-parser';
import { raw as bodyParserRaw } from '@cmmv/body-parser';
import { default as ss } from '@cmmv/server-static';
import app from './lib/application';
import { Router as router } from './lib/router';
import * as Utils from './utils';

import { onListenHookRunner } from './lib/hooks';

function CmmvServer(this: any, options?): any {
    const { server, listen } = app(options);
    const props = server.props?.slice();

    let _Server: any = { server };
    Object.setPrototypeOf(_Server, server);

    _Server.props = props;
    _Server.listen = (listenOptions: { host: string; port: number }) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                server.on('error', reject);
                server.on('listening', () => {
                    resolve(server.address());
                    onListenHookRunner(server);
                });
                listen(listenOptions);
            }, 100);
        });
    };

    return _Server;
}

export default CmmvServer;
export const application = app;
export const json = bodyParserJSON;
export const urlencoded = bodyParserURLEncoded;
export const text = bodyParserText;
export const raw = bodyParserRaw;

export const serverStatic = ss;
export const Router = router;
export const Route = router;

export const request = require('./lib/request');
export const response = require('./lib/response');
export const utils = Utils;
