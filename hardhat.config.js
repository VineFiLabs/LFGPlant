require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks:{
    monad: {
      url: process.env.MONAD_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2]
    },
    sonic: {
      url: process.env.SONIC_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2]
    }
  },
  solidity: {
    compilers:[
      {version: "0.8.23"},
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    enabled: true,  
    currency: 'ETH',  
    // coinmarketcap: 'YOUR_API_KEY',
    outputFile: 'gas-report.txt', 
    noColors: true 
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://testnet.monadexplorer.com",
    failOnCompilerError: false,
    validateSourcesOnPush: false
  },
  etherscan: {
    enabled: false
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 4000
  }
  
};
