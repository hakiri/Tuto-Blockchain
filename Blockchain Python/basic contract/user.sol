pragma solidity >=0.4.22 <0.6.0;

// import library file
import "./stringUtils.sol";

contract userRecords {
    
  // enum type variable to store user gender
  enum genderType { male, female }
  // Actual user object which we will store
  
  struct user{
    string name;
    genderType gender;
  }
  // user object
  user user_obj;
  //Internal function to conver genderType enum from string
  function getGenderFromString(string memory gender) internal pure returns   (genderType) {
    if(StringUtils.equal(gender, "male")) {
      return genderType.male;
    } else {
      return genderType.female;
    }
  }
  //Internal function to convert genderType enum to string
  function getGenderToString(genderType  gender) internal pure returns (string memory) {
    if(gender == genderType.male) {
      return "male";
    } else {
      return "female";
    }
  }
  // set user public function
  // This is similar to persisting object in db.
  function setUser(string  memory name, string memory gender) public {
    genderType gender_type = getGenderFromString(gender);
    user_obj = user({name:name, gender: gender_type});
  }
  
  // get user public function
  // This is similar to getting object from db.
  function getUser() public view returns (string memory, string memory) {
    return (user_obj.name, getGenderToString(user_obj.gender));
  }
}
