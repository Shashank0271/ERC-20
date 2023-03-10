const {ethers} = require('hardhat') ;
const {expect} = require('chai') ;

describe('ShankTokenSale' , ()=>{
    let tokenSaleContract , tokenContract ;
    let admin , owner , buyer ; //admin is the first of the list of hardhat accounts that initially holds the initial supply
    let tokenPrice = 1000000000000000 ; //in wei (10^5) , 0.01 ether
    let totalSupply = 10000 ;
    let tokensAvailable = 7500 ; //for the token sale
    
    beforeEach(async()=>{
        [admin , owner , buyer] = await ethers.getSigners() ;
        //deploying token contract with total supply of tokens
        let Token = await ethers.getContractFactory('ShankToken') ;
        tokenContract = await Token.deploy(totalSupply) ;
        //deploying token sale contract 
        TokenSale = await ethers.getContractFactory('ShankTokenSale') ;
        tokenSaleContract = await TokenSale.connect(await ethers.getSigner(owner.address)).deploy(tokenContract.address , tokenPrice) ;
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
       it('owner account should have all the tokens' , async()=>{
            expect(await tokenContract.balanceOf(admin.address)).to.be.equals(totalSupply);
        });
    });

    describe('Transactions' , async()=>{
        let numberOfTokens , value , signedBuyer ;
        beforeEach(async()=>{
            numberOfTokens = 3 ;
            value = numberOfTokens * tokenPrice ;
            signedBuyer = await ethers.getSigner(buyer.address);
            //transfer available tokens to token sale contract from admins account :
            tokenContract.transfer(tokenSaleContract.address , tokensAvailable);
        });
        it('reverts when msg.value is not equal to token price' , async()=>{
            let transaction = tokenSaleContract.connect(signedBuyer).buyTokens(numberOfTokens, {value:1});
            await expect(transaction).to.be.reverted;
        });
        it('emits a sell event on buying tokens' , async()=>{
            let transaction = tokenSaleContract.connect(signedBuyer).buyTokens(numberOfTokens, {value:value});
            expect(transaction).to.emit(tokenSaleContract , 'Sell').withArgs(buyer.address , numberOfTokens) ;
        });
        it('should fail when we are trying to buy more tokens than the contract has' , async()=>{
            expect(await tokenContract.balanceOf(tokenSaleContract.address)).to.be.equals(tokensAvailable);
            await expect( tokenSaleContract.connect(signedBuyer).buyTokens(7501 , {value : numberOfTokens*tokenPrice})).to.be.revertedWith('contract has insufficient funds') ;
        })
        it('facilitates token buying' , async()=>{
            //keep track of number of tokens sold 
            await expect(tokenSaleContract.connect(signedBuyer).buyTokens(numberOfTokens , {value : value})).to.not.be.reverted ;
            expect(await tokenSaleContract.tokensSold()).to.be.equals(numberOfTokens) ;
            //require that transfer is successfull
            expect(await tokenContract.balanceOf(buyer.address)).to.be.equals(numberOfTokens);
        });
        it('call to end token sale from buyer fails' , async()=>{
            await expect(tokenSaleContract.connect(signedBuyer).endTokenSale()).to.be.revertedWith('only the admin can end the sale') ;
        });
        it('call to end token salefrom admin succeeds' , async()=>{
            await expect(tokenSaleContract.connect(owner).endTokenSale()).to.be.not.reverted ;
        });
        it('ends the token sale after transferring remaining amount to admin' , async()=>{
            await expect(tokenSaleContract.connect(signedBuyer).buyTokens(numberOfTokens , {value : value})).to.not.be.reverted ;
            tokensSold = await tokenSaleContract.tokensSold() ;
            expect(tokensSold).to.be.equals(numberOfTokens) ;
            remainingTokens = tokensAvailable - tokensSold ;
            expect(await tokenContract.balanceOf(tokenSaleContract.address)).to.be.equals(remainingTokens) ;
            expect(await tokenSaleContract.connect(owner).endTokenSale()).to.emit(tokenSaleContract , 'End') ;
        });
    });
});