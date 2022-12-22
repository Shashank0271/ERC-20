// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract ShankToken {
    uint public totalSupply;
    mapping(address => uint256) private _balances;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor(uint _totalSupply) {
        _balances[msg.sender] = _totalSupply;
        totalSupply = _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint) {
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        //exception if the msg.sender doesnt have enough
        require(
            balanceOf(msg.sender) >= _value,
            "sender has insufficient tokens"
        );
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
