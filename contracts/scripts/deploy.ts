import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy InviteMeNFT
  console.log("\n--- Deploying InviteMeNFT ---");
  const InviteMeNFT = await ethers.getContractFactory("InviteMeNFT");
  const inviteNFT = await InviteMeNFT.deploy();
  await inviteNFT.waitForDeployment();
  const nftAddress = await inviteNFT.getAddress();
  console.log("InviteMeNFT deployed to:", nftAddress);

  // Deploy InviteMeFactory
  console.log("\n--- Deploying InviteMeFactory ---");
  const InviteMeFactory = await ethers.getContractFactory("InviteMeFactory");
  const factory = await InviteMeFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("InviteMeFactory deployed to:", factoryAddress);

  // Enable single contract mode on factory
  console.log("\n--- Enabling single contract mode ---");
  const tx = await factory.enableSingleContractMode();
  await tx.wait();
  const activeContract = await factory.getActiveContract();
  console.log("Factory active contract:", activeContract);

  console.log("\n=== Deployment Summary ===");
  console.log("InviteMeNFT:", nftAddress);
  console.log("InviteMeFactory:", factoryAddress);
  console.log("Factory Active Contract:", activeContract);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
