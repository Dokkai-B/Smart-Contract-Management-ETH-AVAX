// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const GuessingGame = await hre.ethers.getContractFactory("GuessingGame");
  const guessingGame = await GuessingGame.deploy();

  await guessingGame.deployed();

  console.log("GuessingGame deployed to:", guessingGame.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
