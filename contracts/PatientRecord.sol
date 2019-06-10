pragma solidity >=0.4.22 <0.7.0;
 
/** @title PatientRecord */
contract PatientRecord {
    
    // ** Part 1 ** Enums **
    enum Gender { Male, Female }    
    
    // ** Part 2 ** Structs **
    struct Patient {
         string  name; 
         uint age;
        Gender gender;
    }
         
    // ** Part 3 ** State Variables **
    uint id; //Id for the patient record
    Patient private patient; // The patient we are referring to
    address public recordOwner; //The address of the owner
    
    // ** Part 4 ** Events **
    // These can be triggered for a JS script in front end
    event PatientNameAccessed(address sender);
    
    // ** Part 5 ** Modifiers **
    // Like a protocol that a function should follow
    
    modifier onlyOwner() {
        require(msg.sender == recordOwner);
        _;
    }
    
    // ** Part 6 ** Functions **
    constructor () public {
        recordOwner = msg.sender;
    }
    
    function getPatientName() public returns (string memory _name) {
        emit PatientNameAccessed(msg.sender);// Triggering the event
        return patient.name;
    }
      
    // Note that the function has the onlyOwner Modifier
    function setPatientName(string memory name) public onlyOwner {
        patient.name = name;
    }
        
}
