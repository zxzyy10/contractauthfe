(function () {
  const data = window.DASHBOARD_DATA;
  const ethersLib = window.ethers;
  const state = {
    search: "",
    type: "all",
    status: "all",
    provider: null,
    providerUrl: null,
    livePermissionReads: {},
    liveStats: { permissionReads: 0, errors: 0, loading: 0 }
  };

  const heroMeta = document.getElementById("heroMeta");
  const summaryGrid = document.getElementById("summaryGrid");
  const walletGrid = document.getElementById("walletGrid");
  const liveSummaryGrid = document.getElementById("liveSummaryGrid");
  const permissionsTableBody = document.getElementById("permissionsTableBody");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const statusFilter = document.getElementById("statusFilter");
  const rpcStatus = document.getElementById("rpcStatus");
  const refreshLiveBtn = document.getElementById("refreshLiveBtn");

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function explorerLink(address) {
    if (!address || address === "TBD") return null;
    return "https://basescan.org/address/" + address;
  }

  function normalizedAddress(value) {
    if (!value || typeof value !== "string" || !ethersLib) return null;
    try {
      return ethersLib.utils.getAddress(value);
    } catch (error) {
      return null;
    }
  }

  function permissionTagClass(type) {
    const map = {
      owner: "tag-owner",
      oracle: "tag-oracle",
      auth: "tag-auth",
      proxyAdmin: "tag-proxyadmin",
      vault: "tag-owner",
      ownerOrLmPoolDeployer: "tag-owner"
    };
    return map[type] || "tag-owner";
  }

  function isAddressMatch(left, right) {
    const normalizedLeft = normalizedAddress(left);
    const normalizedRight = normalizedAddress(right);
    return !!normalizedLeft && !!normalizedRight && normalizedLeft === normalizedRight;
  }

  function statusMeta(status) {
    if (status === "pending_transfer") {
      return {
        label: "待迁移",
        className: "status-pending",
        desc: "该权限当前仍在旧地址上，尚未迁移到目标治理地址。"
      };
    }
    if (status === "pending_auth") {
      return {
        label: "待补齐",
        className: "status-pending",
        desc: "该权限主体已明确，但目标地址尚未补入 auth / wards 授权名单。"
      };
    }
    return {
      label: "已分配",
      className: "status-done",
      desc: "该权限当前已分配到预期地址，状态符合治理预期。"
    };
  }

  function renderHero() {
    heroMeta.innerHTML = data.heroMeta.map((item) => '<span class="chip">' + escapeHtml(item) + "</span>").join("");
  }

  function renderSummary() {
    summaryGrid.innerHTML = data.summary.map((item) => [
      '<article class="summary-card">',
      '<div class="summary-label">' + escapeHtml(item.label) + "</div>",
      '<div class="summary-value">' + escapeHtml(item.value) + "</div>",
      '<div class="summary-sub">' + escapeHtml(item.sub) + "</div>",
      "</article>"
    ].join("")).join("");
  }

  function renderWallets() {
    walletGrid.innerHTML = data.wallets.map((wallet) => {
      const link = explorerLink(wallet.address);
      const addressHtml = link
        ? '<a class="mono-link" href="' + link + '" target="_blank" rel="noreferrer">' + escapeHtml(wallet.address) + "</a>"
        : "<code>" + escapeHtml(wallet.address) + "</code>";

      return [
        '<article class="wallet-card">',
        "<h3>" + escapeHtml(wallet.name) + "</h3>",
        "<p>" + escapeHtml(wallet.description) + "</p>",
        '<div class="address-line">',
        addressHtml,
        wallet.address && wallet.address !== "TBD" ? '<button class="copy-btn" data-copy="' + escapeHtml(wallet.address) + '">复制</button>' : "",
        "</div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function renderLiveSummary() {
    const authReads = Object.values(state.livePermissionReads).filter((item) => item && item.status === "ok" && item.kind === "auth").length;
    const cards = [
      { label: "已读取权限", value: state.liveStats.permissionReads, sub: "成功读取的 owner / oracle / auth 实时状态" },
      { label: "已读取 auth", value: authReads, sub: "成功读取的 auth / wards 授权状态" },
      { label: "读取中", value: state.liveStats.loading, sub: "仍在等待 RPC 返回的条目" },
      { label: "读取错误", value: state.liveStats.errors, sub: "RPC 或合约读取失败的条目" }
    ];

    liveSummaryGrid.innerHTML = cards.map((item) => [
      '<article class="summary-card">',
      '<div class="summary-label">' + escapeHtml(item.label) + "</div>",
      '<div class="summary-value">' + escapeHtml(item.value) + "</div>",
      '<div class="summary-sub">' + escapeHtml(item.sub) + "</div>",
      "</article>"
    ].join("")).join("");
  }

  function populateTypeFilter() {
    const types = [...new Set(data.permissions.map((item) => item.permissionType))];
    typeFilter.innerHTML = '<option value="all">全部权限类型</option>' +
      types.map((type) => '<option value="' + escapeHtml(type) + '">' + escapeHtml(type) + "</option>").join("");
  }

  function filteredPermissions() {
    return data.permissions.filter((item) => {
      const haystack = [
        item.contract,
        item.address,
        item.suggestedController,
        item.expectedController,
        item.expectedAccount,
        item.permissionType,
        item.functions.join(" "),
        item.note
      ].join(" ").toLowerCase();

      return (!state.search || haystack.includes(state.search)) &&
        (state.type === "all" || item.permissionType === state.type) &&
        (state.status === "all" || item.status === state.status);
    });
  }

  function formatReadValue(item, rawValue) {
    if (item.permissionType === "auth") {
      const compareValue = typeof rawValue === "boolean"
        ? rawValue
        : Number(rawValue && rawValue.toString ? rawValue.toString() : rawValue) > 0;

      return {
        kind: "auth",
        compareValue,
        displayHtml:
          '<div class="auth-live-result ' + (compareValue ? "auth-live-in" : "auth-live-out") + '">' +
          escapeHtml(compareValue ? "in auth" : "not in auth") +
          "</div>"
      };
    }

    const value = typeof rawValue === "string" ? rawValue : rawValue.toString();
    return {
      kind: "address",
      compareValue: value,
      displayHtml:
        "<div><code>" + escapeHtml(value) + "</code></div>" +
        '<div class="subtle">' + escapeHtml(item.permissionType === "oracle" ? "当前 oracle 地址" : "当前权限持有地址") + "</div>"
    };
  }

  function liveStateHtml(item, read) {
    if (!read) return '<span class="live-pill live-loading">未读取</span>';
    if (read.status === "loading") return '<span class="live-pill live-loading">读取中</span>';
    if (read.status === "error") {
      return '<span class="live-pill live-error">读取失败</span><div class="subtle">' + escapeHtml(read.detail || "链上读取失败") + "</div>";
    }
    return '<span class="live-pill live-ok">当前链上值</span>' + read.displayHtml;
  }

  function expectedStateHtml(item, read) {
    if (item.permissionType === "auth") {
      const account = item.expectedAccount;

      if (!read || read.status === "loading") {
        return [
          '<div class="expected-block">',
          '<div class="subtle">期望 auth 地址</div>',
          "<div><code>" + escapeHtml(account) + "</code></div>",
          '<div class="expected-state expected-pending">等待链上返回授权状态</div>',
          "</div>"
        ].join("");
      }

      if (read.status === "error") {
        return [
          '<div class="expected-block">',
          '<div class="subtle">期望 auth 地址</div>',
          "<div><code>" + escapeHtml(account) + "</code></div>",
          '<div class="expected-state expected-pending">读取失败，暂未确认是否在 auth 权限中</div>',
          "</div>"
        ].join("");
      }

      return [
        '<div class="expected-block">',
        '<div class="subtle">期望 auth 地址</div>',
        "<div><code>" + escapeHtml(account) + "</code></div>",
        '<div class="expected-state ' + (read.compareValue ? "expected-match" : "expected-pending") + '">' + escapeHtml(read.compareValue ? "已在 auth 权限中" : "不在 auth 权限中") + "</div>",
        "</div>"
      ].join("");
    }

    if (!item.expectedController) {
      return '<div class="subtle">未配置期望地址</div>';
    }

    if (!read || read.status === "loading") {
      return [
        '<div class="expected-block">',
        '<div class="subtle">期望地址</div>',
        "<div><code>" + escapeHtml(item.expectedController) + "</code></div>",
        '<div class="expected-state expected-pending">等待链上返回后比对</div>',
        "</div>"
      ].join("");
    }

    if (read.status === "error") {
      return [
        '<div class="expected-block">',
        '<div class="subtle">期望地址</div>',
        "<div><code>" + escapeHtml(item.expectedController) + "</code></div>",
        '<div class="expected-state expected-pending">读取失败，暂不比对</div>',
        "</div>"
      ].join("");
    }

    const matched = isAddressMatch(item.expectedController, read.compareValue);
    return [
      '<div class="expected-block">',
      '<div class="subtle">期望地址</div>',
      "<div><code>" + escapeHtml(item.expectedController) + "</code></div>",
      '<div class="expected-state ' + (matched ? "expected-match" : "expected-mismatch") + '">' + escapeHtml(matched ? "与期望一致" : "与期望不一致") + "</div>",
      "</div>"
    ].join("");
  }

  function functionTagsHtml(functions) {
    return functions.map((fn) => {
      const desc = data.functionDescriptions[fn] || "暂无说明";
      return '<span class="fn-chip" tabindex="0" title="' + escapeHtml(desc) + '">' + escapeHtml(fn) + "</span>";
    }).join("");
  }

  function statusBadgeHtml(status) {
    const meta = statusMeta(status);
    return '<span class="status-badge ' + meta.className + '" title="' + escapeHtml(meta.desc) + '">' + escapeHtml(meta.label) + "</span>";
  }

  function renderPermissions() {
    const items = filteredPermissions();
    permissionsTableBody.innerHTML = items.map((item) => {
      const contractLink = explorerLink(item.address);
      const liveRead = state.livePermissionReads[item.id];

      return [
        "<tr>",
        "<td>",
        '<div class="contract-name">' + escapeHtml(item.contract) + "</div>",
        '<div class="subtle"><span class="tag ' + permissionTagClass(item.permissionType) + '">' + escapeHtml(item.permissionType) + '</span></div>',
        contractLink
          ? '<div><a class="mono-link" href="' + contractLink + '" target="_blank" rel="noreferrer">' + escapeHtml(item.address) + "</a></div>"
          : "<div><code>" + escapeHtml(item.address) + "</code></div>",
        '<div class="status-line">状态: ' + statusBadgeHtml(item.status) + "</div>",
        "</td>",
        "<td>" + liveStateHtml(item, liveRead) + expectedStateHtml(item, liveRead) + "</td>",
        "<td><div>" + escapeHtml(item.suggestedController) + '</div><div class="subtle">' + escapeHtml(item.note) + "</div></td>",
        '<td><div class="fn-chip-scroll"><div class="fn-chip-list">' + functionTagsHtml(item.functions) + "</div></div></td>",
        "</tr>"
      ].join("");
    }).join("");

    if (!items.length) {
      permissionsTableBody.innerHTML = '<tr><td colspan="4"><div class="empty-state">没有符合当前筛选条件的权限项。</div></td></tr>';
    }
  }

  function refreshLiveStats() {
    const stats = { permissionReads: 0, errors: 0, loading: 0 };

    Object.values(state.livePermissionReads).forEach((item) => {
      if (!item) return;
      if (item.status === "ok") stats.permissionReads += 1;
      else if (item.status === "loading") stats.loading += 1;
      else if (item.status === "error") stats.errors += 1;
    });

    state.liveStats = stats;
    renderLiveSummary();
  }

  function setRpcMessage(message, tone) {
    rpcStatus.className = "rpc-status " + (tone || "");
    rpcStatus.textContent = message;
  }

  async function connectProvider() {
    if (!ethersLib) {
      throw new Error("ethers CDN 加载失败，请检查外部脚本访问。");
    }

    for (const url of data.rpcUrls) {
      try {
        const provider = new ethersLib.providers.JsonRpcProvider(url, data.chainId);
        await provider.getBlockNumber();
        state.provider = provider;
        state.providerUrl = url;
        setRpcMessage("已连接 RPC: " + url, "rpc-ok");
        return provider;
      } catch (error) {
        continue;
      }
    }

    throw new Error("无法连接到可用的 Base RPC。");
  }

  async function loadPermissionReads() {
    const provider = state.provider || await connectProvider();

    await Promise.all(data.permissions.map(async (item) => {
      state.livePermissionReads[item.id] = { status: "loading" };
      refreshLiveStats();
      renderPermissions();
      try {
        const contract = new ethersLib.Contract(item.liveRead.target, item.liveRead.abi, provider);
        const args = item.liveRead.args || [];
        const rawValue = await contract[item.liveRead.method](...args);
        const formatted = formatReadValue(item, rawValue);
        state.livePermissionReads[item.id] = {
          status: "ok",
          kind: formatted.kind,
          compareValue: formatted.compareValue,
          displayHtml: formatted.displayHtml
        };
      } catch (error) {
        state.livePermissionReads[item.id] = {
          status: "error",
          detail: error.message || "读取失败"
        };
      }
      refreshLiveStats();
      renderPermissions();
    }));
  }

  async function refreshOnchainState() {
    refreshLiveBtn.disabled = true;
    setRpcMessage("正在连接 Base RPC...", "rpc-loading");
    try {
      await connectProvider();
      await loadPermissionReads();
      refreshLiveStats();
      renderPermissions();
      setRpcMessage("链上数据已刷新，来源: " + state.providerUrl, "rpc-ok");
    } catch (error) {
      setRpcMessage(error.message || "RPC 刷新失败", "rpc-error");
    } finally {
      refreshLiveBtn.disabled = false;
    }
  }

  function bindEvents() {
    searchInput.addEventListener("input", function (event) {
      state.search = event.target.value.trim().toLowerCase();
      renderPermissions();
    });

    typeFilter.addEventListener("change", function (event) {
      state.type = event.target.value;
      renderPermissions();
    });

    statusFilter.addEventListener("change", function (event) {
      state.status = event.target.value;
      renderPermissions();
    });

    refreshLiveBtn.addEventListener("click", refreshOnchainState);

    document.addEventListener("click", function (event) {
      const button = event.target.closest("[data-copy]");
      if (!button) return;
      const text = button.getAttribute("data-copy");
      const success = function () {
        const previous = button.textContent;
        button.textContent = "已复制";
        setTimeout(function () {
          button.textContent = previous;
        }, 1200);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(success);
        return;
      }

      const input = document.createElement("textarea");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      success();
    });
  }

  renderHero();
  renderSummary();
  renderWallets();
  renderLiveSummary();
  populateTypeFilter();
  renderPermissions();
  bindEvents();
  refreshOnchainState();
})();
