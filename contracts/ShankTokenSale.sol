// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "hardhat/console.sol";
import "./ShankToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ShankTokenSale {
    using SafeMath for uint256;
    address public admin;
    ShankToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    event Sell(address _buyer, uint256 _amountSold);
    event End();

    constructor(ShankToken _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    modifier OnlyAdmin() {
        require(msg.sender == admin, "only the admin can end the sale");
        _;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(
            tokenContract.balanceOf(address(this)) >= _numberOfTokens,
            "contract has insufficient funds"
        );
        require(msg.value == _numberOfTokens.mul(tokenPrice));
        //the contract must have enough token to give to the buyer
        require(
            tokenContract.transfer(msg.sender, _numberOfTokens),
            "transfer failed"
        );
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens); //the person calling this function is the buyer
    }

    function endTokenSale() public OnlyAdmin {
        //transfer any rem  aining tokens to the admin :
        tokenContract.transfer(admin, tokenContract.balanceOf(address(this)));
        selfdestruct(payable(admin));
        emit End();
    }
}
