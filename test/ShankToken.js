const { ethers } = require('hardhat') ;
const { expect } = require('chai') ;

describe('ShankToken Contract' , ()=>{
    let tokenContract ;
    let owner , acc1 ;
    beforeEach(async()=>{
        Token = await ethers.getContractFactory('ShankToken');
        tokenContract = await Token.deploy(350) ;
        [owner , acc1] = await ethers.getSigners() ;
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
        it('checks for approval to finish' , async()=>{
            await expect(tokenContract.approve(acc1.address , 100)).to.not.be.reverted ;
            transaction = await tokenContract.allowance(owner.address , acc1.address) ;
            expect(transaction).to.not.be.undefined ;
            expect(transaction).to.be.equals(100);
        });
        it('should emit Approval event after transaction is completed successfully' , async()=>{
            await expect(tokenContract.approve(acc1.address , 100)).to.emit(tokenContract , 'Approval').withArgs(owner.address , acc1.address , 100) ;
        });
    });
})