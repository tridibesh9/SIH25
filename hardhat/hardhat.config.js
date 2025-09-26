require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    hardhat: {
      chainId: 31337, // set chain ID for local Hardhat network
    },
    localhost: {
      url: "http://127.0.0.1:8545", // your RPC URL
      chainId: 31337,               // must match MetaMask chain ID
    },
  },
  paths: {
    artifacts: '../frontend/src/artifacts', // specify custom artifacts path  
  }
};
