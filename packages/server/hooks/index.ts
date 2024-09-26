export * from './application';
export * from './request';
export * from './response';
export * from './utils';

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

export const supportedHooks = lifecycleHooks.concat(applicationHooks);
