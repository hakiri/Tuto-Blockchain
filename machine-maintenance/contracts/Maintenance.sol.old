//@Author: Darth Revan darthrevan344@gmail.com

pragma solidity ^0.4.8;
// We have to specify what version of compiler this code will compile with

contract Maintenance{
	struct Machine{
		string machineName;
		uint purchaseDate;
		address owner;
		string manufacturer;
	}

	struct ServiceRequest{
		uint timestamp;
		string remarks;
		address requester;
	}

	address public creator;
	uint public numMachines;
	uint public numServiceRequests;
	mapping (uint => ServiceRequest) serviceRequests;
	//mapping (uint => ServiceRequest) public serviceRequests;
	mapping (uint => Machine) machines;
	//mapping (uint => Machine) public machines;
	bool public result;

	event ServiceRequested(address requester, uint timestamp, uint machineID, string remarks);

	function Maintenance(){
		creator = msg.sender;
		numMachines = 0;
		numServiceRequests = 0;
	}

	function registerMachine(uint machineID, string machineName, uint purchaseDate, string manufacturer) public {
		Machine m = machines[machineID];
		m.machineName = machineName;
		m.purchaseDate = purchaseDate;
		m.owner = msg.sender;
		m.manufacturer = manufacturer;
		numMachines++;
	}

	function getMachineDetails(uint machineID)
		returns(string machineName, uint purchaseDate, address owner, string manufacturer){
			machineName = machines[machineID].machineName;
			purchaseDate = machines[machineID].purchaseDate;
			owner = machines[machineID].owner;
			manufacturer = machines[machineID].manufacturer;
	}

	function getServiceRequest(uint machineID)
		returns(uint timestamp, string remarks, address requester){
		ServiceRequest s = serviceRequests[machineID];

		timestamp = serviceRequests[machineID].timestamp;
		remarks = serviceRequests[machineID].remarks;
		requester = serviceRequests[machineID].requester;
	}

	function requestService(uint timestamp, uint machineID, string remarks) public{
		ServiceRequest s = serviceRequests[machineID];
		s.timestamp = timestamp;
		s.requester = msg.sender;
		s.remarks = remarks;
		numServiceRequests++;
		ServiceRequested(msg.sender, timestamp, machineID, remarks);
	}

	function destroy(){
		if(msg.sender == creator ){
			suicide(creator);
		}
	}

}
