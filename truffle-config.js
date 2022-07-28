const HDWalletProvider = require("@truffle/hdwallet-provider");
const { rinkeby,development,bsc ,mainnet} = require("./.secrets.json");
const configs = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    // contracts_directory: "./contracts/factory",
    migrations_directory: "./migrations/rinkeby",
    networks: {
        development: {
            network_id: "*", // Any network (default: none)
            gasLimit: 5000000,
            gasPrice: 20000000000,
            provider: () => new HDWalletProvider(development, "http://127.0.0.1:8545"),
        },
        rinkeby: {
            network_id: 4, // Any network (default: none)
            // gas: 20000000,
            gasPrice: 2000000000,
            timeoutBlocks: 20,
            provider: () => new HDWalletProvider(rinkeby, "http://54.95.147.100:8645"),
            skipDryRun: true,
            websockets: true,
        },
        bsc: {
            network_id: 56,
            gasPrice: 5000000000,
            timeoutBlocks: 20,
            provider: () => new HDWalletProvider(bsc, "https://bsc-dataseed1.binance.org/"),
            skipDryRun: true,
            websockets: true,
        },
        mainnet: {
            network_id: 1,
            //gasPrice: 35000000000,
            gasPrice: 10000000000,
            timeoutBlocks: 20,
            provider: () => new HDWalletProvider(mainnet, "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"),
            skipDryRun: true,
        },
    },
    compilers: {
        solc: {
            version: "0.8.10",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 999,
                },
                outputSelection: {
                    "*": {
                        "*": ["abi", "evm.bytecode", "evm.deployedBytecode", "evm.methodIdentifiers", "metadata", "devdoc", "userdoc", "storageLayout", "evm.gasEstimates"],
                    },
                },
                metadata: {
                    useLiteralContent: true,
                },
                libraries: {},
            },
        },
    },
    plugins: ["truffle-plugin-verify"],
};
const getEnv = () => {
    for (let name in configs.networks) {
        if (process.argv && process.argv.includes(name)) {
            return name;
        }
    }
};

// 获取网络
const env = getEnv();
// 设置 网络目录
// configs.migrations_directory = `./migrations/${env}`;
process.env.network = env;
module.exports = configs;
