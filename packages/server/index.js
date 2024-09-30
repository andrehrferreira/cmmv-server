"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.response = exports.request = exports.Route = exports.Router = exports.application = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./interfaces"), exports);
tslib_1.__exportStar(require("./lib"), exports);
/*!
 * CMMV
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 */
//import { json as bodyParserJSON } from '@cmmv/body-parser';
//import { urlencoded as bodyParserURLEncoded } from '@cmmv/body-parser';
//import { text as bodyParserText } from '@cmmv/body-parser';
//import { raw as bodyParserRaw } from '@cmmv/body-parser';
//import { default as ss } from '@cmmv/server-static';
const application_1 = require("./lib/application");
const router_1 = require("./lib/router");
const Utils = require("./utils");
const hooks_1 = require("./lib/hooks");
function CmmvServer(options) {
    const { server, listen } = (0, application_1.default)(options);
    const props = server.props?.slice();
    let _Server = { server };
    Object.setPrototypeOf(_Server, server);
    _Server.props = props;
    _Server.listen = (listenOptions) => {
        return new Promise((resolve, reject) => {
            server.on('error', reject);
            server.on('listening', () => {
                resolve(server.address());
                (0, hooks_1.onListenHookRunner)(server);
            });
            listen(listenOptions);
        });
    };
    return _Server;
}
exports.default = CmmvServer;
exports.application = application_1.default;
//export const json = bodyParserJSON;
//export const urlencoded = bodyParserURLEncoded;
//export const text = bodyParserText;
//export const raw = bodyParserRaw;
//export const serverStatic = ss;
exports.Router = router_1.Router;
exports.Route = router_1.Router;
exports.request = require('./lib/request');
exports.response = require('./lib/response');
exports.utils = Utils;
