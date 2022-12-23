const { ethers } = require('hardhat') ;
const { expect } = require('chai') ;

describe('ShankToken Contract' , ()=>{
    let tokenContract ;
    let owner , acc1 , acc2 ;
    beforeEach(async()=>{
        Token = await ethers.getContractFactory('ShankToken');
        tokenContract = await Token.deploy(350) ;
        [owner , acc1 , acc2] = await ethers.getSigners() ;
    });
    describe('Deployment' , ()=>{
        it('allocates the initial supply on deployment' , async()=>{
            expect(await tokenContract.totalSupply()).to.not.be.undefined ;
            expect(await tokenContract.totalSupply()).to.be.equals(350) ;
        });
        it('sets the owner\'s balance on deployment' , async()=>{
            expect(await tokenContract.balanceOf(owner.address)).to.be.equals(350) ;
        });
    });
    describe('Transfer' , ()=>{
        it('emits Transfer event during transaction' , async()=>{
            await expect(tokenContract.transfer(acc1.address , 10)).to.emit(tokenContract , 'Transfer').withArgs(owner.address , acc1.address , 10);
        });
        it('transfers money from sender to an address' , async()=>{
            await expect(tokenContract.transfer(acc1.address , 20)).to.not.be.reverted ;
            expect(await tokenContract.balanceOf(acc1.address)).to.be.equals(20) ;
            expect(await tokenContract.balanceOf(owner.address)).to.be.equals(330) ;
        });
        it('should not transfer when sender has insufficient balance' , async()=>{
            await expect(tokenContract.transfer(acc1.address , 600)).to.be.revertedWith('sender has insufficient tokens');
        });
    });
    describe('Approve' , ()=>{
        beforeEach(async()=>{
            await expect(tokenContract.transfer(acc1.address , 250)).to.not.be.reverted ;
        });
        it('should emit Approval event after transaction is completed successfully' , async()=>{
            await expect(tokenContract.approve(acc1.address , 100)).to.emit(tokenContract , 'Approval').withArgs(owner.address , acc1.address , 100) ;
        });
        it('checks the amount the owner has allowed to a spender' , async()=>{
            await expect(tokenContract.approve(acc1.address , 100)).to.not.be.reverted ;
            transaction = await tokenContract.allowance(owner.address , acc1.address) ;
            expect(transaction).to.not.be.undefined ;
            expect(transaction).to.be.equals(100);
        });
    });
    describe('Transfer From' , ()=>{
        beforeEach(async()=>{
            //funding the account with 200 tokens
            await tokenContract.transfer(acc1.address , 200) ;
        }) ;
        it('must revert if account does not have enough tokens , but has permission to transfer tokens' , async()=>{
            await expect(tokenContract.approve(acc1.address , 200)).to.emit(tokenContract , 'Approval').withArgs(owner.address , acc1.address , 200) ;
            await expect(tokenContract.transferFrom(acc1.address , acc2.address , 9000)).to.be.revertedWith('account does not have enough tokens to transfer') ;
        });
        it('must revert if account does not have permission to transfer tokens'  , async()=>{
            await expect(tokenContract.transferFrom(acc1.address , acc2.address , 20)).to.be.revertedWith('account does not have permission to transfer all tokens') ;
        });
        it('must transfer tokens when all conditions are met' , async()=>{
            //allowed to transfer 100 tokens (owns 200 initially)
            await tokenContract.approve(acc1.address , 100) ;
            //transfers 10 tokens
            await expect(tokenContract.transferFrom(acc1.address , acc2.address , 10)).to.not.be.reverted ;
            expect(await tokenContract.balanceOf(acc1.address)).to.be.equals(190) ;
            expect(await tokenContract.balanceOf(acc2.address)).to.be.equals(10) ;
            //now allowed to transfer 100-10=90 tokens
            expect(await tokenContract.allowance(owner.address , acc1.address)).to.be.equals(90) ;
        });
    });

})