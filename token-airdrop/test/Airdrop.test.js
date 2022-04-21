const { expect } = require("chai");
const { ethers } = require("hardhat");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` recieves the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Airdrop contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let airdrop;
  let airdropOwner;
  let airdropDeployed;
  let tokenAddr;
  let addr1;
  let addr2;
  let addrs;
  let tokenAddress;
  let beneficairy;


  
  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [airdropOwner, tokenAddr, addr1, addr2, ...addrs] = await ethers.getSigners()
    const Airdrp = await ethers.getContractFactory("Airdrop", airdropOwner)
    tokenAddress = await tokenAddr.getAddress();
    beneficairy = await addr2.getAddress();
    airdrop = await Airdrp.deploy(tokenAddress) 

    airdropDeployed = await airdrop.deployed()  
 });

    it("Airdrops tokens to a list of addresses", async () => {
    await airdropDeployed.dropTokens( [addr1.address, addr2.address], [1, 1]);
      });

   it('should fail when not called by contract creator', async () => {
        airdropDeployed = airdropDeployed.connect(airdropOwner)
        await expect(airdropDeployed.withdrawTokens(addr2.address)).to.be.revertedWith("Not Authorized")
      });

 });
 