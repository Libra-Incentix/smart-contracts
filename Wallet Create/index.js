let ethers = require('ethers');
const contract_abi = require('./lix_token_abi.json')

// create a new wallet address
// create_wallet();

// private key of the sender's wallet address
let private_key = "0xf2aa18a686289e7d3f47e848a389e61662b8e47100a85f7eecfc37b73ef35cea"

// token amount to send
let send_token_amount = "100"

// recipient's wallet address
let to_address = '0xBA1E29e008833cF17032a5a733347E22Df14B260'

// sender's wallet address
let send_address = '0x04CbfbF4740D9C2197C9acDA5ab3c512f9c289a3'

// gas limit
let gas_limit = "0x100000"

// contract address (if set to null, native token transfer)
// let contract_address = ""
let contract_address = "0x35BB77A7457273E073c1E5Af0Ba0722A7C42347e"

// network provider
const network_provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");

// get balance of a wallet address
get_balance(
  network_provider,
  contract_address,
  send_address,
  contract_abi
);

send_token(
  network_provider,
  contract_address,
  send_token_amount,
  to_address,
  send_address,
  private_key,
  contract_abi
);

// get balance of a wallet address
function get_balance(
  network_provider,
  contract_address,
  wallet_address,
  contract_abi
) {
  if (contract_address) {
    // get balance of general token

    let contract = new ethers.Contract(
      contract_address,
      contract_abi,
      network_provider
    )
    contract.balanceOf(wallet_address).then((response) => {
      console.log('Token Balance: ', response.toNumber() / Math.pow(10, 9));
    })
  } else {
    // get balance of native token

    network_provider.getBalance(wallet_address).then((response) => {
      console.log('Balance: ', response)
    });
  }
}

// send token from one address to another
function send_token(
  network_provider,
  contract_address,
  send_token_amount,
  to_address,
  send_account,
  private_key,
  contract_abi
) {
  let wallet = new ethers.Wallet(private_key)
  let walletSigner = wallet.connect(network_provider)

  network_provider.getGasPrice().then((currentGasPrice) => {
    let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
    console.log(`gas_price: ${gas_price}`)

    const options = { gasLimit: gas_limit, gasPrice: ethers.BigNumber.from(gas_price).mul(11).div(10).toString() };

    if (contract_address) {
      // send general token

      let contract = new ethers.Contract(
        contract_address,
        contract_abi,
        walletSigner
      )

      // how many tokens?
      let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 9)
      console.log(`Amount Sent: ${numberOfTokens}`)

      // send token
      contract.transfer(to_address, numberOfTokens, options).then((transferResult) => {
        //console.dir(`Transaction Details:${JSON.stringify(transferResult)}`)
        console.log("Transaction Details", transferResult)
      })
    } else { 
      // send native token

      const tx = {
        from: send_account,
        to: to_address,
        value: ethers.utils.parseEther(send_token_amount),
        nonce: network_provider.getTransactionCount(
          send_account,
          "latest"
        ),
        gasLimit: ethers.utils.hexlify(gas_limit),
        gasPrice: gas_price,
      }
      console.dir(tx)
      try {
        // send token
        walletSigner.sendTransaction(tx).then((transaction) => {
          console.dir(transaction)
        })
      } catch (error) {
      }
    }
  })
}