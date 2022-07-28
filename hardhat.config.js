const { task } = require("hardhat/config");

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
const { infuraApiKey, privkey, bsc_mnemonic, mnemonic, mnemonic_test } = require("./secrets.json");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks: {
        rinkeby: {
            url: `http://13.231.201.42:8645/`,
            //url: `https://rinkeby.infura.io/v3/c9a81f9cf0894ab5ae3f1dbed3cfa509`,
            accounts: { mnemonic: mnemonic },
            gasPrice: 1500000000,
            timeout: 100000,
        },
        localhost: {
            url: `http://127.0.0.1:8545/`,
            gasPrice: 3000000000,
            timeout: 100000,
        },
        bnbtest: {
            url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
            accounts: { mnemonic: bsc_mnemonic },
            gasprice: 3000000000,
            timeout: 100000,
        },
    },
    solidity: {
        compilers :[
            {version:"0.4.18"},
            {version:"0.5.16"},
            {version:"0.6.6",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 300,
                }
            }},
            {version:"0.6.0"},
            {version: "0.8.10",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                }
            }}
        ],
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
};
