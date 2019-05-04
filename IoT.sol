//pragma solidity ^0.4.24;

pragma solidity >=0.4.22 <0.6.0;

library Utils {

    function concatinate(string memory in1, string memory in2) public returns (string memory)
    {
        string memory buffer = in1 + in2;
        return buffer;
    }


}

contract SecureM2MChain {

    // General comment : 
    // hashing the body of the resource (IP, MAC, etc.) is needed when sending data in the contract 
    // Clients should generate hashes of the web resources themselves and should reject reports that 
    // do not have matching hashes.



    // Utils is library declared after the contract that will be used in the contract 
    // library can be also declared out side the contract
   // using Utils for Utils.concatinate;

    

    address public owner;
    IPAddress ipBoundary;
    Lifeliness currentState;
    Lifeliness constant defaultState = Lifeliness.sensing;

    
    // FiX ME 
    mapping (address => Misbehavior[]) public MisbehaviorList;

    enum Lifeliness {awake, sleeping, poweredOff, sensing}
    event CommunicationFailure();
    event TriggerAlarm(string src_IP, string src_MAC, string data);
    event DiscoverElement(string IP, string MAC);
    event Sent(address from, address to, uint amount);  // event to allow client to react on changes efficiently 

    // An entry that can be added to the smart contract is a composite of 3 values: The 'victim 
    // IP' or destination IP, the 'attacker IP' or source IP and an expiration date. 
    // Expired reports can be filtered by comparing to the block.timestamp global variable.



    // the notation of '127.0.0.0/24'
    struct IPAddress {
        string ip;
        string mask;
    }

    struct Report {
        uint expirationdate;
        IPAddress sourceIp;
        IPAddress destinationIp;
    }

    struct SuspectBehavior {
        address subject; //subject who performed the misbehavior;
        address object; //
        string res; //
        string action; //action (e.g., "read", "write", "execute") of the misbehavior
        string _misbehavior; //misbehavior
        uint time; //time of the Misbehavior occured
        uint penalty; //penalty (number of minitues blocked);
        string suspectIP;
        string suspectMAC;
    }


    // A device can rely requests for sensing data and transmit them autonomously
    // A device can communicate with other devices directly or through a M2M gateway 
    // Devices can use WPAN networks to connect to gateways or Service Providers or 
    // Devices could use embedded protocols such as COAP, MQTT, etc. 
    // Devices connected via gateways are normally outside the operator’s responsibility but
    // belong to M2M applications that are provided by service or application providers.
    struct M2M_Device {
    	string         uri;
		string        latitude;
		string        longitude; 
		string        data;   	
        uint          expirationDate;
        bytes32       _hash;
        Lifeliness    defaultState;
    }


    // 
    struct M2M_Service {
    	string        M2M_Service_IP;
    	string        M2M_Service_Name;
    	string        M2M_Service_URL;
    	string        M2M_Service_Protocol;
    	string        M2M_Service_Port;
        string        deliveryMode; // anycast, unicast, multicast
        uint          expirationDate;
        bytes32       _hash;
    }

     // Gateways can encapsulate and manage all devices addressing and identifying, e.g., 
     // routing, of the devices relies heavily on the gateways.
     // M2M Gateway are the endpoints of the operator’s network which M2M capabilities to 
     // ensure M2M Devices inter-working and interconnection to the communication network.
     // 
    struct M2M_Gateway {
    	string         M2M_Gateway_IP;
    	string         M2M_Gateway_MAC;
        string         mask;
    	string[]       M2M_Gateway_Apps;
        string         deliveryMode; // anycast, unicast, multicast
        bytes32        _hash;
    } 
 
     // Provide connectivity between M2M Devices and M2M Gateways, e.g. personal area network.
     // Contains applications,  services, or service enablers, may be offered by ISP or by the platform itself.

    struct M2MDomain {
    	string         M2MDomain_IP; // e.g. Remote Server 
    	string         M2MDomain_Apps; //  User specific application, e.g. smart grids, smart health, smart transportation

    }

    // Default constructor whose code is run only when the contract is created.
    constructor () public {
        owner = msg.sender; // We keep the address of the creator
    }

    // Second constructor to restrict the destination IP addresses that can be added to only a certain range
    constructor (string memory ip, string memory mask) public needsMask(mask) {
        owner = msg.sender;
        ipBoundary = IPAddress({ip: ip, mask: mask});
    }
    
    
    function concate(string memory s1, string memory s2) public view returns (string memory s3) 
    {
        return Utils.concatinate(s1,s2);
    }
    
    
    // In case the constructor dont work !!
    // Restrict the destination IP addresses that can be added to only a certain range
    // 'modifier' called needsMask to ensure that only specific IP addresses can be used
    function ArrayStore(string memory ip, string memory mask) public view needsMask(mask) {
        // The address of the creator of the contract instance gets stored in the owner property.
        // This makes it possible to write access control logic in other parts of the contract.

        owner = msg.sender; // address of the creator of the contract
        ipBoundary = IPAddress({ip: ip,mask: mask});
    }

    function createCustomer(address customer, string memory ip, string memory mask) public ownerOnly (mask)
    {
        customers[customer] = IPAddress(ip, mask);
    }

    function isInSameSubnet(string memory ip, string memory mask) public view returns (bool success)
    {
        if(mask < ipBoundary.mask)
            return false;
    }

    modifier needsMask(uint8 mask) 
    {
        assert(mask == 0);   
        _;
    }

    modifier ownerOnly() 
    {
        require(msg.sender == owner);
        _;
    }

    modifier isAllowed(address ) 
    {
    	assert(msg.sender == owner); // contract state
  		_;
    }

    modifier isValidAddress(address target) 
    {
  		require(target != 0x0);
  		_;
	}


    function removeM2MDevice(string memory MAC) public ownerOnly returns (bool success)
    {   //Use encryption herein for security enforcement 

        delete M2M_Device[key] ;
    }
	function deleteM2M_Gateway() public ownerOnly returns (bool success) 
    {   //use encryption for security enforcement
        delete M2M_Gateway[key];

	}

	function deleteAll_M2M_Gateway() public ownerOnly returns (bool success) 
    {   
        for (;;){
            delete M2M_Gateway [key];
        }
	}
	function addM2M_Gateway() public returns (bool success) 
    {

	}

	function addMultipleGateways() public returns(bool success)
    {

	}

    function remove_M2M_Service() public returns (bool success)
    {


    }

	function registerM2MGateway(string memory IP, string memory MAC, string memory app) public returns (bool success)
    {
		
	}

    function registernewService(string memory) public returns (bool success)
    {
        
    }

    function discoverElement(string memory IP, string memory MAC) public view returns (bool success)
    {

    }
    function getGatewayDetails(string memory ) public view returns (string memory)
    {

    } 

    function getAllGatewayDetails(string memory) public view returns (string memory)
    {

    }

    function getDeviceDetails(string memory MAC) public view returns (string memory) 
    {

    }

    function getAllDevicesDetails (string memory) public view returns (string memory)
    {

    }

    function getAllServiceDetails (string memory ) public view returns (string memory)
    {

    }

    function getServiceDetails(string memory ) public view returns (string memory)
    {

    }

    function validatePenality(string memory IP, string memory MAC, uint BlockingTime) public returns(bool success)
    {

    }

    function getLatestMisbehavior () public returns (address subject, address object, string memory IP, string memory MAC) {

    }

    function Monitor (string memory IP, string memory MAC, string memory AppName, string memory url, string memory port) public returns(bool success)
    {

    }

    function self_destruct() public  
    {
        require(msg.sender == owner);
        selfdestruct(this); //Destruct the contract
        // another approach is : 
        // selfdestruct(owner); 
    }


}


