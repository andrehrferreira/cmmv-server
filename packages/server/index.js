"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.res = exports.req = exports.Router = exports.serverStatic = exports.json = exports.application = void 0;
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
('use strict');
const body_parser_1 = require("@cmmv/body-parser");
const server_static_1 = require("@cmmv/server-static");
const events_1 = require("events");
const application_1 = require("./lib/application");
const router_1 = require("./lib/router");
const _1 = require(".");
const mixin = require('merge-descriptors');
exports.default = (options) => {
    const app = (0, application_1.CmmvServer)(options);
    mixin(app, events_1.EventEmitter.prototype, false);
    return app;
};
exports.application = application_1.CmmvServer;
exports.json = body_parser_1.json;
exports.serverStatic = server_static_1.default;
exports.Router = router_1.Router;
exports.req = _1.Request;
exports.res = _1.Response;
