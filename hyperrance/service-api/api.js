/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(cors());
var admin_id_list=["insurancecore","hospitalcore","customercore"] //fix
var admin_user_list=["insurancecorepw","hospitalcorepw","customercorepw"] //fix
var org_name_list=["insurance","hospital","customer"] //fix
var org_msp_list=["InsuranceMSP","HospitalMSP","CustomerMSP"] //fix
var client_id_list=["insuranceclient","hospitalclient","customerclient"] //fix
var client_user_list=["insuranceclientpw","hospitalclientpw","customerclientpw"] //fix

/* ========================================== User Command ========================================== */
async function enroll(userid,pass,indexorg) {
    try {
		var orgname = org_name_list[indexorg]
		var orgnameMSP =  org_msp_list[indexorg]
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'hyperledger', 'organizations', 'peerOrganizations', `${orgname}.covid-ins.com`, `connection-${orgname}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities[`ca.${orgname}.covid-ins.com`];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
		// console.log(caInfo.url);return;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userid);
        if (identity) {
            console.log(`An identity for the user "${userid}" already exists in the wallet`);
            return;
        }

        // Enroll the user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: userid, enrollmentSecret: pass });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: orgnameMSP,
            type: 'X.509',
        };
        await wallet.put(userid, x509Identity);
        console.log(`Successfully enrolled user "${userid}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to enroll user "${userid}": ${error}`);
        process.exit(1);
    }
}

async function register(userid,pass,indexorg) {
    try {
		var orgname = org_name_list[indexorg]
		var orgnameMSP =  org_msp_list[indexorg]
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'hyperledger', 'organizations', 'peerOrganizations', `${orgname}.covid-ins.com`, `connection-${orgname}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities[`ca.${orgname}.covid-ins.com`];
        const ca = new FabricCAServices(caURL);
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(userid);
        if (userIdentity) {
            console.log('An identity for the user "insuranceclient" already exists in the wallet');
            return;
        }
        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get(admin_id_list[indexorg]);
        if (!adminIdentity) {
            console.log('An identity for the admin user "insuranceadmin" does not exist in the wallet');
            return;
        }
        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, "admin");
        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            // affiliation: 'org1.department1',
            enrollmentID: userid,
            role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: userid,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: orgnameMSP,
            type: 'X.509',
        };
        await wallet.put(userid, x509Identity);
        console.log(`Successfully registered and enrolled "${userid}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register user "${userid}": ${error}`);
        process.exit(1);
    }
}

async function createNetwork(index){
	var orgname = org_name_list[index]
	var orgnameMSP =  org_msp_list[index]
	var userid = client_id_list[index]
	// load the network configuration
	const ccpPath = path.resolve(__dirname, '..', 'hyperledger', 'organizations', 'peerOrganizations', `${orgname}.covid-ins.com`, `connection-${orgname}.json`);
	let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

	// Create a new file system based wallet for managing identities.
	const walletPath = path.join(process.cwd(), 'wallet');
	const wallet = await Wallets.newFileSystemWallet(walletPath);
	console.log(`Wallet path: ${walletPath}`);

	// Check to see if we've already enrolled the user.
	const identity = await wallet.get(userid);
	if (!identity) {
		console.log(`An identity for the user "${userid}" does not exist in the wallet`);
		return;
	}

	// Create a new gateway for connecting to our peer node.
	const gateway = new Gateway();
	await gateway.connect(ccp, { wallet, identity: userid, discovery: { enabled: true } });

	// Get the network (channel) our contract is deployed to.
	return gateway;
}
/* ========================================== User Command ========================================== */

/* ========================================== Insurance Command ========================================== */
async function changeContractInsurance(key , newValue) {
    try {
		const gateway = await createNetwork(0);
		const network = await gateway.getNetwork('mychannel'); 
        const contract = network.getContract('covid-ins','Insurance');
        await contract.submitTransaction('changeContractInsurance', key , newValue);
        console.log('Transaction has been submitted');
        await gateway.disconnect();
		return "Transaction has been submitted";
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

async function createContractInsurance(key, name,detail,price) {
    try {
		const gateway = await createNetwork(0);
		const network = await gateway.getNetwork('mychannel'); 
        const contract = network.getContract('covid-ins','Insurance');
        await contract.submitTransaction('createContractInsurance', key, name,detail,price);
        console.log('Transaction has been submitted');
        await gateway.disconnect();
		return "Transaction has been submitted";

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}


async function queryAllContractInsurance() {
    try {
		const gateway = await createNetwork(0);
		const network = await gateway.getNetwork('mychannel'); 
		const contract = network.getContract('covid-ins','Insurance');
		const result = await contract.evaluateTransaction('queryAllContractInsurance');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
		return result.toString();
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

/* ========================================== Insurance Command ========================================== */



/* ========================================== Customer Command ========================================== */
async function updateCustomerInsurance(customerNumber , ObjectInsurance,index) {
    try {
		const gateway = await createNetwork(2);
		const network = await gateway.getNetwork('mychannel'); 
        const contract = network.getContract('covid-ins','Customer');
		await contract.submitTransaction('updateCustomerInsurance', customerNumber , JSON.stringify(ObjectInsurance),index);
        console.log('Transaction has been submitted');
		await gateway.disconnect();
		return "Transaction has been submitted";
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}
async function createCustomerInsurance(customerNumber , ObjectInsurance) {
    try {
		const gateway = await createNetwork(2);
		const network = await gateway.getNetwork('mychannel'); 
        const contract = network.getContract('covid-ins','Customer');
		await contract.submitTransaction('createCustomerInsurance', customerNumber , JSON.stringify(ObjectInsurance));
        console.log('Transaction has been submitted');
		await gateway.disconnect();
		return "Transaction has been submitted";
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

async function createCustomer(username, passwd,firstname,lastname,cardid) {
    try {
		const gateway = await createNetwork(0);
		const network = await gateway.getNetwork('mychannel'); 
		const contract = network.getContract('covid-ins','Customer');
		await contract.submitTransaction('createCustomer', username, passwd,firstname,lastname,cardid);
		console.log('Transaction has been submitted');
		await gateway.disconnect();
		return "Transaction has been submitted";
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}


async function queryCustomer(customerNumber) {
    try {
		const gateway = await createNetwork(2);
		const network = await gateway.getNetwork('mychannel'); 
        const contract = network.getContract('covid-ins','Customer');
        const result = await contract.evaluateTransaction('queryCustomer',customerNumber);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
		return result.toString();
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

/* ========================================== Customer Command ========================================== */


/* ========================================== Hospital Command ========================================== */


async function getHistoryInsurance(key) {
    try {
		const gateway = await createNetwork(1);
		const network = await gateway.getNetwork('mychannel'); 
        const contract = network.getContract('covid-ins','Hospital');
        var result = await contract.submitTransaction('getHistoryInsurance', key);
        console.log('Transaction has been submitted');
        await gateway.disconnect();
		return result.toString();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}
/* ========================================== Hospital Command ========================================== */



/* ========================================== Other Command ========================================== */
function call_ip(){
	var os = require('os');
	var ifaces = os.networkInterfaces();

	Object.keys(ifaces).forEach(function (ifname) {
	  var alias = 0;

	  ifaces[ifname].forEach(function (iface) {
		if ('IPv4' !== iface.family || iface.internal !== false) {
		  // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
		  return;
		}

		if (alias >= 1) {
		  // this single interface has multiple ipv4 addresses
		  console.log(ifname + ':' + alias, iface.address);
		} else {
		  // this interface has only one ipv4 adress
		  console.log(ifname, iface.address);
		}
		++alias;
	  });
	});
}
/* ========================================== Other Command ========================================== */



async function Setup() {
    console.log(`======================= Start enrollAdmin (${org_name_list[0]}) ===========================`);
	await enroll(admin_id_list[0],admin_user_list[0],0);
    console.log("======================= End enrollAdmin ===========================");
    console.log(`======================= Start enrollAdmin (${org_name_list[1]}) ===========================`);
	await enroll(admin_id_list[1],admin_user_list[1],1);
    console.log("======================= End enrollAdmin ===========================");
    console.log(`======================= Start enrollAdmin (${org_name_list[2]}) ===========================`);
	await enroll(admin_id_list[2],admin_user_list[2],2);
    console.log("======================= End enrollAdmin ===========================");
	
	console.log("======================= For Demo Register system coming soon ===========================");
    console.log("======================= Start registerUser ===========================");
	await register(client_id_list[0],client_user_list[0],0);
	await register(client_id_list[1],client_user_list[1],1);
	await register(client_id_list[2],client_user_list[2],2);
    console.log("======================= End registerUser ===========================");
	
	console.log("======================= For Demo Register system coming soon ===========================");
	app.get('/', (req, res) => {
	  res.send('Hello World, want some coffee?')
	})

	app.post('/api/changeContractInsurance', async (req, res) => {
	    console.log('Service Api : changeContractInsurance is used')
		console.log('Got body:', req.body);
        res.status(200).json({response: await changeContractInsurance(req.body.key , req.body.newValue)});
	});
	console.log('Service Api : /api/changeContractInsurance  is online')

	app.post('/api/createContractInsurance', async (req, res) => {
	    console.log('Service Api : createContractInsurance is used')
		console.log('Got body:', req.body);
        res.status(200).json({response: await createContractInsurance(req.body.key, req.body.name,req.body.detail,req.body.price)});
	});
	console.log('Service Api : /api/createContractInsurance  is online')
	
	app.get('/api/queryAllContractInsurance', async (req, res) => {
	    console.log('Service Api : queryAllContractInsurance is used')
        res.status(200).json({response: await queryAllContractInsurance()});
	});
	console.log('Service Api : /api/queryAllContractInsurance  is online')
	
	
	app.post('/api/updateCustomerInsurance', async (req, res) => {
	    console.log('Service Api : updateCustomerInsurance is used')
		console.log('Got body:', req.body);
        res.status(200).json({response: await updateCustomerInsurance(req.body.key , req.body.object, req.body.index)});
	});
	console.log('Service Api : /api/updateCustomerInsurance  is online')
	
	
	app.post('/api/createCustomerInsurance', async (req, res) => {
	    console.log('Service Api : createCustomerInsurance is used')
		console.log('Got body:', req.body);
        res.status(200).json({response: await createCustomerInsurance(req.body.key , req.body.object)});
	});
	console.log('Service Api : /api/createCustomerInsurance  is online')
	
	
	app.post('/api/createCustomer', async (req, res) => {
	    console.log('Service Api : createCustomer is used')
		console.log('Got body:', req.body);
        res.status(200).json({response: await createCustomer(req.body.username, req.body.passwd,req.body.firstname,req.body.lastname,req.body.cardid)});
	});
	console.log('Service Api : /api/createCustomer  is online')
	
	
	app.post('/api/queryCustomer', async (req, res) => {
	    console.log('Service Api : queryCustomer is used')
		console.log('Got body:', req.body);
        res.status(200).json({response: await queryCustomer(req.body.key)});
	});
	console.log('Service Api : /api/queryCustomer  is online')
	
	app.post('/api/getHistoryInsurance', async (req, res) => {
	    console.log('Service Api : getHistoryInsurance is used')
		console.log('Got body:', req.body);
        res.status(200).json({response: await getHistoryInsurance(req.body.key)});
	});
	console.log('Service Api : /api/getHistoryInsurance  is online')
	
	app.listen(3345, () => {
	  console.log('Start server at port 3344.')
	})
	call_ip()
}

Setup()
