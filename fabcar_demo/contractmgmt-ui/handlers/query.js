/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();


var app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

app.use(express.static(__dirname + '/public'));


exports.log = async function(req, res) {
    console.log("query log")
    return "SUCCESS"
}
exports.queryTransaction = async function(req, res) {
    //new
    var queryResult = '';
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        //

        console.log('Transaction will be evaluated');

        //const result = await contract.evaluateTransaction('queryCar', 'CAR0');
        const result = await contract.evaluateTransaction('queryAllCtrs');
    
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        //new
        var data = result.toString();
        var data2 = [];
        var label = [];
        var values = [];
        var print = [];
        var output = [];

        for(var i =0; i<data.length; i++){
            if(data[i]!='{' && data[i]!='}' && data[i]!='[' && data[i]!=']' && data[i]!='"')
            {
                data2.push(data[i]);
            }
        }
        console.log("error1");
    // label

        var string;
        var j;
        for(var i=0; i< data2.length; i++){
            string="";
            if(i==0 || data2[i]==','){
                if(data2[i+1]==' '){
                    i+=16;
                }
                if(i==0){
                    j=i;
                }
                else{
                    j=i+1;
                }
                while(data2[j]!=':'){
                    string+=data2[j];
                    j++;
                }
                label.push(string);
                i=--j;
            }
        }
        console.log("error2");
        //values

        for(var i =0; i < data2.length;i++){
            string="";
            if(data2[i]==':'){
                if(data2[i+1]=='S' && data2[i+2]=='c' && data2[i+2]=='o'&& data2[i+2]=='p'&& data2[i+2]=='e'){
                    i+=17;
                }
                j=i+1;
                while(data2[j]!=','){
                    if(j==data2.length-1){
                        string+=data2[j];
                        break;

                    }
                    string+=data2[j];
                    j++;
                }
                values.push(string);
                i=--j;
            }
            
        }
        console.log("error4");
        console.log("error3");
        
            
            queryResult = (`Transaction has been evaluated, result is: ${data.toString()}`);

       
       /*app.get('/display', function (req, res, label, values){
           console.log("error");
        res.render('display.ejs',{
            label: label,
           values: values
        });        
    })*/



        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        //process.exit(1);
        //new
        queryResult = `Failed to enroll admin user "admin": ${error}`;
    }
    //new
    return data;
}

