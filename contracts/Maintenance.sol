//pragma solidity ^0.4.8;
pragma solidity >=0.4.22 <0.6.0;

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

	constructor () public{
		creator = msg.sender;
		numMachines = 0;
		numServiceRequests = 0;
	}

	function registerMachine(uint machineID, string memory machineName, uint purchaseDate, string memory manufacturer) public {
		Machine storage m = machines[machineID];
		m.machineName = machineName;
		m.purchaseDate = purchaseDate;
		m.owner = msg.sender;
		m.manufacturer = manufacturer;
		numMachines++;
	}

	function getMachineDetails(uint machineID) public view
		returns(string memory machineName, uint purchaseDate, address owner, string memory manufacturer){
			machineName = machines[machineID].machineName;
			purchaseDate = machines[machineID].purchaseDate;
			owner = machines[machineID].owner;
			manufacturer = machines[machineID].manufacturer;
	}

	function getServiceRequest(uint machineID) public view
		returns(uint timestamp, string memory remarks, address requester){
		//ServiceRequest storage s = serviceRequests[machineID];

		timestamp = serviceRequests[machineID].timestamp;
		remarks = serviceRequests[machineID].remarks;
		requester = serviceRequests[machineID].requester;
	}

	function requestService(uint timestamp, uint machineID, string memory remarks) public{
		ServiceRequest storage s = serviceRequests[machineID];
		s.timestamp = timestamp;
		s.requester = msg.sender;
		s.remarks = remarks;
		numServiceRequests++;
		emit ServiceRequested(msg.sender, timestamp, machineID, remarks);
	}
	
	/// destroy the contract and reclaim the leftover funds.
    function destroy() public {
        require(msg.sender == creator);
        selfdestruct(msg.sender);
    }


}
