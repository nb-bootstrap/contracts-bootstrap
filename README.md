# 使用方式 

## 私钥配置

需要先在根节点建一个 **.secrets.json** json 文件，并输入私钥，具体格式如下

```
{
    "rinkeby":"95d3cec18xxx2a71fa4b6690e57cf7",
    "development":"2045b46f2xxea341d2f",
    "bsc":"275741b421xxx48375a38682da3fd",
    "mainnet":"275741b42ccc248375a38682da3fd",
    "bnbtest":"275741b4210abf8xxxc7248375a38682da3fd"
}
```

## 测试合约

测试代码都放在 **test** 目录中，文件命名 ``` xxx.test.js ```

测试命令

``` 
npx hardhat test test/xxx.test.js  

```

## 部署合约

### 1、部署命令
```
npx hardhat run deploy/deploy.js --network localhost --reset --f 11

```
* reset  从0开始重新部署
* f 从特定序号开始重新部署

### 2、部署代码说明

> 部署的代码放在 **scripts** 目录，使用数字开头，数字决定了部署顺序，具体见样例。


### 3、部署代码结构

```
module.exports = async ({ deployer, initAt }) => {
    // 部署合约
    await deployer("ContactName", xxx, [arg1, arg2]);
    // 获取已经调用deployer后的合约
    await initAt("ContactName");
    // 从地址初始化合约
    await initAt("ContactName", "0x.............");
};


```
