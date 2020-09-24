/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const Insurance_Con = require('./lib/Insurance');
const Hospital_Con = require('./lib/Hospital');
const Customer_Con = require('./lib/Customer');

module.exports.contracts = [ Insurance_Con ,Hospital_Con ,Customer_Con];
