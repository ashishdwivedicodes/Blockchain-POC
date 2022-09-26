/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const express = require('express');
var app = express();
const router = express.Router();
const User = require('../models/user');
//
const { kStringMaxLength } = require('buffer');

bodyParser = require("body-parser"),
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

exports.log = async function(req, res) {
    console.log("invoke log")
    return "SUCCESS"
}
var check =0;
exports.updatesc= async function(req, res){
    //new
    var result = '';
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        console.log("error1");
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
        
        console.log("error2");
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        console.log("error3");
        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        console.log("error4");
        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        if(check == 0){
        console.log("error6"); 
        await contract.submitTransaction('changeCtrScope', 'ctrNumber0.038574363728265615' ,'POP' );
        console.log("error5");
        console.log('Transaction has been submitted');
        //new
        result = 'Transaction has been submitted';
        check =1;
        }
        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        //process.exit(1);
        //new
        result = `Failed to submit transaction: ${error}`;
    }
    //new
    if(check == 1)
    return result;
}