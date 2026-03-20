# Base 主网合约权限执行文档

## 1. 范围

- 网络：Base Mainnet
- 基准部署地址：`0x54fa4358330136332430e779BeaAD0CbA1404eAf`
- 本文基于以下本地源码与文档整理：
  - `D:\buzzing\projects\v3-periphery\contracts\FeeRebateDistributor.sol`
  - `D:\buzzing\projects\v3-periphery\contracts\PreTrading.sol`
  - `D:\buzzing\projects\v3-periphery\contracts\DynamicFeeManager.sol`
  - `D:\buzzing\projects\v3-periphery\contracts\USDB.sol`
  - `D:\buzzing\projects\v3-periphery\contracts\contractFactory.sol`
  - `D:\buzzing\projects\v3-core\contracts\BuzzingSwapFactory.sol`
  - `D:\buzzing\projects\v3-periphery\contracts\FeeAdapterTransparent.sol`
  - `D:\buzzing\projects\v3-periphery\deploy\resumeBuzzingDeploy.baseMainnet.js`
  - `D:\buzzing\projects\v3-periphery\doc\Base-mainnet-upgradeable-and-owner-inventory.zh-CN.md`
  - `D:\buzzing\projects\PERMISSIONS.md`

## 2. 权限类型

### 2.1 `owner`

- 单一治理地址
- 可迁移
- 多用于参数修改、角色授权、资金提取或关键地址切换

### 2.2 `auth / wards`

- 多管理员模型
- 通过 `rely` / `deny` 或 `setAuth` 管理执行地址
- 常用于后端运营、分发、清算或自动化作业

### 2.3 `oracle`

- 不一定等于 owner
- 拥有业务结果判定权
- 在 `PreTrading` 中属于高风险执行权限

### 2.4 `ProxyAdmin.owner`

- 与业务合约 owner 分离
- 控制透明代理升级
- 由 `upgrades.deployProxy(..., { kind: "transparent" })` 引入

## 3. 待迁移权限

### 3.1 owner 待迁移

| 合约 | 地址 | 当前 owner | 可执行函数 |
|---|---|---|---|
| FeeRebateDistributor | `0x4F0077104Ca290cC4D26E0877033b8330334081F` | 部署地址 | `transferOwnership` `setFeeAdapter` `setAuth` `revokeAuth` |
| PreTrading | `0x33dCFc0c163B7309422beD6d6BBf73DA946c0284` | 部署地址 | `withdrawMarketFee` `setDelay` `transferOwnership` `setOracle` `emergencyTransferERC20` |
| DynamicFeeManager | `0x236e856418ffF886efBA88ba6c79fd6543aaFD24` | 部署地址 | `reset` `transferOwnership` |
| USDB | `0x89401d7C5F5Cf4936F10418B9C536f97b0bCf71B` | 部署地址 | `transferOwnership` `setVault` |

### 3.2 升级权限待迁移

| ProxyAdmin | 当前 owner | 影响的 Proxy |
|---|---|---|
| `0x31275dFd50d1fd1802da26c4D7BE594046E6e41a` | 部署地址 | `tBLPProxy` `sBLPProxy` `tradeManagerProxy` `feeAdapterProxy` |

标准透明代理管理动作：

- `transferOwnership(address)`
- `upgrade(address proxy, address implementation)`
- `upgradeAndCall(address proxy, address implementation, bytes data)`
- `changeProxyAdmin(address proxy, address newAdmin)`

说明：

- 上述函数基于 OpenZeppelin Transparent ProxyAdmin 标准模式归纳。
- 你仓库里的部署脚本明确使用 `upgrades.deployProxy(..., { kind: "transparent" })`。

## 4. 已分配 owner

| 合约 | 地址 | 当前 owner | 权限用途 |
|---|---|---|---|
| ContractFactory | `0x179365245C424453C51F2f34b0AA2C51fC32EaCC` | `0x4b9E4e5543Ce2F93D23566303aAb91ee63CeEF1d` | 代充值工厂部署 |
| BuzzingSwapFactory | `0x1d470E77e9980Aa342646434c800f439ED3489c1` | `0xd1729ee9687408544e5e91c0220c5b2e69EfF2Ac` | 市场创建、费率治理、协议费提取 |
| FeeAdapterTransparent (Proxy) | `0xE454a76dA1Ec485061488d8c272D2154bf1ddf4F` | `0xd1729ee9687408544e5e91c0220c5b2e69EfF2Ac` | 分账配置与收款地址治理 |

## 5. 权限函数矩阵

### 5.1 FeeRebateDistributor

`owner` 可执行：

- `transferOwnership(address newOwner)`
- `setFeeAdapter(address newAdapter)`
- `setAuth(address account, bool allowed)`
- `revokeAuth(address account)`

`auth` 可执行：

- `distribute(address token, address to, uint256 amount)`
- `referFeeDistribute(address token, address to, uint256 amount)`
- `referFeeDistributeBatch(address token, address[] recipients, uint256[] amounts)`

### 5.2 PreTrading

`owner` 可执行：

- `withdrawMarketFee(address to)`
- `setDelay(uint256 _delay)`
- `transferOwnership(address newOwner)`
- `setOracle(address newOracle)`
- `emergencyTransferERC20(address token, address to, uint256 amount)`

`oracle` 可执行：

- `resolveMarket(bytes32 conditionId, MarketResult result)`
- `unsetMarket(bytes32 conditionId, MarketStatus status)`

### 5.3 DynamicFeeManager

`owner` 可执行：

- `reset(...)`
- `transferOwnership(address newOwner)`

### 5.4 USDB

`owner` 可执行：

- `transferOwnership(address newOwner)`
- `setVault(address _vault)`

`vault` 可执行：

- `distribute(address recipients, uint256 amount)`
- `mint(address to, uint256 amount)`
- `burn(address from, uint256 amount)`

### 5.5 ContractFactory

`owner` 可执行：

- `transferOwnership(address newOwner)`
- `deploy(address eoa)`

### 5.6 BuzzingSwapFactory

`owner` 可执行：

- `createPool(address tokenA, address tokenB, uint24 fee)`
- `setOwner(address _owner)`
- `enableFeeAmount(uint24 fee, int24 tickSpacing)`
- `setWhiteListAddress(address user, bool verified)`
- `setFeeAmountExtraInfo(uint24 fee, bool whitelistRequested, bool enabled)`
- `setLmPoolDeployer(address _lmPoolDeployer)`
- `setFeeProtocol(address pool, uint32 feeProtocol0, uint32 feeProtocol1)`
- `collectProtocol(address pool, address recipient, uint128 amount0Requested, uint128 amount1Requested)`

`ownerOrLmPoolDeployer` 可执行：

- `setLmPool(address pool, address lmPool)`

### 5.7 FeeAdapterTransparent

`owner` 可执行：

- `setVault(address newVault)`
- `transferOwnership(address newOwner)`
- `setPoolTotalFeeRatio(address pool, uint256 ratio)`
- `setPoolRole(address pool, bytes32 role, address recipient, uint256 share)`
- `setPoolReferShare(address pool, uint256 share)`
- `emergencyTransferERC20(address token, address to, uint256 amount)`

`vault` 可执行：

- `recordFee(address pool, address refer, address token, uint256 totalFeeAmount)`

## 6. Proxy 升级影响面

| Proxy | Proxy 地址 | 当前实现地址 | 升级入口 |
|---|---|---|---|
| tBLPProxy | `0xaaF4C01F8f35e2563C2334802CcE13D09C9256f4` | `0x8AfCeA3a5CB72A27Af5759210525fe7CAE96c99A` | `ProxyAdmin.owner` |
| sBLPProxy | `0x2A149d1b7Cb2cFBd8AF7ea0c816ebaB85bd7Cc45` | `0xEd0aBDdF425c742C97fb8CaF83d2056d8C19A1FA` | `ProxyAdmin.owner` |
| tradeManagerProxy | `0x4a8793AE855AE40A00504D61d2ac4074B5214669` | `0xaE7195bFe99Acd1838C9a26E55e5f68DCAb23d39` | `ProxyAdmin.owner` |
| feeAdapterProxy | `0xE454a76dA1Ec485061488d8c272D2154bf1ddf4F` | `0x7a252f809C12c8566ea67aa03308C4C3c94Bd537` | `ProxyAdmin.owner` |

## 7. 建议执行顺序

1. 先迁移 `ProxyAdmin.owner` 到治理多签。
2. 再迁移 4 个待转移 `owner`。
3. 补齐日常执行权限，例如 `FeeRebateDistributor.setAuth(...)`。
4. 如 `PreTrading` 最终采用“只迁 oracle”的策略，需同步改主清单，避免执行偏差。
5. 每一步执行后立刻做链上读回验收。

## 8. 验收清单

- `FeeRebateDistributor.owner()` 为目标地址
- `PreTrading.owner()` 或 `oracle()` 与最终决策一致
- `DynamicFeeManager.owner()` 为目标地址
- `USDB.owner()` 为目标地址
- `USDB.vault()` 为预期地址
- `ProxyAdmin.owner()` 为治理多签
- 4 个 Proxy 的 implementation 未被误更新

## 9. 当前需要重点确认的事项

### 9.1 PreTrading 的最终治理策略

存在两个口径：

- 口径 A：按你这次主网清单，`PreTrading.owner` 需要迁移
- 口径 B：按仓库内历史文档，只设置 `oracle`，`owner` 保留不动

### 9.2 ProxyAdmin 接收地址

当前只看到“建议治理地址（建议多签）”，未看到已定稿的具体地址。正式执行前需要补齐。
