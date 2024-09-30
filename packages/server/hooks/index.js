"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedHooks = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./application"), exports);
tslib_1.__exportStar(require("./request"), exports);
tslib_1.__exportStar(require("./response"), exports);
tslib_1.__exportStar(require("./utils"), exports);
const applicationHooks = [
    'onRoute',
    'onRegister',
    'onReady',
    'onListen',
    'preClose',
    'onClose',
];
const lifecycleHooks = [
    'onTimeout',
    'onRequest',
    'preParsing',
    'preValidation',
    'preSerialization',
    'preHandler',
    'onSend',
    'onResponse',
    'onError',
    'onRequestAbort',
];
exports.supportedHooks = lifecycleHooks.concat(applicationHooks);
