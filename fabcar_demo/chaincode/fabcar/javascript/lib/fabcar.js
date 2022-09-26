/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const ctrmgmts = [
            {
             Scope: 'major gas turbine servicing',
	     Start_date: '04-01-2022',
             End_date: '04-30-2022',
	     Contract_value: '$50000',
	     Contract_performance_manager: 'Paul',
	     Sales: 'Tim',
	     Service_manager: 'Harshit',
	     End_customer: 'Joshwa', 
            },
            {
             Scope: 'minor gas turbine servicing',
	     Start_date: '10-01-2022',
             End_date: '06-30-2022',
	     Contract_value: '$150000',
	     Contract_performance_manager: 'Shijoy',
	     Sales: 'Derbie',
	     Service_manager: 'Peter',
	     End_customer: 'Jenny', 
            },
            {
             Scope: 'major gas turbine servicing',
	     Start_date: '4-14-2022',
             End_date: '9-17-2022',
	     Contract_value: '$10000',
	     Contract_performance_manager: 'Namit',
	     Sales: 'Tina',
	     Service_manager: 'Mohit',
	     End_customer: 'Joseph', 
            },
            {
             Scope: 'minor gas turbine servicing',
	     Start_date: '05-11-2022',
             End_date: '11-25-2022',
	     Contract_value: '$250000',
	     Contract_performance_manager: 'Rohit',
	     Sales: 'Faiz',
	     Service_manager: 'Ishan',
	     End_customer: 'Atishay', 
            },
        ];

        for (let i = 0; i < ctrmgmts.length; i++) {
            ctrmgmts[i].docType = 'ctrmgmt';
            await ctx.stub.putState('CTRMGMT' + i, Buffer.from(JSON.stringify(ctrmgmts[i])));
            console.info('Added <--> ', ctrmgmts[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCtr(ctx, ctrNumber) {
        const ctrAsBytes = await ctx.stub.getState(ctrNumber); // get the contract from chaincode state
        if (!ctrAsBytes || ctrAsBytes.length === 0) {
            throw new Error(`${ctrNumber} does not exist`);
        }
        console.log(ctrAsBytes.toString());
        return ctrAsBytes.toString();
    }

    async createCtr(ctx, ctrNumber, Scope, Start_date, End_date, Contract_value, Contract_performance_manager, Sales, Service_manager, End_customer) {
        console.info('============= START : Create Contract ===========');

        const ctr = {
             
             Scope,
	     Start_date,
             End_date,
	     Contract_value,
	     Contract_performance_manager,
	     Sales,
	     Service_manager,
	     End_customer,
	     docType:'ctrmgmt',
        };

        await ctx.stub.putState(ctrNumber, Buffer.from(JSON.stringify(ctr)));
        console.info('============= END : Create Contract ===========');
    }

    async queryAllCtrs(ctx) {
        const startKey = 'CTRMGMT0';
        const endKey = '';
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

    async changeCtrScope(ctx, ctrNumber, Scope) {
        console.info('============= START : changeContractScope ===========');

        const ctrAsBytes = await ctx.stub.getState(ctrNumber); // get the contract from chaincode state
        if (!ctrAsBytes || ctrAsBytes.length === 0) {
            throw new Error(`${ctrNumber} does not exist`);
        }
        const ctr = JSON.parse(ctrAsBytes.toString());
        ctr.Scope = Scope;

        await ctx.stub.putState(ctrNumber, Buffer.from(JSON.stringify(ctr)));
        console.info('============= END : changeContractScope ===========');
    }
    async changeCtrStartdate(ctx, ctrNumber, Start_date) {
        console.info('============= START : changeContractStartdate ===========');

        const ctrAsBytes = await ctx.stub.getState(ctrNumber); // get the contract from chaincode state
        if (!ctrAsBytes || ctrAsBytes.length === 0) {
            throw new Error(`${ctrNumber} does not exist`);
        }
        const ctr = JSON.parse(ctrAsBytes.toString());
        ctr.Start_date = Start_date;

        await ctx.stub.putState(ctrNumber, Buffer.from(JSON.stringify(ctr)));
        console.info('============= END : changeContractStartdate ===========');
    }
    async changeCtrEnddate(ctx, ctrNumber, End_date) {
        console.info('============= START : changeContractEnddate ===========');

        const ctrAsBytes = await ctx.stub.getState(ctrNumber); // get the contract from chaincode state
        if (!ctrAsBytes || ctrAsBytes.length === 0) {
            throw new Error(`${ctrNumber} does not exist`);
        }
        const ctr = JSON.parse(ctrAsBytes.toString());
        ctr.End_date = End_date;

        await ctx.stub.putState(ctrNumber, Buffer.from(JSON.stringify(ctr)));
        console.info('============= END : changeContractEnddate ===========');
    }
    async changeCtrContractvalue(ctx, ctrNumber, Contract_value) {
        console.info('============= START : changeContractvalue ===========');

        const ctrAsBytes = await ctx.stub.getState(ctrNumber); // get the contract from chaincode state
        if (!ctrAsBytes || ctrAsBytes.length === 0) {
            throw new Error(`${ctrNumber} does not exist`);
        }
        const ctr = JSON.parse(ctrAsBytes.toString());
        ctr.Contract_value = Contract_value;

        await ctx.stub.putState(ctrNumber, Buffer.from(JSON.stringify(ctr)));
        console.info('============= END : changeContractvalue ===========');
    }
    	
    	async retrieveHistory(ctx, ctrNumber) 
    	{
    	console.info('getting history for key: ' + ctrNumber);
    	let iterator = await ctx.stub.getHistoryForKey(ctrNumber);
    	let result = [];
    	let res = await iterator.next();
    	while (!res.done) {
      	if (res.value) {
        console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
        const obj = JSON.parse(res.value.value.toString('utf8'));
        result.push(obj);
      	}
      	res = await iterator.next();
    	}
    	await iterator.close();
    	return result;
  }

    
}

module.exports = FabCar;
