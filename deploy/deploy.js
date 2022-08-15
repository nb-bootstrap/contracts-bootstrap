const { expect } = require("chai");
const path = require("path");
const fs = require("fs");
const networks = require("../hardhat.config").networks;
const addressList = require("./address.json");
const { initConfig, newContract, CONTEXT, newContractByAddress, gasUsedAnalyze } = require("./utils");
const _ = require("lodash");
const { ethers } = require("ethers");
const dir = path.join(__dirname, "../", "scripts");
// get network
const network = networks[process.env.HARDHAT_NETWORK];
CONTEXT.ethPrice = network.ethPrice ? network.ethPrice : 1000;
async function main() {
    CONTEXT.contractAddressLists = addressList;
    const reset = process.env.reset == 1;
    let from = process.env.from ? parseInt(process.env.from) : -1;
    from = reset === true ? 0 : from;
    // network is exsits.
    expect(network).to.not.undefined;
    CONTEXT.contracts = {};
    CONTEXT.deploy = deployContract;
    CONTEXT.initAt = initContract;
    await initConfig();
    // 初始化 migration
    if (from === 0 || !CONTEXT.contractAddressLists.Migrations) {
        CONTEXT.migration = await deployContract("Migrations");
    } else {
        CONTEXT.migration = await initContract("Migrations");
    }
    // 设置 from
    from = from == -1 ? (await CONTEXT.migration.last_completed_migration()) + 1 : from;
    // 读取 dir
    const __dirPath = network.deployDir ? path.join(dir, network.deployDir) : dir;
    const fileList = fs.readdirSync(__dirPath);
    // 排序
    fileList.sort();
    for (let i = 0; i < fileList.length; i++) {
        await migrateIt(__dirPath, fileList[i], from);
    }
    gasUsedAnalyze();
}

const migrateIt = async (fileDir, fileName, from) => {
    const index = parseInt(fileName.split("_")[0]);
    if (from <= index) {
        await require(path.join(fileDir, fileName))(CONTEXT);
        CONTEXT.logs.success("Execute file %s successfully.", fileName);
        console.log("Start saving and perform step %s.", index);
        await CONTEXT.migration.setCompleted(index);
        console.log("Save step %s success", index);
    } else {
        console.log("Skiped %s file deployment", fileName);
    }
};

const deployContract = async (contractName, args = [], name = "") => {
    const contract = await newContract(contractName, args);
    CONTEXT.contracts[_.isEmpty(name) ? contractName : name] = contract;
    CONTEXT.contractAddressLists[_.isEmpty(name) ? contractName : name] = contract.address;
    // 保存
    fs.writeFileSync(path.join(__dirname, "address.json"), JSON.stringify(CONTEXT.contractAddressLists));
    return contract;
};

const initContract = async (contractName, address) => {
    const address = ethers.utils.isAddress(address) ? address : CONTEXT.contractAddressLists[contractName];
    return await newContractByAddress(contractName, address);
};
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
