const { task, types } = require("hardhat/config");

require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-gas-reporter");
require("solidity-coverage");
const { bsc, mainnet, bnbtest, rinkeby, development } = require("./.secrets.json");
task("run").addFlag("reset", "重新部署所有合约").addOptionalParam("dir", "合约目录地址").addOptionalParam("f", "从特定序号开始重新执行合约");
// add reset and from
const args = process.argv;
if (args.includes("--reset")) {
    process.env.reset = 1;
}
let index;
if ((index = args.indexOf("--f")) !== -1) {
    if (args.length > index + 1 && /[0-9]/.test(args[index + 1])) {
        process.env.from = args[index + 1];
    }
}
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//     const accounts = await hre.ethers.getSigners();

//     for (const account of accounts) {
//         console.log(account.address);
//     }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks: {
        rinkeby: {
            url: `http://54.95.147.100:8645`,
            accounts: [rinkeby],
            gasPrice: 1500000000,
            timeout: 100000,
        },
        localhost: {
            url: `http://127.0.0.1:8545/`,
            accounts: [development],
            gasPrice: 3000000000,
            timeout: 100000,
            ethPrice: 1800,
            deployDir: "",
        },
        bnbtest: {
            url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
            accounts: [bnbtest],
            gasprice: 3000000000,
            timeout: 100000,
        },
    },
    solidity: {
        compilers: [
            { version: "0.4.18" },
            { version: "0.5.16" },
            {
                version: "0.6.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 300,
                    },
                },
            },
            { version: "0.6.0" },
            {
                version: "0.8.10",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
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
