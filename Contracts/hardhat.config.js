require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const sepoliaConfig = process.env.SEPOLIA_RPC_URL && process.env.PRIVATE_KEY
  ? {
      sepolia: {
        url: process.env.SEPOLIA_RPC_URL,
        accounts: [process.env.PRIVATE_KEY],
      },
    }
  : {};

module.exports = {
  solidity: "0.8.24",
  networks: {
    ...sepoliaConfig,
  },
};
