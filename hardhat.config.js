require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

// Replace with your private key
const PRIVATE_KEY = '59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
