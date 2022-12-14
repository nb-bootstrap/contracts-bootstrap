const { web3 } = require("@openzeppelin/test-environment");
const _ = require("lodash");
const GAS_PRICE = web3.utils.toWei("5", "Gwei");
const BNB_PRICE = 213;
const GAS_GROUP_SUM = {};

const CONTEXT = {};
const newContract = async (name, args = []) => {
    args = Array.isArray(args) ? args : [args];
    const Contract = await ethers.getContractFactory(name);
    const ct = await Contract.deploy(...args);
    await listenGasUsed(() => ct.deployed(), `Deployed ${name}`, "Deployed");
    console.log("%s contract was deployed.", name);
    return ct;
};

const initConstract = async () => {
    // @ts-ignore
    const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    CONTEXT.addr1 = addr1;
    CONTEXT.addr2 = addr2;
    CONTEXT.owner = owner;
    CONTEXT.addr3 = addr3;
    CONTEXT.addr4 = addr4;
};

const listenGasUsed = async (callback, message, groupName = "DEFAULT") => {
    let log = await callback();
    if (_.isFunction(log.wait)) {
        log = await log.wait();
    }
    const gasLimit = log.gasUsed ? log.gasUsed : log.deployTransaction.gasLimit;
    const usd = web3.utils.toBN(GAS_PRICE).mul(web3.utils.toBN(gasLimit));
    console.log("%s used gas about %s,%s $BNB,%s $BUSD", message, gasLimit.toNumber(), web3.utils.fromWei(usd, "ether"), web3.utils.fromWei(usd.mul(web3.utils.toBN(BNB_PRICE)), "ether"));
    if (GAS_GROUP_SUM[groupName] === undefined) {
        GAS_GROUP_SUM[groupName] = 0;
    }
    GAS_GROUP_SUM[groupName] += gasLimit.toNumber();
    return log;
};

const gasUsedAnalyze = () => {
    console.log("---------------Gas Used Analyze.");
    for (let p in GAS_GROUP_SUM) {
        let gasLimit = GAS_GROUP_SUM[p];
        const usd = web3.utils.toBN(GAS_PRICE).mul(web3.utils.toBN(gasLimit));
        console.log("Gas Used Analyze[%s]: used gas about %s,%s $BNB,%s $BUSD", p, gasLimit, web3.utils.fromWei(usd, "ether"), web3.utils.fromWei(usd.mul(web3.utils.toBN(BNB_PRICE)), "ether"));
    }
};

module.exports = { newContract, initConstract, CONTEXT, listenGasUsed, gasUsedAnalyze };
