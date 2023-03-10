// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
contract ShankToken {
    using SafeMath for uint256 ;
    string public name = "ShankToken";
    string public symbol = "STK";
    string public standard = "Shank Token v1.0";
    uint256 public totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowed;

    event Transfer(address _from, address _to, uint256 _value);
    event Approval(address _owner, address _spender, uint256 _value);

    constructor(uint256 _totalSupply) {
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
        _balances[msg.sender] = _balances[msg.sender].sub(_value);
        _balances[_to] = _balances[_to].add(_value);
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
    ) public view returns (uint256) {
        return _allowed[owner][spender];
    }

    //@dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
    function approve(address _spender, uint256 _value) public returns (bool) {
        _allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /*
        this is to allow contracts to transfer tokens on your (owners) behalf
        there are three accounts in this case : 
        the one we are calling from
        the one from where tokens are transferred
        the one to which tokens are transferred.
        This is a delegated transfer .
    */
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool) {
        require(
            balanceOf(_from) >= _amount,
            "account has insufficient balance"
        );
        require(
            allowance(msg.sender, _from) >= _amount,
            "cannot transfer value larger than approved amount"
        );
        _balances[_from] = _balances[_from].sub(_amount);
        _balances[_to] = _balances[_to].add(_amount);
        _allowed[msg.sender][_from]  = _allowed[msg.sender][_from].sub(_amount);
        emit Transfer(_from, _to, _amount);
        return true;
    }

    function increaseAllowance(
        address accountAdd,
        uint256 incrementValue
    ) public returns (bool) {
        _allowed[msg.sender][accountAdd] = _allowed[msg.sender][accountAdd].add(incrementValue);
        emit Approval(msg.sender, accountAdd, _allowed[msg.sender][accountAdd]);
        return true;
    }

    function decreaseAllowance(
        address account,
        uint256 decrementBy
    ) public returns (bool) {
        require(
            _allowed[msg.sender][account] >= decrementBy,
            "allowed amount must be greater than or equal to decrement"
        );
        _allowed[msg.sender][account] = _allowed[msg.sender][account].sub(decrementBy);
        emit Approval(msg.sender, account, _allowed[msg.sender][account]);
        return true ;
    }
}
