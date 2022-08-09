const { web3 } = require("@openzeppelin/test-environment");
const _ = require("lodash");
const GAS_GROUP_SUM = {};

const CONTEXT = {};
CONTEXT.logs = {
    success: function () {
        const [mg, ...args] = arguments;
        console.log(`\u001b[1;32m${mg}\u001b[0m`, ...args);
    },
    error: function () {
        const [mg, ...args] = arguments;
        console.log(`\u001b[1;31m${mg}\u001b[0m`, ...args);
    },
    warn: function () {
        const [mg, ...args] = arguments;
        console.log(`\u001b[1;33m${mg}\u001b[0m`, ...args);
    },
};
const newContract = async (name, args = []) => {
    args = Array.isArray(args) ? args : [args];
    const Contract = await ethers.getContractFactory(name);
    const ct = await Contract.deploy(...args);
    const contract = await listenGasUsed(() => ct.deployed(), `Deployed ${name}`, "Deployed");
    CONTEXT.logs.success("[%s][%s] contract was deployed.", name, contract.address);
    return ct;
};

/**
 * 通过地址初始化一个已经存在的合约
 * @param {*} name 合约名称
 * @param {*} address 地址
 * @returns
 */
const newContractByAddress = async (name, address) => {
    const Contract = await ethers.getContractFactory(name);
    return await Contract.attach(address);
};

const initConfig = async () => {
    const [deployer] = await ethers.getSigners();
    CONTEXT.owner = deployer;
};

const listenGasUsed = async (callback, message, groupName = "DEFAULT") => {
    let log = await callback();
    if (_.isFunction(log.wait)) {
        log = await log.wait();
    }
    const gasPrice = !log.gasPrice ? log.deployTransaction.gasPrice : log.gasPrice;
    const gasLimit = log.gasUsed ? log.gasUsed : log.deployTransaction.gasLimit;
    const usd = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gasLimit));
    console.log("%s used gas  %s wei, %s Ether,about %s $USD", message, gasLimit.toNumber(), web3.utils.fromWei(usd, "ether"), web3.utils.fromWei(usd.mul(web3.utils.toBN(CONTEXT.ethPrice)), "ether"));
    if (GAS_GROUP_SUM[groupName] === undefined) {
        GAS_GROUP_SUM[groupName] = {
            gasLimit: 0,
            amount: 0,
        };
    }
    GAS_GROUP_SUM[groupName].gasLimit += gasLimit.toNumber();
    GAS_GROUP_SUM[groupName].amount += usd.toNumber();
    return log;
};

const gasUsedAnalyze = () => {
    console.log("---------------Gas Used Analyze.");
    for (let p in GAS_GROUP_SUM) {
        let gas = GAS_GROUP_SUM[p];
        const usd = web3.utils.toBN(gas.amount);
        console.log("Gas Used Analyze[%s]: used gas %s wei and %s Ether, about %s $USD", p, gas.gasLimit, web3.utils.fromWei(usd, "ether"), web3.utils.fromWei(usd.mul(web3.utils.toBN(CONTEXT.ethPrice)), "ether"));
    }
};

module.exports = { newContractByAddress, newContract, initConfig, CONTEXT, listenGasUsed, gasUsedAnalyze };
