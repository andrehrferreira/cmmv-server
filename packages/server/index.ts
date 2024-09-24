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
import { EventEmitter } from 'events';
import { CmmvServer } from './lib/application';
import { Router as router } from './lib/router';
import * as Utils from './utils';

import { Request, Response } from '.';
import { ServerOptions } from './interfaces';

const mixin = require('merge-descriptors');

export default (options?: ServerOptions) => {
    const app = CmmvServer(options);
    mixin(app, EventEmitter.prototype, false);
    return app;
};

export const application = CmmvServer;
export const json = bodyParserJSON;
export const urlencoded = bodyParserURLEncoded;
export const text = bodyParserText;
export const raw = bodyParserRaw;

export const serverStatic = ss;
export const Router = router;
export const Route = router;

export const req = Request;
export const res = Response;

export const utils = Utils;
