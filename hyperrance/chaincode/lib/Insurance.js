/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Insurance extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const contractInsurance = [
            {
				name : "Covid 19 ชุดประหยัด",
                detail: "ราคาประหยัดสุดคุ้ม ทำครั้งเดียวได้ครบเครื่อง",
                price: "100000"
            },
            {
				name : "Covid 19 ชุด 2 in 1",
                detail: "ประกันสุขภาพ พร้อมนอนโรงพยาบาลฟรี ครบเครื่องในชุดเดียว",
                price: "200000"
            },
            {
				name : "Covid 19 ชุดหรูหรา",
                detail: "นอนโรงพยาบาลฟรี เดินทางฟรี ถ้าติดโรครักษาฟรี",
                price: "300000"
            }
        ];

        for (let i = 0; i < contractInsurance.length; i++) {
            await ctx.stub.putState('CI' + i, Buffer.from(JSON.stringify(contractInsurance[i])));
            console.info('Added <--> ', contractInsurance[i]);
        }
		
        console.info('============= END : Initialize Ledger ===========');
    }

    async LetStart(ctx) {
        return "This Org Can Query This Insurance Contract";
    }

    async queryAllContractInsurance(ctx) {
        const startKey = 'CI0';
        const endKey = 'CI999';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }


	
    async queryContractInsurance(ctx, contractInsuranceNumber) {
        const contractInsuranceAsBytes = await ctx.stub.getState(contractInsuranceNumber); // get the contractInsurance from chaincode state
        if (!contractInsuranceAsBytes || contractInsuranceAsBytes.length === 0) {
            throw new Error(`${contractInsuranceNumber} does not exist`);
        }
        console.log(contractInsuranceAsBytes.toString());
        return contractInsuranceAsBytes.toString();
    }
	
	
	
    async createContractInsurance(ctx, contractInsuranceNumber, name,detail,price) {
        console.info('============= START : Create contractInsurance ===========');
		const contractInsurance = 
            {
				name : name,
                detail: detail,
                price: price
            }
        await ctx.stub.putState(contractInsuranceNumber, Buffer.from(JSON.stringify(contractInsurance)));
        console.info('============= END : Create contractInsurance ===========');
    }



    async changeContractInsurance(ctx, contractInsuranceNumber , newValue) {
        console.info('============= START : changeContractInsurance ===========');

        const contractInsuranceAsBytes = await ctx.stub.getState(contractInsuranceNumber); // get the contractInsurance from chaincode state
        if (!contractInsuranceAsBytes || contractInsuranceAsBytes.length === 0) {
            throw new Error(`${contractInsuranceNumber} does not exist`);
        }
        const contractInsurance = JSON.parse(contractInsuranceAsBytes.toString());
        contractInsurance = newValue;

        await ctx.stub.putState(contractInsuranceNumber, Buffer.from(JSON.stringify(contractInsurance)));
        console.info('============= END : changeContractInsurance ===========');
    }

}

module.exports = Insurance;
