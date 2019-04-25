//@Author: Darth Revan darthrevan344@gmail.com

import "../stylesheets/app.css";
// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import maintenance_artifacts from '../../build/contracts/Maintenance.json'

var Maintenance = contract(maintenance_artifacts);

var accounts;
var account;
var myContractInstance;

function initializeContract(){
	myContractInstance = Maintenance.deployed();

	$('#cf_address').html(myContractInstance.address);
	$('#cb_address').html(account);

	myContractInstance.numMachines.call().then(
			function(numMachines){
				$('#cf_machines').html(numMachines.toNumber());
				return myContractInstance.numServiceRequests.call();

	}).then(
			function(numServiceRequests){
				$('#cf_servicerequests').html(numServiceRequests.toNumber());
				getServiceRequests();
	});
}

function setStatus(message){
	$('#status').html(message);
}

function showTotal(){
	var numTickets = $('#numTickets').val();
	var ticketAmount = numTickets * ticketPrice;
	$('#ticketsTotal').html(ticketAmount);
}

function refreshBalance(){
	$('#cb_balance').html(web3.fromWei(web3.eth.getBalance(web3.eth.coinbase), "ether").toFixed(5));
}

function registerMachine(){
	var machineID = 987655;
	var machineName = "CNC";
	var purchaseDate = "1472721009";
	var manufacturer = "XYZ Corp";

	myContractInstance.registerMachine(machineID, machineName, purchaseDate, manufacturer, { from : web3.eth.coinbase }).then(
			function(result) {
				return myContractInstance.getMachineDetails().call(machineID);
			}
	).then(
			function(result){
				console.log('result->'+result);
				if(result[1].toNumber() > 0){
					console.log('Machine Registered!');
				}else{
					console.log('Registration Failed');
				}
			}
	);
}

function getMachineDetails(machineID){
	return myContractInstance.getMachineDetails().call(machineID).then(
			function(result){
				console.log('result--->'+result);
				$('#cf_machineID').html(machineID);
				$('#cf_machineName').html(result[0]);
				$('#cf_purchaseDate').html(result[1].toNumber());
				$('#cf_owner').html(result[2]);
				$('#cf_manufacturer').html(result[3]);
			}

	);
}

function requestService(){
	var machineID = 987655;
	var timestamp = "1472721012";
	var remarks = "Valve issue";

	myContractIstance.requestService(machineID, timestamp, remarks, { from : web3.eth.coinbase}).then(
			function(result) {
				return myContractInstance.getServiceRequest().call(machineID);
			}
	).then(

			function(result) {
				console.log('result->'+result);
				if(result[1].toNumber() > 0){
					console.log('Service request successful!');
				}else{
					console.log('Service request failed!');
				}
			}
	);
}

function getServiceRequests(){
	var serviceRequested = myContractInstance.ServiceRequested({ from : 0, toBlock: 'latest'});
	serviceRequested.watch(function(error, result){});

	var events = myContractInstance.allEvents({ from : 0, toBlock: 'latest', event : 'ServiceRequested'});
	/*$(events).get(function(error, result){
		var htmlString = '<table class="table"><tr></tr><th>Timestamp</th><th>Machine-ID</th><th>Remarks</th></tr>';
		for(var i=0; i<result.length; i++){
			htmlString + = '<tr>'+ '<td>'+ result[i].args.timestamp.toNumber()+'</td>' + '<td><a href="#" onclick=getMachineDetails('+result[i].args.machineID.toNumber()+');>' + result[i].args.machineID.toNumber() + '</a></td>' + '<td>'+ result[i].args.remarks + '</td></tr>';
		}

		htmlString + = '</table>'
		$('serviceTable').html(htmlString);
	});*/
}

$( document ).ready(function(){

	if (typeof web3 !== 'undefined') {
	    console.warn("Using web3 detected from external source like AWS")
	    // Use Mist/MetaMask's provider
	   // window.web3 = new Web3(web3.currentProvider);
	  	window.web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-34-210-156-191.us-west-2.compute.amazonaws.com:8000"));
	  } else {
		 // console.warn("Using web3 detected from external source like AWS")
	   // console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
	    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
	   // window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	   window.web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-34-210-156-191.us-west-2.compute.amazonaws.com:8000"));
	   console.log("Connectiong to remote->"+window.web3);
	  }
	Maintenance.setProvider(web3.currentProvider);

	web3.eth.getAccounts(function(err, accs){
		if(err !=null){
			alert('There was an error fetching your accounts.');
			return;
		}
		if(accs.length == 0){
			alert("Coundn't get any accounts!");
			return;
		}

		accounts = accs;
		account = accounts[0];
		initializeContract();
	});
});
