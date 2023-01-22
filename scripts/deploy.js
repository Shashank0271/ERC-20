const hre = require("hardhat");
async function main() {

  //get deployers address 
  const [deployer] = await hre.ethers.getSigners() ;
  console.log("Deploying contracts with the account : " , deployer.address) ;
  
  //Deploy the first contract
  const Token = await hre.ethers.getContractFactory('ShankToken') ;
  const token = await Token.deploy(1000) ;
  await token.deployed() ;
  
  //Deploy the second contract
  const TokenSale = await hre.ethers.getContractFactory('ShankTokenSale') ;
  const tokenSale = await TokenSale.deploy(token.address , 10) ;
  await tokenSale.deployed() ;
  
  console.log("Token address :" , token.address) ;//0xc58686E5F1dDA72664fB8332CdD5d913D4914ADe
  console.log("Token Sale address :" , tokenSale.address) ;//0x4758B78D977Ae969173A0C3344b210f81E45a09d
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(()=>process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
Deploying contracts with the account :  0x350C4f5766314319CfcFEdf423fcaB896B527C38

Token address : 0xc58686E5F1dDA72664fB8332CdD5d913D4914ADe
Token Sale address : 0x4758B78D977Ae969173A0C3344b210f81E45a09d
*/