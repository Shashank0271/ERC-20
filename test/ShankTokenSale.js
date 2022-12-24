const {ethers} = require('hardhat') ;
const {expect} = require('chai') ;

describe('ShankTokenSale' , ()=>{
    let tokenSaleContract ;
    let owner , buyer ;
    let tokenPrice = 1000000000000000 ; //in wei (10^5) , 0.01 ether
    beforeEach(async()=>{
        [owner , buyer] = await ethers.getSigners() ;
        let tokenContract = await ethers.getContractFactory('ShankToken') ;
        token = await tokenContract.deploy(10000) ;

        TokenSale = await ethers.getContractFactory('ShankTokenSale') ;
        tokenSaleContract = await TokenSale.deploy(token.address , tokenPrice) ;
    });
    describe('Deployment' , async()=>{
       it('initializes the contract with correct value of owner' , async()=>{
            expect(await tokenSaleContract.admin()).to.not.be.undefined ;
            expect(await tokenSaleContract.admin()).to.be.equals(owner.address) ;
       });
       it('initializes the contract with correct value of tokenPrice', async()=>{
            expect(await tokenSaleContract.tokenPrice()).to.not.be.undefined ;
            expect(await tokenSaleContract.tokenPrice()).to.be.equals(tokenPrice) ;
       });
    });

    describe('Token buying' , async()=>{
        let numberOfTokens , value , signedBuyer ;
        beforeEach(async()=>{
            numberOfTokens = 3 ;
            value = numberOfTokens * tokenPrice ;
            signedBuyer = await ethers.getSigner(buyer.address);
        });
        it('facilitates token buying' , async()=>{
            //require that value is equal to the tokens
            //require that there are enough tokens in the contract
            
            //keep track of number of tokens sold 
            await expect(tokenSaleContract.connect(signedBuyer).buyTokens(numberOfTokens , {value : value})).to.not.be.reverted ;
            expect(await tokenSaleContract.tokensSold()).to.be.equals(numberOfTokens) ;
            
            //require that transfer is successfull
            
        });
        it('reverts when msg.value is not equal to token price' , async()=>{
            let transaction = tokenSaleContract.connect(signedBuyer).buyTokens(numberOfTokens, {value:1});
            await expect(transaction).to.be.reverted;
        });
        it('emits a sell event on buying tokens' , async()=>{
            let transaction = tokenSaleContract.connect(signedBuyer).buyTokens(numberOfTokens, {value:value});
            expect(transaction).to.emit(tokenSaleContract , 'Sell').withArgs(buyer.address , numberOfTokens) ;
        });
    });
})