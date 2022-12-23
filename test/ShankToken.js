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
        it('sets the name , symbol and standard on deployment' , async()=>{
            expect(await tokenContract.name()).to.be.equals("ShankToken") ;
            expect(await tokenContract.symbol()).to.be.equals("STK") ;
            expect(await tokenContract.standard()).to.be.equals("Shank Token v1.0") ;
        });
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
            await expect(tokenContract.transferFrom(acc1.address , acc2.address , 9000)).to.be.revertedWith('account has insufficient balance') ;
        });
        it('must revert if account does not have permission to transfer tokens'  , async()=>{
            await expect(tokenContract.transferFrom(acc1.address , acc2.address , 20)).to.be.revertedWith('cannot transfer value larger than approved amount') ;
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
    describe('Increase allowance' , ()=>{
        it('must increase the existing allowance by some value' , async()=>{
            await tokenContract.approve(acc1.address , 300) ;
            await tokenContract.transfer(acc1.address , 300) ;
            expect(await tokenContract.allowance(owner.address , acc1.address)).to.be.equal(300) ;
            await tokenContract.increaseAllowance(acc1.address , 5) ;
            expect(await tokenContract.allowance(owner.address , acc1.address)).to.be.equals(305) ;
        });
    });
    describe('Decrease allowance' , ()=>{
        beforeEach(async()=>{
            await tokenContract.approve(acc1.address , 300) ;
            await tokenContract.transfer(acc1.address , 300) ;
        });
        it('decrement allowance' , async()=>{
            await expect(tokenContract.decreaseAllowance(acc1.address , 5)).to.not.be.reverted ;
            expect(await tokenContract.allowance(owner.address , acc1.address)).to.be.equals(295) ;
        });
        it('should revert when decrement value is greater than previous allowance' , async()=>{
            await expect(tokenContract.decreaseAllowance(acc1.address , 5000)).to.be.revertedWith('allowed amount must be greater than or equal to decrement') ;
        });
    });
});