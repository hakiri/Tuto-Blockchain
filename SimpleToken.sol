pragma solidity ^0.4.24;

contract SimpleToken {

    mapping(address => uint) private _balances;

    constructor() public {
        _balances[msg.sender] = 1000000;
    }

    function getBalance(address account) public constant returns (uint) {
        return _balances[account];
    }

    function transfer(address to, uint amount) public {
        require(_balances[msg.sender] >= amount);

        _balances[msg.sender] -= amount;
        _balances[to] += amount;
    }
}