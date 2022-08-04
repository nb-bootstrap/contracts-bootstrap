const { expect } = require("chai");
const path = require("path");
const networks = require("../hardhat.config").networks;
const migration = path.join(__dirname, "migration.js");
const addressList = require("./address.json");
const { initConfig, newContract, CONTEXT, newContractByAddress } = require("./utils");
const _ = require("lodash");

async function main() {
    // get network
    const network = networks[process.env.HARDHAT_NETWORK];
    const reset = process.env.reset == 1;
    const from = process.env.from ? parseInt(process.env.from) : -1;
    // network is exsits.
    expect(network).to.not.undefined;
    CONTEXT.contracts = {};
    CONTEXT.deploy = deployContract;
    CONTEXT.get = newContractByAddress;
    await initConfig();
    // 初始化 migration
    if (from === 0 || reset === true || !addressList.migration) {
        await require(migration)(CONTEXT);
    } else {
        //
    }
}

const deployContract = async (contractName, args = [], name = "", reset = false) => {
    const contract = await newContract(contractName, args);
    CONTEXT.contracts[_.isEmpty(name) ? contractName : name] = contract;
    return contract;
};

const initContract = async (contractName) => {
    return await newContractByAddress(contractName, addressList[contractName]);
};
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
