window.DASHBOARD_DATA = {
  network: "Base 主网",
  chainId: 8453,
  generatedAt: "2026-03-20",
  deployer: "0x54fa4358330136332430e779BeaAD0CbA1404eAf",
  governanceMultisig: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
  rpcUrls: [
    "https://mainnet.base.org",
    "https://base-rpc.publicnode.com",
    "https://base.llamarpc.com"
  ],
  heroMeta: [
    "4 个 owner 待迁移",
    "1 个 ProxyAdmin 待迁移",
    "4 个 Proxy 受升级控制"
  ],
  summary: [
    { label: "待迁移 owner", value: 4, sub: "FeeRebateDistributor、PreTrading、DynamicFeeManager、USDB" },
    { label: "待迁移 ProxyAdmin", value: 1, sub: "升级权限仍由部署 EOA 控制" },
    { label: "已分配 owner", value: 3, sub: "ContractFactory、BuzzingSwapFactory、FeeAdapterTransparent" },
    { label: "待添加 auth", value: 4, sub: "FeeRebateDistributor、tradeManagerProxy、tBLPProxy、sBLPProxy" }
  ],
  wallets: [
    {
      name: "部署账号",
      address: "0x54fa4358330136332430e779BeaAD0CbA1404eAf",
      description: "当前仍持有多个 owner 角色和 ProxyAdmin.owner，是本次权限迁移的基准地址。"
    },
    {
      name: "俱乐部运营钱包",
      address: "0xd1729ee9687408544e5e91c0220c5b2e69EfF2Ac",
      description: "用于俱乐部自动化、阶段操作、市场创建和费用治理。"
    },
    {
      name: "代充值钱包",
      address: "0x4b9E4e5543Ce2F93D23566303aAb91ee63CeEF1d",
      description: "用于工厂侧代充值业务与相关操作。"
    },
    {
      name: "治理多签",
      address: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
      description: "作为 ProxyAdmin.owner、待迁移 owner 和 auth/wards 授权名单的目标地址。"
    }
  ],
  functionDescriptions: {
    transferOwnership: "转移当前权限角色到新的地址。",
    setFeeAdapter: "修改返佣分发使用的 FeeAdapter 地址。",
    setAuth: "把地址加入授权白名单，使其可执行返佣发放。",
    revokeAuth: "移除授权白名单地址。",
    distribute: "执行代币或费用分发。",
    referFeeDistribute: "发放单笔推荐返佣。",
    referFeeDistributeBatch: "批量发放推荐返佣。",
    withdrawMarketFee: "提取市场累计手续费。",
    setDelay: "修改市场结算或操作延迟参数。",
    setOracle: "修改负责市场结果的 oracle 地址。",
    emergencyTransferERC20: "紧急转出合约持有的 ERC20 资产。",
    reset: "重置动态费率参数或相关管理地址。",
    setVault: "修改 vault 地址，影响资金或记账入口。",
    upgrade: "将代理合约升级到新的实现。",
    upgradeAndCall: "升级实现后立即执行初始化调用。",
    changeProxyAdmin: "变更代理合约对应的 ProxyAdmin。",
    deploy: "部署新的业务合约实例。",
    createPool: "创建新的交易池或市场池。",
    setOwner: "修改工厂类合约的 owner。",
    enableFeeAmount: "启用新的手续费档位。",
    setWhiteListAddress: "配置白名单地址。",
    setFeeAmountExtraInfo: "调整手续费档位的扩展配置。",
    setLmPoolDeployer: "设置 LM Pool 部署器地址。",
    setFeeProtocol: "修改协议费参数。",
    collectProtocol: "提取协议费。",
    setLmPool: "把池子与 LM Pool 绑定。",
    setPoolTotalFeeRatio: "设置池子的总费率分账比例。",
    setPoolRole: "设置池子的角色和收款配置。",
    setPoolReferShare: "设置推荐分成比例。",
    resolveMarket: "确认市场结果并推进结算。",
    unsetMarket: "撤销或重置市场状态。",
    rely: "把地址加入 wards / auth 管理名单。",
    deny: "把地址从 wards / auth 管理名单移除。",
    setPnlhandler: "设置盈亏处理模块地址。",
    setUSDB: "设置关联的 USDB 地址。",
    setFeeManager: "设置费率管理器地址。",
    addLiquidity: "执行增加流动性。",
    decreaseLiquidity: "执行减少流动性。",
    setYieldProtocol: "设置收益协议相关配置。",
    USDCdeposit: "执行 USDC 存入流程。",
    USDCwithdraw: "执行 USDC 提取流程。",
    ERC20tranfser: "执行 ERC20 资产转移。",
    handleMarketPnl: "处理市场盈亏。",
    marketReport: "提交市场报告。"
  },
  contractDescriptions: {
    FeeRebateDistributor: "返佣分发与推荐返佣处理。",
    PreTrading: "预交易市场结算与市场参数管理。",
    DynamicFeeManager: "动态费率重置与费率管理协调。",
    USDB: "稳定币 owner 与 vault 入口管理。",
    ProxyAdmin: "统一管理可升级代理的升级权限。",
    ContractFactory: "部署代充值相关业务合约。",
    BuzzingSwapFactory: "创建交易池并管理工厂参数。",
    "FeeAdapterTransparent (Proxy)": "费用分账、收款配置与紧急转账。",
    tradeManagerProxy: "交易管理与清算调度授权。",
    tBLPProxy: "tBLP 资产池权限与参数治理。",
    sBLPProxy: "sBLP 资产池权限与参数治理。"
  },
  permissions: [
    {
      id: "feeRebate-owner",
      contract: "FeeRebateDistributor",
      address: "0x4F0077104Ca290cC4D26E0877033b8330334081F",
      permissionType: "owner",
      status: "pending_transfer",
      expectedController: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
      suggestedController: "应迁移到治理多签，后续再按运营需要补齐 auth 白名单。",
      functions: ["transferOwnership", "setFeeAdapter", "setAuth", "revokeAuth"],
      note: "owner 控制 feeAdapter 和 auth 白名单。",
      liveRead: {
        target: "0x4F0077104Ca290cC4D26E0877033b8330334081F",
        abi: ["function owner() view returns (address)"],
        method: "owner"
      }
    },
    {
      id: "feeRebate-auth",
      contract: "FeeRebateDistributor",
      address: "0x4F0077104Ca290cC4D26E0877033b8330334081F",
      permissionType: "auth",
      status: "pending_auth",
      expectedAccount: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
      expectedAuthorized: true,
      suggestedController: "治理多签理应在 auth 白名单内，便于紧急或治理介入返佣发放。",
      functions: ["distribute", "referFeeDistribute", "referFeeDistributeBatch"],
      note: "该条目检查指定地址是否已被加入 auth 白名单。",
      liveRead: {
        target: "0x4F0077104Ca290cC4D26E0877033b8330334081F",
        abi: ["function auth(address) view returns (bool)"],
        method: "auth",
        args: ["0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37"]
      }
    },
    {
      id: "preTrading-owner",
      contract: "PreTrading",
      address: "0x33dCFc0c163B7309422beD6d6BBf73DA946c0284",
      permissionType: "owner",
      status: "pending_transfer",
      expectedController: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
      suggestedController: "如按当前治理目标执行，应迁移到治理多签。",
      functions: ["withdrawMarketFee", "setDelay", "transferOwnership", "setOracle", "emergencyTransferERC20"],
      note: "owner 可以修改 oracle、提取市场费用，并在紧急情况下转移 ERC20 资产。",
      liveRead: {
        target: "0x33dCFc0c163B7309422beD6d6BBf73DA946c0284",
        abi: ["function owner() view returns (address)"],
        method: "owner"
      }
    },
    {
      id: "dynamicFee-owner",
      contract: "DynamicFeeManager",
      address: "0x236e856418ffF886efBA88ba6c79fd6543aaFD24",
      permissionType: "owner",
      status: "pending_transfer",
      expectedController: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
      suggestedController: "应迁移到治理多签，由治理统一管理费率重置能力。",
      functions: ["reset", "transferOwnership"],
      note: "owner 可以重置动态费参数和 tradeManager，直接影响交易费逻辑。",
      liveRead: {
        target: "0x236e856418ffF886efBA88ba6c79fd6543aaFD24",
        abi: ["function owner() view returns (address)"],
        method: "owner"
      }
    },
    {
      id: "usdb-owner",
      contract: "USDB",
      address: "0x89401d7C5F5Cf4936F10418B9C536f97b0bCf71B",
      permissionType: "owner",
      status: "pending_transfer",
      expectedController: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
      suggestedController: "应迁移到治理多签，避免部署地址继续持有 vault 切换能力。",
      functions: ["transferOwnership", "setVault"],
      note: "owner 不能直接 mint，但可以替换 vault；vault 拥有 mint、burn、distribute 权限。",
      liveRead: {
        target: "0x89401d7C5F5Cf4936F10418B9C536f97b0bCf71B",
        abi: ["function owner() view returns (address)"],
        method: "owner"
      }
    },
    {
      id: "proxyAdmin-owner",
      contract: "ProxyAdmin",
      address: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
      permissionType: "proxyAdmin",
      status: "pending_transfer",
      expectedController: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
      suggestedController: "应迁移到治理多签，统一接管所有可升级合约的升级权限。",
      functions: ["transferOwnership", "upgrade", "upgradeAndCall", "changeProxyAdmin"],
      note: "控制 tBLPProxy、sBLPProxy、tradeManagerProxy、feeAdapterProxy 的升级实现。",
      liveRead: {
        target: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
        abi: ["function owner() view returns (address)"],
        method: "owner"
      }
    },
    {
      id: "contractFactory-owner",
      contract: "ContractFactory",
      address: "0x179365245C424453C51F2f34b0AA2C51fC32EaCC",
      permissionType: "owner",
      status: "assigned",
      expectedController: "0x4b9E4e5543Ce2F93D23566303aAb91ee63CeEF1d",
      suggestedController: "应由代充值钱包持有。",
      functions: ["transferOwnership", "deploy"],
      note: "owner 可以部署新的 DepositContract 实例。",
      liveRead: {
        target: "0x179365245C424453C51F2f34b0AA2C51fC32EaCC",
        abi: ["function owner() view returns (address)"],
        method: "owner"
      }
    },
    {
      id: "buzzingFactory-owner",
      contract: "BuzzingSwapFactory",
      address: "0x1d470E77e9980Aa342646434c800f439ED3489c1",
      permissionType: "owner",
      status: "assigned",
      expectedController: "0xd1729ee9687408544e5e91c0220c5b2e69EfF2Ac",
      suggestedController: "应由俱乐部运营钱包持有。",
      functions: ["createPool", "setOwner", "enableFeeAmount", "setWhiteListAddress", "setFeeAmountExtraInfo", "setLmPoolDeployer", "setFeeProtocol", "collectProtocol", "setLmPool"],
      note: "owner 控制池创建、费率档位、白名单策略、协议费和 LM 关联。",
      liveRead: {
        target: "0x1d470E77e9980Aa342646434c800f439ED3489c1",
        abi: ["function owner() view returns (address)"],
        method: "owner"
      }
    },
    {
      id: "feeAdapter-owner",
      contract: "FeeAdapterTransparent (Proxy)",
      address: "0xE454a76dA1Ec485061488d8c272D2154bf1ddf4F",
      permissionType: "owner",
      status: "assigned",
      expectedController: "0xd1729ee9687408544e5e91c0220c5b2e69EfF2Ac",
      suggestedController: "应由俱乐部运营钱包持有。",
      functions: ["setVault", "transferOwnership", "setPoolTotalFeeRatio", "setPoolRole", "setPoolReferShare", "emergencyTransferERC20"],
      note: "业务 owner 已分配，但升级权限仍由 ProxyAdmin.owner 单独控制。",
      liveRead: {
        target: "0xE454a76dA1Ec485061488d8c272D2154bf1ddf4F",
        abi: ["function owner() view returns (address)"],
        method: "owner"
      }
    },
    {
      id: "preTrading-oracle",
      contract: "PreTrading",
      address: "0x33dCFc0c163B7309422beD6d6BBf73DA946c0284",
      permissionType: "oracle",
      status: "assigned",
      expectedController: "0xd1729ee9687408544e5e91c0220c5b2e69EfF2Ac",
      suggestedController: "若沿用历史运营口径，oracle 应由俱乐部运营钱包持有。",
      functions: ["resolveMarket", "unsetMarket"],
      note: "oracle 决定市场状态与结算结果。",
      liveRead: {
        target: "0x33dCFc0c163B7309422beD6d6BBf73DA946c0284",
        abi: ["function oracle() view returns (address)"],
        method: "oracle"
      }
    },
    {
      id: "tradeManager-auth",
      contract: "tradeManagerProxy",
      address: "0x4a8793AE855AE40A00504D61d2ac4074B5214669",
      permissionType: "auth",
      status: "pending_auth",
      expectedAccount: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
      expectedAuthorized: true,
      suggestedController: "治理多签理应在 TradeManager 的 wards 列表内。",
      functions: ["setFeeAdapter", "setFeeManager", "addLiquidity", "decreaseLiquidity", "setYieldProtocol", "USDCdeposit", "USDCwithdraw", "ERC20tranfser", "handleMarketPnl", "marketReport"],
      note: "该条目检查治理多签是否已获 TradeManager auth / wards 授权。",
      liveRead: {
        target: "0x4a8793AE855AE40A00504D61d2ac4074B5214669",
        abi: ["function wards(address) view returns (uint256)"],
        method: "wards",
        args: ["0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37"]
      }
    },
    {
      id: "tblp-auth",
      contract: "tBLPProxy",
      address: "0xaaF4C01F8f35e2563C2334802CcE13D09C9256f4",
      permissionType: "auth",
      status: "pending_auth",
      expectedAccount: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
      expectedAuthorized: true,
      suggestedController: "治理多签理应在 tBLP 的 wards 列表内。",
      functions: ["rely", "deny", "setPnlhandler", "setUSDB"],
      note: "该条目检查治理多签是否已获 tBLP auth / wards 授权。",
      liveRead: {
        target: "0xaaF4C01F8f35e2563C2334802CcE13D09C9256f4",
        abi: ["function wards(address) view returns (uint256)"],
        method: "wards",
        args: ["0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37"]
      }
    },
    {
      id: "sblp-auth",
      contract: "sBLPProxy",
      address: "0x2A149d1b7Cb2cFBd8AF7ea0c816ebaB85bd7Cc45",
      permissionType: "auth",
      status: "pending_auth",
      expectedAccount: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37",
      expectedAuthorized: true,
      suggestedController: "治理多签理应在 sBLP 的 wards 列表内。",
      functions: ["rely", "deny", "setPnlhandler", "setUSDB"],
      note: "该条目检查治理多签是否已获 sBLP auth / wards 授权。",
      liveRead: {
        target: "0x2A149d1b7Cb2cFBd8AF7ea0c816ebaB85bd7Cc45",
        abi: ["function wards(address) view returns (uint256)"],
        method: "wards",
        args: ["0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37"]
      }
    }
  ],
  proxies: [
    {
      id: "tblp-proxy",
      proxy: "tBLPProxy",
      proxyAddress: "0xaaF4C01F8f35e2563C2334802CcE13D09C9256f4",
      expectedProxyAdmin: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
      expectedAdminOwner: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37"
    },
    {
      id: "sblp-proxy",
      proxy: "sBLPProxy",
      proxyAddress: "0x2A149d1b7Cb2cFBd8AF7ea0c816ebaB85bd7Cc45",
      expectedProxyAdmin: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
      expectedAdminOwner: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37"
    },
    {
      id: "tradeManager-proxy",
      proxy: "tradeManagerProxy",
      proxyAddress: "0x4a8793AE855AE40A00504D61d2ac4074B5214669",
      expectedProxyAdmin: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
      expectedAdminOwner: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37"
    },
    {
      id: "feeAdapter-proxy",
      proxy: "feeAdapterProxy",
      proxyAddress: "0xE454a76dA1Ec485061488d8c272D2154bf1ddf4F",
      expectedProxyAdmin: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
      expectedAdminOwner: "0x858B6F06a156B65eeb2b6E933c51F04f15fE0D37"
    }
  ]
};
