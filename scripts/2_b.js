module.exports = async ({ deployer, initAt }) => {
    // 部署合约
    await deployer("ContactName", xxx, [arg1, arg2]);
    // 获取已经调用deployer后的合约
    await initAt("ContactName");
    // 从地址初始化合约
    await initAt("ContactName", "0x.............");
};
