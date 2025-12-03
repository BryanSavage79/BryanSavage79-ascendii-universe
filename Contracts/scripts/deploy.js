async function main() {
  const Relic = await ethers.getContractFactory("ChronosRelic");
  const relic = await Relic.deploy();
  await relic.deployed();
  console.log("ChronosRelic deployed to:", relic.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
