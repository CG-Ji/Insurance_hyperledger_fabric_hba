/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Customer extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
		
        console.info('============= END : Initialize Ledger ===========');
    }

    async LetStart(ctx) {
        return "This Org Can Query This Customer Contract";
    }
	
    async queryCustomer(ctx, customerNumber) {
        const rusultAsBytes = await ctx.stub.getState(customerNumber); // get the contractInsurance from chaincode state
        if (!rusultAsBytes || rusultAsBytes.length === 0) {
            throw new Error(`${customerNumber} does not exist`);
        }
        console.log(rusultAsBytes.toString());
        return rusultAsBytes.toString();
    }
	
	
    async createCustomer(ctx, username, passwd,firstname,lastname,cardid) {
        console.info('============= START : Create contractInsurance ===========');
		const insurance = 
            {
				username : username,
                passwd: passwd,
				firstname:firstname,
				lastname:lastname,
				cardid:cardid,
				insurance:[]
            }
        await ctx.stub.putState(username, Buffer.from(JSON.stringify(insurance)));
        console.info('============= END : Create contractInsurance ===========');
    }

    async createCustomerInsurance(ctx, customerNumber , ObjectInsurance) {
        console.info('============= START : changeInsurance ===========');

        const rusultAsBytes = await ctx.stub.getState(customerNumber); // get the contractInsurance from chaincode state
        if (!rusultAsBytes || rusultAsBytes.length === 0) {
            throw new Error(`${customerNumber} does not exist`);
        }
        const result_insurance = JSON.parse(rusultAsBytes.toString());
        result_insurance.insurance.push(ObjectInsurance)

        await ctx.stub.putState(customerNumber, Buffer.from(JSON.stringify(result_insurance)));
        console.info('============= END : changeInsurance ===========');
    }

    async updateCustomerInsurance(ctx, customerNumber , ObjectInsurance,index) {
        console.info('============= START : changeInsurance ===========');

        const rusultAsBytes = await ctx.stub.getState(customerNumber); // get the contractInsurance from chaincode state
        if (!rusultAsBytes || rusultAsBytes.length === 0) {
            throw new Error(`${customerNumber} does not exist`);
        }
        const result_insurance = JSON.parse(rusultAsBytes.toString());
        result_insurance.insurance[index] = ObjectInsurance;
        await ctx.stub.putState(customerNumber, Buffer.from(JSON.stringify(result_insurance)));
        console.info('============= END : changeInsurance ===========');
    }
}

module.exports = Customer;
