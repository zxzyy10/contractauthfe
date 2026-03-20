window.DASHBOARD_DATA = {
  network: "Base Mainnet",
  chainId: 8453,
  generatedAt: "2026-03-20",
  deployer: "0x54fa4358330136332430e779BeaAD0CbA1404eAf",
  rpcUrls: [
    "https://mainnet.base.org",
    "https://base-rpc.publicnode.com",
    "https://base.llamarpc.com"
  ],
  heroMeta: [
    "4 pending owner handovers",
    "1 pending ProxyAdmin handover",
    "4 proxies under upgrade control",
    "Source of truth: D:\\buzzing"
  ],
  summary: [
    { label: "Pending owners", value: 4, sub: "FeeRebateDistributor, PreTrading, DynamicFeeManager, USDB" },
    { label: "Pending ProxyAdmin", value: 1, sub: "Upgrade control still sits on the deployer EOA" },
    { label: "Assigned owners", value: 3, sub: "ContractFactory, BuzzingSwapFactory, FeeAdapterTransparent" },
    { label: "Tracked functions", value: 22, sub: "owner, oracle, auth, vault, ProxyAdmin" }
  ],
  wallets: [
    {
      name: "Deployer EOA",
      address: "0x54fa4358330136332430e779BeaAD0CbA1404eAf",
      description: "Current baseline address that still holds multiple owner roles and ProxyAdmin.owner."
    },
    {
      name: "Club Ops Wallet",
      address: "0xd1729ee9687408544e5e91c0220c5b2e69EfF2Ac",
      description: "Used for club automation, phase operations, market creation, and fee governance."
    },
    {
      name: "Top-up Wallet",
      address: "0x4b9E4e5543Ce2F93D23566303aAb91ee63CeEF1d",
      description: "Used for deposit factory operations and top-up business flow."
    },
    {
      name: "Governance Multisig",
      address: "TBD",
      description: "Recommended destination for ProxyAdmin.owner."
    }
  ],
  permissions: [
    {
      id: "feeRebate-owner",
      contract: "FeeRebateDistributor",
      address: "0x4F0077104Ca290cC4D26E0877033b8330334081F",
      permissionType: "owner",
      status: "pending",
      documentedController: "0x54fa4358330136332430e779BeaAD0CbA1404eAf",
      suggestedController: "Transfer by ops split. If daily rebate distribution is run by ops, club ops wallet is a candidate.",
      risk: "medium",
      functions: ["transferOwnership", "setFeeAdapter", "setAuth", "revokeAuth"],
      note: "owner controls feeAdapter and auth allowlist. auth can execute distribute and referral rebate transfers.",
      liveRead: { kind: "call", target: "0x4F0077104Ca290cC4D26E0877033b8330334081F", abi: ["function owner() view returns (address)"], method: "owner" }
    },
    {
      id: "preTrading-owner",
      contract: "PreTrading",
      address: "0x33dCFc0c163B7309422beD6d6BBf73DA946c0284",
      permissionType: "owner",
      status: "pending",
      documentedController: "0x54fa4358330136332430e779BeaAD0CbA1404eAf",
      suggestedController: "Needs final decision. Historical notes suggested keeping owner and only moving oracle.",
      risk: "high",
      functions: ["withdrawMarketFee", "setDelay", "transferOwnership", "setOracle", "emergencyTransferERC20"],
      note: "owner can redirect oracle, withdraw market fees, and move ERC20 funds in emergency.",
      liveRead: { kind: "call", target: "0x33dCFc0c163B7309422beD6d6BBf73DA946c0284", abi: ["function owner() view returns (address)"], method: "owner" }
    },
    {
      id: "dynamicFee-owner",
      contract: "DynamicFeeManager",
      address: "0x236e856418ffF886efBA88ba6c79fd6543aaFD24",
      permissionType: "owner",
      status: "pending",
      documentedController: "0x54fa4358330136332430e779BeaAD0CbA1404eAf",
      suggestedController: "Move to fee governance wallet or multisig.",
      risk: "high",
      functions: ["reset", "transferOwnership"],
      note: "owner can replace dynamic fee parameters and tradeManager. This changes trading fee behavior directly.",
      liveRead: { kind: "call", target: "0x236e856418ffF886efBA88ba6c79fd6543aaFD24", abi: ["function owner() view returns (address)"], method: "owner" }
    },
    {
      id: "usdb-owner",
      contract: "USDB",
      address: "0x89401d7C5F5Cf4936F10418B9C536f97b0bCf71B",
      permissionType: "owner",
      status: "pending",
      documentedController: "0x54fa4358330136332430e779BeaAD0CbA1404eAf",
      suggestedController: "Move to treasury governance address or multisig.",
      risk: "high",
      functions: ["transferOwnership", "setVault"],
      note: "owner cannot mint directly, but can replace vault. vault can mint, burn, and distribute.",
      liveRead: { kind: "call", target: "0x89401d7C5F5Cf4936F10418B9C536f97b0bCf71B", abi: ["function owner() view returns (address)"], method: "owner" }
    },
    {
      id: "proxyAdmin-owner",
      contract: "ProxyAdmin",
      address: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
      permissionType: "proxyAdmin",
      status: "pending",
      documentedController: "0x54fa4358330136332430e779BeaAD0CbA1404eAf",
      suggestedController: "Move to governance multisig.",
      risk: "high",
      functions: ["transferOwnership", "upgrade", "upgradeAndCall", "changeProxyAdmin"],
      note: "Controls implementation upgrades for tBLPProxy, sBLPProxy, tradeManagerProxy, and feeAdapterProxy.",
      liveRead: { kind: "call", target: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a", abi: ["function owner() view returns (address)"], method: "owner" }
    },
    {
      id: "contractFactory-owner",
      contract: "ContractFactory",
      address: "0x179365245C424453C51F2f34b0AA2C51fC32EaCC",
      permissionType: "owner",
      status: "assigned",
      documentedController: "0x4b9E4e5543Ce2F93D23566303aAb91ee63CeEF1d",
      suggestedController: "Already assigned to top-up wallet.",
      risk: "medium",
      functions: ["transferOwnership", "deploy"],
      note: "owner can deploy new DepositContract instances.",
      liveRead: { kind: "call", target: "0x179365245C424453C51F2f34b0AA2C51fC32EaCC", abi: ["function owner() view returns (address)"], method: "owner" }
    },
    {
      id: "buzzingFactory-owner",
      contract: "BuzzingSwapFactory",
      address: "0x1d470E77e9980Aa342646434c800f439ED3489c1",
      permissionType: "owner",
      status: "assigned",
      documentedController: "0xd1729ee9687408544e5e91c0220c5b2e69EfF2Ac",
      suggestedController: "Already assigned to club ops wallet.",
      risk: "high",
      functions: ["createPool", "setOwner", "enableFeeAmount", "setWhiteListAddress", "setFeeAmountExtraInfo", "setLmPoolDeployer", "setFeeProtocol", "collectProtocol", "setLmPool"],
      note: "owner controls pool creation, fee tiers, whitelist policy, protocol fees, and LM linkage.",
      liveRead: { kind: "call", target: "0x1d470E77e9980Aa342646434c800f439ED3489c1", abi: ["function owner() view returns (address)"], method: "owner" }
    },
    {
      id: "feeAdapter-owner",
      contract: "FeeAdapterTransparent (Proxy)",
      address: "0xE454a76dA1Ec485061488d8c272D2154bf1ddf4F",
      permissionType: "owner",
      status: "assigned",
      documentedController: "0xd1729ee9687408544e5e91c0220c5b2e69EfF2Ac",
      suggestedController: "Already assigned to club ops wallet.",
      risk: "high",
      functions: ["setVault", "transferOwnership", "setPoolTotalFeeRatio", "setPoolRole", "setPoolReferShare", "emergencyTransferERC20"],
      note: "Business owner is already assigned, but upgrade control still sits in ProxyAdmin.owner.",
      liveRead: { kind: "call", target: "0xE454a76dA1Ec485061488d8c272D2154bf1ddf4F", abi: ["function owner() view returns (address)"], method: "owner" }
    },
    {
      id: "preTrading-oracle",
      contract: "PreTrading",
      address: "0x33dCFc0c163B7309422beD6d6BBf73DA946c0284",
      permissionType: "oracle",
      status: "assigned",
      documentedController: "Unknown in current inventory",
      suggestedController: "If following historical ops notes, this should move to the club ops wallet.",
      risk: "high",
      functions: ["resolveMarket", "unsetMarket"],
      note: "oracle decides market state and resolution. This is higher risk than a normal config permission.",
      liveRead: { kind: "call", target: "0x33dCFc0c163B7309422beD6d6BBf73DA946c0284", abi: ["function oracle() view returns (address)"], method: "oracle" }
    }
  ],
  proxies: [
    {
      id: "tblp-proxy",
      proxy: "tBLPProxy",
      proxyAddress: "0xaaF4C01F8f35e2563C2334802CcE13D09C9256f4",
      documentedImplementation: "0x8AfCeA3a5CB72A27Af5759210525fe7CAE96c99A",
      documentedProxyAdmin: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
      documentedAdminOwner: "0x54fa4358330136332430e779BeaAD0CbA1404eAf"
    },
    {
      id: "sblp-proxy",
      proxy: "sBLPProxy",
      proxyAddress: "0x2A149d1b7Cb2cFBd8AF7ea0c816ebaB85bd7Cc45",
      documentedImplementation: "0xEd0aBDdF425c742C97fb8CaF83d2056d8C19A1FA",
      documentedProxyAdmin: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
      documentedAdminOwner: "0x54fa4358330136332430e779BeaAD0CbA1404eAf"
    },
    {
      id: "tradeManager-proxy",
      proxy: "tradeManagerProxy",
      proxyAddress: "0x4a8793AE855AE40A00504D61d2ac4074B5214669",
      documentedImplementation: "0xaE7195bFe99Acd1838C9a26E55e5f68DCAb23d39",
      documentedProxyAdmin: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
      documentedAdminOwner: "0x54fa4358330136332430e779BeaAD0CbA1404eAf"
    },
    {
      id: "feeAdapter-proxy",
      proxy: "feeAdapterProxy",
      proxyAddress: "0xE454a76dA1Ec485061488d8c272D2154bf1ddf4F",
      documentedImplementation: "0x7a252f809C12c8566ea67aa03308C4C3c94Bd537",
      documentedProxyAdmin: "0x31275dFd50d1fd1802da26c4D7BE594046E6e41a",
      documentedAdminOwner: "0x54fa4358330136332430e779BeaAD0CbA1404eAf"
    }
  ],
  functionMatrix: [
    { contract: "FeeRebateDistributor", permissionType: "owner", functions: "transferOwnership, setFeeAdapter, setAuth, revokeAuth", purpose: "Manage owner handover, adapter address, and execution allowlist.", source: "projects/v3-periphery/contracts/FeeRebateDistributor.sol" },
    { contract: "FeeRebateDistributor", permissionType: "auth", functions: "distribute, referFeeDistribute, referFeeDistributeBatch", purpose: "Execute rebate and referral payouts.", source: "projects/v3-periphery/contracts/FeeRebateDistributor.sol" },
    { contract: "PreTrading", permissionType: "owner", functions: "withdrawMarketFee, setDelay, transferOwnership, setOracle, emergencyTransferERC20", purpose: "Control fees, delay, oracle routing, and emergency rescue.", source: "projects/v3-periphery/contracts/PreTrading.sol" },
    { contract: "PreTrading", permissionType: "oracle", functions: "resolveMarket, unsetMarket", purpose: "Change market result and market state.", source: "projects/v3-periphery/contracts/PreTrading.sol" },
    { contract: "DynamicFeeManager", permissionType: "owner", functions: "reset, transferOwnership", purpose: "Reset fee parameters and tradeManager.", source: "projects/v3-periphery/contracts/DynamicFeeManager.sol" },
    { contract: "USDB", permissionType: "owner", functions: "transferOwnership, setVault", purpose: "Change governance owner and minting vault address.", source: "projects/v3-periphery/contracts/USDB.sol" },
    { contract: "USDB", permissionType: "vault", functions: "distribute, mint, burn", purpose: "Mint, burn, and distribute USDB.", source: "projects/v3-periphery/contracts/USDB.sol" },
    { contract: "ContractFactory", permissionType: "owner", functions: "transferOwnership, deploy", purpose: "Own factory governance and deploy deposit contracts.", source: "projects/v3-periphery/contracts/contractFactory.sol" },
    { contract: "BuzzingSwapFactory", permissionType: "owner", functions: "createPool, setOwner, enableFeeAmount, setWhiteListAddress, setFeeAmountExtraInfo, setLmPoolDeployer, setFeeProtocol, collectProtocol", purpose: "Manage pools, fee tiers, whitelist policy, and protocol fees.", source: "projects/v3-core/contracts/BuzzingSwapFactory.sol" },
    { contract: "BuzzingSwapFactory", permissionType: "ownerOrLmPoolDeployer", functions: "setLmPool", purpose: "Link LM pool to a trading pool.", source: "projects/v3-core/contracts/BuzzingSwapFactory.sol" },
    { contract: "FeeAdapterTransparent", permissionType: "owner", functions: "setVault, transferOwnership, setPoolTotalFeeRatio, setPoolRole, setPoolReferShare, emergencyTransferERC20", purpose: "Configure fee split, role recipients, and vault.", source: "projects/v3-periphery/contracts/FeeAdapterTransparent.sol" },
    { contract: "FeeAdapterTransparent", permissionType: "vault", functions: "recordFee", purpose: "Record and allocate fees to pending balances.", source: "projects/v3-periphery/contracts/FeeAdapterTransparent.sol" },
    { contract: "ProxyAdmin", permissionType: "owner", functions: "transferOwnership, upgrade, upgradeAndCall, changeProxyAdmin", purpose: "Own transparent proxy upgrades and admin changes.", source: "OpenZeppelin transparent proxy model used by deploy script" }
  ],
  executionPlan: [
    "Move ProxyAdmin.owner to a governance multisig first to remove upgrade control from the deployer EOA.",
    "Move the four pending owner roles next: FeeRebateDistributor, PreTrading, DynamicFeeManager, and USDB.",
    "Grant execution permissions needed for day-to-day ops, such as FeeRebateDistributor.setAuth for payout operators.",
    "Resolve the final PreTrading strategy before execution. Current inventory and historical notes do not fully match.",
    "After every step, read owner(), oracle(), implementation, and ProxyAdmin.owner() back from chain before continuing."
  ],
  auditChecklist: [
    "FeeRebateDistributor.owner() matches the intended target and auth allowlist is correct.",
    "PreTrading.owner() or oracle() matches the final governance decision.",
    "DynamicFeeManager.owner() matches the intended target and core fee parameters were not changed accidentally.",
    "USDB.owner() and USDB.vault() match treasury expectations.",
    "ProxyAdmin.owner() has moved to multisig and proxy implementations remain unchanged unless planned."
  ],
  notes: [
    { title: "PreTrading governance mismatch", body: "The current Base inventory marks PreTrading.owner as pending handover, but historical notes in the repo suggested only moving oracle. Final execution needs one agreed strategy." },
    { title: "Owner and upgrade control are separate", body: "FeeAdapterTransparent already has a business owner, but the proxy implementation can still be upgraded by ProxyAdmin.owner. Those are separate control planes." },
    { title: "USDB remains high risk", body: "USDB.owner cannot mint directly, but can replace vault. Since vault can mint and burn, owner still has governance leverage over issuance." },
    { title: "Live mode is read-only", body: "The dashboard reads live chain data only. It does not send transactions. It is intended for inventory, review, and verification." }
  ]
};
