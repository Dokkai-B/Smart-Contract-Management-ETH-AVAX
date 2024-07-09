// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy({ value: hre.ethers.utils.parseEther("1.0") });

  await assessment.deployed();

  console.log("Assessment deployed to:", assessment.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
