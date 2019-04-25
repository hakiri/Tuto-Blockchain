//@Author: Darth Revan darthrevan344@gmail.com

import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Maintenance contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Maintenance abstraction. We will use this abstraction
 * later to create an instance of the Maintenance contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import maintenance_artifacts from '../../build/contracts/Maintenance.json'

var Maintenance = contract(maintenance_artifacts);


var accounts;
var account;
var myContractInstance;

var randomMachineID = Math.floor((Math.random() * 1000000) + 1);

var recentlyRegisteredMachineID;

var recentServiceRequests = [];


/* Register new machine and Request for new service*/

/**
Function to register new machine details dynamically.
*/
window.registerNewMachine = function(machine) {
	//var machineID = 987655;
	//var machineID = randomMachineID;
	//var machineName = "CNC";
	//var purchaseDate = "1472721009";
	//var manufacturer = "XYZ Corp";

	let machineID = $("#r_machineID").val();
	let machineName = $("#r_machineName").val();
	let purchaseDate = $("#r_purchaseDate").val();
	let manufacturer = $("#r_manufacturer").val();

	try {
    	$("#msg").html("Machine registration has been submitted. The machine count will increment as soon as the machine is registered on the blockchain. Please wait.")
    	$("#r_machineID").val("");
		$("#r_machineName").val("");
		$("#r_purchaseDate").val($.now());
		$("#r_manufacturer").val("");


    	 Maintenance.deployed().then(function(contractInstance) {
      		contractInstance.registerMachine(machineID, machineName, purchaseDate, manufacturer, {gas: 140000, from: web3.eth.accounts[0] }).then(
			function(result) {
			    console.log('register machine deatils->'+result);
				contractInstance.getMachineDetails.call(machineID).then(function(m){
				 console.log('resultNew-M->'+m);
				  if(m[1].toString()){
					console.log('Machine Registered!');
					$("#msg").html("Machine Registered Successfully!");
					recentlyRegisteredMachineID = machineID;
					$("#s_machineID").val(machineID);
					//update the latest number of machines after registration
					contractInstance.numMachines.call().then(function(v){
						$('#cf_machines').html(v.toString());
					});

				  }else{
					console.log('Machine Registration Failed');
					$("#msg").html("Machine Registration Failed! Try again......");
				  }
				});
			});
	 });
  	}catch (err) {
    	console.log(err);
  	}
}

/**
Function to request new service dynamically.
*/
window.requestMachineService = function(machine) {
	let machineID = $("#s_machineID").val();
	let timestamp = $("#s_timeStamp").val();
	let remarks = $("#s_remarks").val();

	try {
    	$("#msg-service").html("Machine service request has been submitted. The service request count will increment as soon as the service is registered on the blockchain. Please wait.")
    	$("#s_machineID").val("");
		$("#s_remarks").val("");
		//$("#r_purchaseDate").val($.now());
		Maintenance.deployed().then(function(contractInstance) {
			contractInstance.requestService(timestamp, machineID, remarks, {gas: 140000, from: web3.eth.accounts[0] }).then(
				function(resultService) {
			  		console.log('requested service result->'+resultService);
			  		if( resultService!=null ){
						console.log('Service Request successful!!!\n');
						$("#msg-service").html('Service Request successful!!');
						//Update the number of service requests
						contractInstance.numServiceRequests.call().then(function(s){
							$('#cf_servicerequests').html(s.toString());
							getServiceRequests(contractInstance);
						});
			  		}	else{
						console.log('Service Request Failed');
			  		}
			}
		  );
	 });


	}catch (err) {
    	console.log('Error in machine service request->'+err);
  	}
}

/*
Function to get the machine details while clicking on machineID
*/
window.getMachineDetailsById = function(obj){
	var machineID = obj.id;
    		console.log('New Onclick machineID->'+machineID);
    	Maintenance.deployed().then(function(contractInstance) {
    		contractInstance.getMachineDetails.call(machineID).then(function(m){
				  console.log('resultNew-M->'+m);
				  if(m[1].toString()){
					$('#cf_machineID').html(machineID);
					$('#cf_machineName').html(m[0]);
					$('#cf_purchaseDate').html(m[1].toNumber());
					$('#cf_owner').html(m[2]);
					$('#cf_manufacturer').html(m[3]);
				  }else{
					console.log('Failed in getMachieDetails');
				  }
			});
	   });

}

/* End of register machine and request for the service*/


function initializeContract(){
	myContractInstance = Maintenance.deployed();

	//registerMachine();
	//myContractInstance.methods.getMachineDetails.call().then('Testing->'+console.log);

	console.log('myContractInstance->'+myContractInstance);

	console.log('myContractInstance.address->'+myContractInstance.creator);
	console.log('myContractInstance.address@@@@@@@@@@@->'+myContractInstance);
	$('#cf_address').html(myContractInstance.address);
	//$('#cf_address').html(myContractInstance.address);
	//console.log('myContractInstance.address->'+myContractInstance.address);
	$('#cf_address').html(account);
	console.log('account.address->'+account);
//	$('#cf_machines').html(myContractInstance.numMachines);
//	console.log('cf_machines->'+myContractInstance.numMachines);

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

function registerMachine(contractInstance){
	//var machineID = 987655;
	var machineID = randomMachineID;
	var machineName = "CNC";
	var purchaseDate = "1472721009";
	var manufacturer = "XYZ Corp";


	contractInstance.registerMachine(machineID, machineName, purchaseDate, manufacturer, {gas: 140000, from : web3.eth.coinbase }).then(
			function(result) {
			  console.log('register machine deatils->'+result);
				//return contractInstance.getMachineDetails.call();
				contractInstance.getMachineDetails.call(machineID).then(function(m){
				  console.log('resultNew-M->'+m);
				  if(m[1].toString()){
					console.log('Machine Registered!');
					//$('#cf_machineID').html(machineID);
					//$('#cf_machineName').html(m[0]);
					//$('#cf_purchaseDate').html(m[1].toNumber());
					//$('#cf_owner').html(m[2]);
					//$('#cf_manufacturer').html(m[3]);
				  }else{
					console.log('Registration Failed');
				  }
				});
			}
	);
}

function getMachineDetails(contractInstance,machineID){
	return contractInstance.getMachineDetails().call(machineID).then(
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

/* Testing without passig contractInstance as an arguement */
function getRegisteredMachineDetails(machineID){
	return Maintenance.deployed().getMachineDetails().call(machineID).then(
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


function requestService(contractInstance){
	//var machineID = 987655;
	//var machineID = randomMachineID;
	//var timestamp = "1472721012";
	var machineID = recentlyRegisteredMachineID;
	var timestamp = $.now();
	var remarks = "Valve issue";


	contractInstance.requestService(timestamp, machineID, remarks, {gas: 140000, from : web3.eth.coinbase }).then(
			function(resultService) {
			  console.log('requested service result->'+resultService);
			  if( resultService!=null ){
					console.log('Service Request successful!!!\n');
			  }	else{
					console.log('Registration Failed');
			  }
				//return contractInstance.getMachineDetails.call();
			/*	contractInstance.getServiceRequest().call(machineID).then(function(s){
				  console.log('resultNew-Service->'+s);
				  if( s!=null ){
					console.log('Service Request successful!!!\n');
					console.log('Requested service details->Timestamp:'+s.args.timestamp.toNumber()+'\t'+'Machine ID->'+s.args.machineID.toNumber());
					/*$('#cf_machineID').html(machineID);
					$('#cf_machineName').html(m[0]);
					$('#cf_purchaseDate').html(m[1].toNumber());
					$('#cf_owner').html(m[2]);
					$('#cf_manufacturer').html(m[3]); */
				/*  }else{
					console.log('Registration Failed');
				  }
				});*/
			}
	);
}

function getServiceRequests(contractInstance){
	var serviceRequested = contractInstance.ServiceRequested({ from : 0, toBlock: 'latest'});
	serviceRequested.watch(function(error, resultRequested){
		if(error){
			console.log('serviceRequested.watch-error->'+error);
		}

	    //once the event has been detected, take actions as desired
		console.log('serviceRequested.watch-result->'+resultRequested);
		if(resultRequested){
          //Store the service request object into json array
		  recentServiceRequests.push(resultRequested);
		  console.log('json service length->'+recentServiceRequests.length+'\tjson array->'+recentServiceRequests);
		  var htmlString = '<table class="table"><tr></tr><th>Timestamp</th><th>Machine-ID</th><th>Remarks</th></tr>';
		  for(var i=0; i<recentServiceRequests.length; i++){
		    htmlString = htmlString + '<tr><td>'+ recentServiceRequests[i].args.timestamp.toNumber()+'</td><td><a href="#" id='+recentServiceRequests[i].args.machineID.toNumber()+' data-machine-id='+recentServiceRequests[i].args.machineID.toNumber()+' onclick="getMachineDetailsById(this)">' + recentServiceRequests[i].args.machineID.toNumber() + '</a></td><td>'+ recentServiceRequests[i].args.remarks + '</td></tr>';
		  }
		  //htmlString = htmlString + '<tr><td>'+ resultRequested.args.timestamp.toNumber()+'</td><td><a href="#" id="serviceMachineId" data-machine-id='+resultRequested.args.machineID.toNumber()+'>' + resultRequested.args.machineID.toNumber() + '</a></td><td>'+ resultRequested.args.remarks + '</td></tr>';
		  htmlString = htmlString + '</table>';
		  $('#serviceTable').html(htmlString);
		  serviceRequested.stopWatching();
		}

	});
}


$( document ).ready(function(){
$("#r_purchaseDate").val($.now());
$("#s_timeStamp").val($.now());

	if (typeof web3 !== 'undefined') {
	    console.warn("Using web3 detected from external source like AWS")
	    // Use Mist/MetaMask's provider
	   // window.web3 = new Web3(web3.currentProvider);
	   window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	 //  window.web3 = new Web3(new Web3.providers.HttpProvider("http://10.1.10.85:8545"));
	   console.log("Connectiong to localhost - if->"+window.web3);
	  	//window.web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-34-210-156-191.us-west-2.compute.amazonaws.com:8000"));
	  } else {
		 // console.warn("Using web3 detected from external source like AWS")
	   // console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
	    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
	   // window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	// window.web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-34-210-156-191.us-west-2.compute.amazonaws.com:8000"));
	  // console.log("Connectiong to remote->"+window.web3);
	  	window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	  //	window.web3 = new Web3(new Web3.providers.HttpProvider("http://10.1.10.85:8545"));
	    console.log("Connected to localhost - else->"+window.web3);
	  }
	//Maintenance.setProvider(web3.currentProvider);
	Maintenance.setProvider(window.web3.currentProvider);

	web3.eth.getAccounts(function(err, accs){
		if(err !=null){
			alert('There was an error fetching your accounts.');
			return;
		}
		if(accs.length == 0){
			alert("Coundn't get any accounts!");
			return;
		}

		console.log('No of accounts->'+accs.length);
		accounts = accs;
		account = accounts[1];
		//initializeContract();

		Maintenance.deployed().then(function(contractInstance) {
		$('#cf_address').html(contractInstance.address);
		contractInstance.numMachines.call().then(function(v){
			$('#cf_machines').html(v.toString());
			//registerMachine(contractInstance);
			//requestService(contractInstance);
			contractInstance.numServiceRequests.call().then(function(s){
				$('#cf_servicerequests').html(s.toString());
				//getServiceRequests(contractInstance);
			});
			//getServiceRequests(contractInstance);
		 });
		 getServiceRequests(contractInstance);
		});
	});



});
