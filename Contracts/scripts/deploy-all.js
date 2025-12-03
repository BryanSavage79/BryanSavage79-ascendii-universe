// scripts/deploy-all.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await deployer.getBalance()), "ETH");

  // 1. Mock USDC (only needed once)
  const USDC = await ethers.deployContract("MockUSDC");
  await USDC.waitForDeployment();
  console.log("MockUSDC:", USDC.target);

  // 2. InterlinkNFT
  const Interlink = await ethers.deployContract("InterlinkNFT");
  await Interlink.waitForDeployment();
  console.log("InterlinkNFT:", Interlink.target);

  // 3. EffortYieldStreamer
  const SablierAddress = "0x73614e8C70f7e9e5c9f77c73c0a46e3e4e0e1f71"; // official Sepolia
  const Streamer = await ethers.deployContract("EffortYieldStreamer", [
    USDC.target,
    Interlink.target,
    SablierAddress,
    deployer.address
  ]);
  await Streamer.waitForDeployment();
  console.log("EffortYieldStreamer:", Streamer.target);

  // 4. Mint yourself a Chronos Relic
  await Interlink.mint(deployer.address);
  console.log("Chronos Relic #1 minted to you");

  // 5. Fund Streamer with 10,000 USDC.e
  await USDC.transfer(Streamer.target, 10_000e6);
  console.log("Funded Streamer with 10,000 USDC.e");

  console.log("\nCeremony complete!");
  console.log("Next step: call distributeWeeklyYield([your_address])");
}

main().catch((e) => { console.error(e); process.exit(1); });
