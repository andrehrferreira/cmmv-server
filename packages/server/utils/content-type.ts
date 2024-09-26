/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/jshttp/content-type/blob/master/index.js
 */

/**
 * RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
 *
 * parameter     = token "=" ( token / quoted-string )
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 * quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
 * qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
 * obs-text      = %x80-FF
 * quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
 */
const PARAM_REGEXP =
    /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g; // eslint-disable-line no-control-regex
const TEXT_REGEXP = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/; // eslint-disable-line no-control-regex
const TOKEN_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;

/**
 * RegExp to match quoted-pair in RFC 7230 sec 3.2.6
 *
 * quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
 * obs-text    = %x80-FF
 */
const QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g; // eslint-disable-line no-control-regex

/**
 * RegExp to match chars that must be quoted-pair in RFC 7230 sec 3.2.6
 */
const QUOTE_REGEXP = /([\\"])/g;

/**
 * RegExp to match type in RFC 7231 sec 3.1.1.1
 *
 * media-type = type "/" subtype
 * type       = token
 * subtype    = token
 */
const TYPE_REGEXP =
    /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;

/**
 * Format object to media type.
 *
 * @param {object} obj
 * @return {string}
 * @public
 */
export const contentTypeFormat = obj => {
    if (!obj || typeof obj !== 'object')
        throw new TypeError('argument obj is required');

    const parameters = obj.parameters;
    const type = obj.type;

    if (!type || !TYPE_REGEXP.test(type)) throw new TypeError('invalid type');

    let string = type;

    if (parameters && typeof parameters === 'object') {
        let param;
        let params = Object.keys(parameters).sort();

        for (let i = 0; i < params.length; i++) {
            param = params[i];

            if (!TOKEN_REGEXP.test(param))
                throw new TypeError('invalid parameter name');

            string += '; ' + param + '=' + qstring(parameters[param]);
        }
    }

    return string;
};

/**
 * Parse media type to object.
 *
 * @param {string|object} string
 * @return {Object}
 * @public
 */
export const contentTypeParse = (string: string) => {
    if (!string) throw new TypeError('argument string is required');

    const header = typeof string === 'object' ? getcontenttype(string) : string;

    if (typeof header !== 'string')
        throw new TypeError('argument string is required to be a string');

    var index = header.indexOf(';');
    var type = index !== -1 ? header.slice(0, index).trim() : header.trim();

    if (!TYPE_REGEXP.test(type)) throw new TypeError('invalid media type');

    const obj = new ContentType(type.toLowerCase());

    if (index !== -1) {
        let key;
        let match;
        let value;

        PARAM_REGEXP.lastIndex = index;

        while ((match = PARAM_REGEXP.exec(header))) {
            if (match.index !== index)
                throw new TypeError('invalid parameter format');

            index += match[0].length;
            key = match[1].toLowerCase();
            value = match[2];

            if (value.charCodeAt(0) === 0x22 /* " */) {
                value = value.slice(1, -1);

                if (value.indexOf('\\') !== -1)
                    value = value.replace(QESC_REGEXP, '$1');
            }

            obj.parameters[key] = value;
        }

        if (index !== header.length)
            throw new TypeError('invalid parameter format');
    }

    return obj;
};

export default { format: contentTypeFormat, parse: contentTypeParse };

/**
 * Get content-type from req/res objects.
 *
 * @param {object}
 * @return {Object}
 * @private
 */
function getcontenttype(obj) {
    let header;

    if (typeof obj.getHeader === 'function')
        header = obj.getHeader('content-type');
    else if (typeof obj.headers === 'object')
        header = obj.headers && obj.headers['content-type'];

    if (typeof header !== 'string')
        throw new TypeError('content-type header is missing from object');

    return header;
}

/**
 * Quote a string if necessary.
 *
 * @param {string} val
 * @return {string}
 * @private
 */
function qstring(val) {
    let str = String(val);

    if (TOKEN_REGEXP.test(str)) return str;

    if (str.length > 0 && !TEXT_REGEXP.test(str))
        throw new TypeError('invalid parameter value');

    return '"' + str.replace(QUOTE_REGEXP, '\\$1') + '"';
}

/**
 * Class to represent a content type.
 * @private
 */
function ContentType(this: any, type) {
    this.parameters = Object.create(null);
    this.type = type;
}

/**
 * Set the charset in a given Content-Type string.
 *
 * @param {String} type
 * @param {String} charset
 * @return {String}
 * @api private
 */
export const setCharset = (type: string, charset: string) => {
    if (!type || !charset) return type;

    const parsed = contentTypeParse(type);
    parsed.parameters.charset = charset;
    return contentTypeFormat(parsed);
};
