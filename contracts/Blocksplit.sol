pragma solidity >=0.4.22 <0.6.0;
 
contract Blocksplit {
 
     address[] public players;
     mapping (address => bool) public uniquePlayers;
     address[] public winners;
 
     address public charity = 0xc39eA9DB33F510407D2C77b06157c3Ae57247c2A;
 
     function() external payable {
         play(msg.sender);
     }
 
     function play(address _participant) payable public {
         require (msg.value >= 1000000000000000 && msg.value <= 100000000000000000);
         require (uniquePlayers[_participant] == false);
 
         players.push(_participant);
         uniquePlayers[_participant] = true;
     }
 
 }
