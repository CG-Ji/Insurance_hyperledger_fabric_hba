/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Hospital extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
		
        console.info('============= END : Initialize Ledger ===========');
    }

    async LetStart(ctx) {
        return "This Org Can Query This Hospital Contract";
    }
	
	async getHistoryInsurance(ctx,key){
		const promiseOfIterator = ctx.stub.getHistoryForKey(key);
		const results = [];
		for await (const keyMod of promiseOfIterator) {
			const resp = {
				timestamp: keyMod.timestamp,
				txid: keyMod.tx_id
			}
			if (keyMod.is_delete) {
				resp.data = 'KEY DELETED';
			} else {
				resp.data = keyMod.value.toString('utf8');
			}
			results.push(resp);
		}
        console.info(results);
        return JSON.stringify(results);
		// results array contains the key history
	}

}

module.exports = Hospital;
