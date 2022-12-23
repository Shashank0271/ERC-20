// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "hardhat/console.sol";
contract ShankToken {
    string public name = "ShankToken" ;
    string public symbol = "STK" ;
    string public standard = "Shank Token v1.0" ;
    uint public totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint))  private _allowed;

    event Transfer(address _from, address _to, uint256 _value);
    event Approval(address _owner, address _spender, uint256 _value);
    
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
    
  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param owner address The address which owns the funds.
   * @param spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(
    address owner,
    address spender
   )
    public
    view
    returns (uint256)
  {
    return _allowed[owner][spender];
  }

    function approve(address _spender, uint256 _value) public returns (bool){
        require(balanceOf(_spender) >= _value , 'account has insufficient tokens');
        _allowed[msg.sender][_spender] = _value ;
        emit Approval(msg.sender , _spender , _value) ;
        return true ;
    }

}
