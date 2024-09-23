'use strict';

import * as http from 'node:http';

let req = Object.create(http.IncomingMessage.prototype);
module.exports = req;
