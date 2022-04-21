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


  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [airdropOwner, addr1, addr2, addr3] = await ethers.getSigners()
    
    // Deploy the token contract 
    const Token = await ethers.getContractFactory("Token")
    const token = await Token.deploy()
    
    // Deploy the airdrop smart contract
    const Airdrp = await ethers.getContractFactory("Airdrop")
    airdrop = await Airdrp.deploy(token.address)
    
    await token.connect(airdropOwner).mint(airdrop.address,1000) 
 });

    // Airdrop tokens to the list of addresses provided
    it("Airdrops tokens to a list of addresses", async () => {
    await airdrop.connect(airdropOwner).dropTokens([addr1.address, addr2.address], [1, 1]);
      });

    // Fail when withdraw function is not called by the owner
   it('should fail when not called by contract creator', async () => {

        await expect(
        airdrop.connect(addr2).withdrawTokens(addr1.address))
        .to.be.revertedWith("Ownable: caller is not the owner")
      });

 });
 
