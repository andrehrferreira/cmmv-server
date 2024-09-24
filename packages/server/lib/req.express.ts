'use strict';

import * as http from 'node:http';

const req = Object.create(http.IncomingMessage.prototype);
module.exports = req;
