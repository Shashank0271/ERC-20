// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "hardhat/console.sol";
import "./ShankToken.sol";

contract ShankTokenSale {
    address public admin;
    ShankToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    event Sell(address _buyer, uint256 _amountSold);

    constructor(ShankToken _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        // require(msg.value == _numberOfTokens*tokenPrice) ;
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens); //the person calling this function is the buyer
    }
}
