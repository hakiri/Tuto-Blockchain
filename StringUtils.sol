pragma solidity >=0.4.22 <0.7.0;

library StringUtils {
    	
    	function strConcat(string memory a, string memory b, string memory c) internal pure returns (string memory ) {
				return strConcat1(a, b, c); 
		} 


		function strConcat1(string memory a, string memory b, string memory  c) internal pure returns (string memory) { 
				bytes memory ba = bytes(a); 
				bytes memory bb = bytes(b); 
				bytes memory bc = bytes(c); 
				string memory result1 = new string(ba.length + bb.length + bc.length); 
				bytes memory result = bytes(result1); 
				uint k = 0; 
	
					for (uint i = 0; i < ba.length; i++) 
						result[k++] = ba[i]; 
		
					for (uint i = 0; i < bb.length; i++) 
						result[k++] = bb[i]; 
		
					for (uint i = 0; i < bc.length; i++) 
						result[k++] = bc[i]; 
		
				return string(result); 
		} 
}
