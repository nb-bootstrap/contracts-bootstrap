const { expect } = require("chai");
const path = require("path");
const networks = require("./hardhat.config").networks;
const migration = path.join(__dirname, "scripts", "migration.js");
const { initConstract, newContract, CONTEXT } = require("./utils");
const _ = require("lodash");

async function main() {
    // get network
    const network = networks[process.env.HARDHAT_NETWORK];
    // network is exsits.
    expect(network).to.not.undefined;
    CONTEXT.contracts = {};
    CONTEXT.deploy = deployContract;
    await initConstract();
    // 初始化 migration
    await require(migration)(CONTEXT);
}

const deployContract = async (contractName, args = [], name = "") => {
    const contract = await newContract(contractName, args);
    CONTEXT.contracts[_.isEmpty(name) ? contractName : name] = contract;
    return contract;
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
