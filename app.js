(function () {
  const data = window.DASHBOARD_DATA;
  const ethers = window.ethers;
  const state = {
    search: "",
    type: "all",
    status: "all",
    provider: null,
    providerUrl: null,
    livePermissionReads: {},
    liveProxyReads: {},
    liveStats: { ok: 0, mismatch: 0, unknown: 0, errors: 0 }
  };

  const IMPLEMENTATION_SLOT = "0x360894A13BA1A3210667C828492DB98DCA3E2076CC3735A920A3CA505D382BBC";
  const ADMIN_SLOT = "0xB53127684A568B3173AE13B9F8A6016E243E63B6E8EE1178D6A717850B5D6103";

  const heroMeta = document.getElementById("heroMeta");
  const summaryGrid = document.getElementById("summaryGrid");
  const walletGrid = document.getElementById("walletGrid");
  const liveSummaryGrid = document.getElementById("liveSummaryGrid");
  const permissionsTableBody = document.getElementById("permissionsTableBody");
  const functionTableBody = document.getElementById("functionTableBody");
  const proxyTableBody = document.getElementById("proxyTableBody");
  const executionList = document.getElementById("executionList");
  const auditList = document.getElementById("auditList");
  const notesGrid = document.getElementById("notesGrid");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const statusFilter = document.getElementById("statusFilter");
  const rpcStatus = document.getElementById("rpcStatus");
  const refreshLiveBtn = document.getElementById("refreshLiveBtn");

  function explorerLink(address) {
    if (!address || address === "TBD" || address === "Unknown in current inventory") return null;
    return "https://basescan.org/address/" + address;
  }

  function shortAddress(address) {
    if (!address || address.length < 10) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function permissionTagClass(type) {
    const map = {
      owner: "tag-owner",
      oracle: "tag-oracle",
      auth: "tag-auth",
      proxyAdmin: "tag-proxyadmin",
      vault: "tag-owner",
      ownerOrLmPoolDeployer: "tag-owner",
      proxy: "tag-proxyadmin"
    };
    return map[type] || "tag-owner";
  }

  function riskClass(risk) {
    return "risk-" + risk;
  }

  function statusClass(kind) {
    const map = {
      ok: "live-ok",
      mismatch: "live-mismatch",
      unknown: "live-unknown",
      error: "live-error",
      loading: "live-loading"
    };
    return map[kind] || "live-unknown";
  }

  function normalizedAddress(value) {
    if (!value || typeof value !== "string") return null;
    try {
      return ethers.utils.getAddress(value);
    } catch (error) {
      return null;
    }
  }

  function addressFromStorage(raw) {
    if (!raw || raw === "0x") return null;
    const body = raw.slice(2).padStart(64, "0");
    const hex = "0x" + body.slice(24);
    return normalizedAddress(hex);
  }

  function compareAddress(documented, live) {
    const doc = normalizedAddress(documented);
    const actual = normalizedAddress(live);
    if (!doc || !actual) return "unknown";
    return doc === actual ? "ok" : "mismatch";
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
        : '<code>' + escapeHtml(wallet.address) + "</code>";

      return [
        '<article class="wallet-card">',
        "<h3>" + escapeHtml(wallet.name) + "</h3>",
        "<p>" + escapeHtml(wallet.description) + "</p>",
        '<div class="address-line">',
        addressHtml,
        wallet.address && wallet.address !== "TBD"
          ? '<button class="copy-btn" data-copy="' + escapeHtml(wallet.address) + '">Copy</button>'
          : "",
        "</div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function renderLiveSummary() {
    const cards = [
      { label: "Matched", value: state.liveStats.ok, sub: "Documented value matches live read" },
      { label: "Mismatched", value: state.liveStats.mismatch, sub: "Documented value differs from live chain state" },
      { label: "Unknown", value: state.liveStats.unknown, sub: "No clean comparison possible yet" },
      { label: "Errors", value: state.liveStats.errors, sub: "RPC or contract read failed" }
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
    typeFilter.innerHTML = '<option value="all">All permission types</option>' +
      types.map((type) => '<option value="' + escapeHtml(type) + '">' + escapeHtml(type) + "</option>").join("");
  }

  function filteredPermissions() {
    return data.permissions.filter((item) => {
      const haystack = [
        item.contract,
        item.address,
        item.documentedController,
        item.suggestedController,
        item.permissionType,
        item.functions.join(" "),
        item.note
      ].join(" ").toLowerCase();
      return (!state.search || haystack.includes(state.search)) &&
        (state.type === "all" || item.permissionType === state.type) &&
        (state.status === "all" || item.status === state.status);
    });
  }

  function liveStateHtml(read) {
    if (!read) return '<span class="live-pill live-loading">Not loaded</span>';
    const label = read.status === "ok" ? "Match" :
      read.status === "mismatch" ? "Mismatch" :
      read.status === "error" ? "Error" :
      read.status === "loading" ? "Loading" : "Unknown";
    const value = read.value ? '<div><code>' + escapeHtml(read.value) + "</code></div>" : "";
    const detail = read.detail ? '<div class="subtle">' + escapeHtml(read.detail) + "</div>" : "";
    return '<span class="live-pill ' + statusClass(read.status) + '">' + label + "</span>" + value + detail;
  }

  function renderPermissions() {
    permissionsTableBody.innerHTML = filteredPermissions().map((item) => {
      const contractLink = explorerLink(item.address);
      const currentLink = explorerLink(item.documentedController);
      const functionTags = item.functions.map((fn) => '<span class="tag">' + escapeHtml(fn) + "</span>").join("");
      const liveRead = state.livePermissionReads[item.id];

      return [
        "<tr>",
        "<td>",
        '<div class="contract-name">' + escapeHtml(item.contract) + "</div>",
        '<div class="subtle"><span class="tag ' + permissionTagClass(item.permissionType) + '">' + escapeHtml(item.permissionType) + "</span></div>",
        contractLink
          ? '<div><a class="mono-link" href="' + contractLink + '" target="_blank" rel="noreferrer">' + escapeHtml(item.address) + "</a></div>"
          : "<div><code>" + escapeHtml(item.address) + "</code></div>",
        '<div class="subtle">Status: ' + escapeHtml(item.status === "pending" ? "Pending handover" : "Assigned") + "</div>",
        "</td>",
        "<td>",
        currentLink
          ? '<a class="mono-link" href="' + currentLink + '" target="_blank" rel="noreferrer">' + escapeHtml(item.documentedController) + "</a>"
          : "<code>" + escapeHtml(item.documentedController) + "</code>",
        '<div class="subtle">' + escapeHtml(shortAddress(item.documentedController)) + "</div>",
        "</td>",
        "<td>" + liveStateHtml(liveRead) + "</td>",
        "<td>",
        "<div>" + escapeHtml(item.suggestedController) + "</div>",
        '<div class="subtle">' + escapeHtml(item.note) + "</div>",
        "</td>",
        "<td>" + functionTags + "</td>",
        '<td><strong class="' + riskClass(item.risk) + '">' + escapeHtml(item.risk.toUpperCase()) + "</strong></td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function renderFunctions() {
    functionTableBody.innerHTML = data.functionMatrix.map((item) => [
      "<tr>",
      '<td><div class="contract-name">' + escapeHtml(item.contract) + "</div></td>",
      '<td><span class="tag ' + permissionTagClass(item.permissionType) + '">' + escapeHtml(item.permissionType) + "</span></td>",
      "<td>" + escapeHtml(item.functions) + "</td>",
      "<td>" + escapeHtml(item.purpose) + "</td>",
      "<td><code>" + escapeHtml(item.source) + "</code></td>",
      "</tr>"
    ].join("")).join("");
  }

  function renderProxies() {
    proxyTableBody.innerHTML = data.proxies.map((item) => {
      const live = state.liveProxyReads[item.id];
      const implStatus = live ? compareAddress(item.documentedImplementation, live.implementation) : "loading";
      const adminStatus = live ? compareAddress(item.documentedProxyAdmin, live.proxyAdmin) : "loading";
      const ownerStatus = live ? compareAddress(item.documentedAdminOwner, live.adminOwner) : "loading";

      return [
        "<tr>",
        '<td><div class="contract-name">' + escapeHtml(item.proxy) + "</div></td>",
        '<td><a class="mono-link" href="' + explorerLink(item.proxyAddress) + '" target="_blank" rel="noreferrer">' + escapeHtml(item.proxyAddress) + "</a></td>",
        "<td>",
        '<span class="live-pill ' + statusClass(implStatus) + '">' + escapeHtml(implStatus === "ok" ? "Match" : implStatus === "mismatch" ? "Mismatch" : implStatus === "loading" ? "Loading" : "Unknown") + "</span>",
        live && live.implementation ? '<div><code>' + escapeHtml(live.implementation) + "</code></div>" : '<div class="subtle">doc: <code>' + escapeHtml(item.documentedImplementation) + "</code></div>",
        "</td>",
        "<td><code>" + escapeHtml(item.documentedProxyAdmin) + "</code></td>",
        "<td>",
        '<span class="live-pill ' + statusClass(adminStatus) + '">' + escapeHtml(adminStatus === "ok" ? "Match" : adminStatus === "mismatch" ? "Mismatch" : adminStatus === "loading" ? "Loading" : "Unknown") + "</span>",
        live && live.proxyAdmin ? '<div><code>' + escapeHtml(live.proxyAdmin) + "</code></div>" : '<div class="subtle">Waiting for RPC read</div>',
        "</td>",
        "<td>",
        '<span class="live-pill ' + statusClass(ownerStatus) + '">' + escapeHtml(ownerStatus === "ok" ? "Match" : ownerStatus === "mismatch" ? "Mismatch" : ownerStatus === "loading" ? "Loading" : "Unknown") + "</span>",
        live && live.adminOwner ? '<div><code>' + escapeHtml(live.adminOwner) + "</code></div>" : '<div class="subtle">Waiting for RPC read</div>',
        "</td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function renderExecution() {
    executionList.innerHTML = data.executionPlan.map((item) => "<li>" + escapeHtml(item) + "</li>").join("");
  }

  function renderAudit() {
    auditList.innerHTML = data.auditChecklist.map((item) => "<li>" + escapeHtml(item) + "</li>").join("");
  }

  function renderNotes() {
    notesGrid.innerHTML = data.notes.map((note) => [
      '<article class="note-card">',
      "<h3>" + escapeHtml(note.title) + "</h3>",
      "<p>" + escapeHtml(note.body) + "</p>",
      "</article>"
    ].join("")).join("");
  }

  function setRpcMessage(message, tone) {
    rpcStatus.className = "rpc-status " + (tone || "");
    rpcStatus.textContent = message;
  }

  async function connectProvider() {
    if (!ethers) {
      throw new Error("ethers CDN failed to load. Check external script access.");
    }
    for (const url of data.rpcUrls) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(url, data.chainId);
        await provider.getBlockNumber();
        state.provider = provider;
        state.providerUrl = url;
        setRpcMessage("Connected to " + url, "rpc-ok");
        return provider;
      } catch (error) {
        continue;
      }
    }
    throw new Error("Could not connect to any configured Base RPC.");
  }

  async function loadPermissionReads() {
    const provider = state.provider || await connectProvider();

    await Promise.all(data.permissions.map(async (item) => {
      state.livePermissionReads[item.id] = { status: "loading", detail: "Reading chain..." };
      renderPermissions();
      try {
        const contract = new ethers.Contract(item.liveRead.target, item.liveRead.abi, provider);
        const rawValue = await contract[item.liveRead.method]();
        const value = typeof rawValue === "string" ? rawValue : rawValue.toString();
        const status = compareAddress(item.documentedController, value);
        state.livePermissionReads[item.id] = {
          status,
          value,
          detail: status === "ok"
            ? "Matches documented inventory."
            : status === "mismatch"
              ? "Live chain value differs from documented inventory."
              : "Documented value is not a clean address, so only live value is shown."
        };
      } catch (error) {
        state.livePermissionReads[item.id] = {
          status: "error",
          value: null,
          detail: error.message || "Read failed"
        };
      }
    }));
  }

  async function loadProxyReads() {
    const provider = state.provider || await connectProvider();

    await Promise.all(data.proxies.map(async (item) => {
      try {
        const implementationRaw = await provider.getStorageAt(item.proxyAddress, IMPLEMENTATION_SLOT);
        const proxyAdminRaw = await provider.getStorageAt(item.proxyAddress, ADMIN_SLOT);
        const implementation = addressFromStorage(implementationRaw);
        const proxyAdmin = addressFromStorage(proxyAdminRaw);
        let adminOwner = null;

        if (proxyAdmin) {
          const contract = new ethers.Contract(proxyAdmin, ["function owner() view returns (address)"], provider);
          adminOwner = await contract.owner();
        }

        state.liveProxyReads[item.id] = { implementation, proxyAdmin, adminOwner };
      } catch (error) {
        state.liveProxyReads[item.id] = { error: error.message || "Read failed" };
      }
    }));
  }

  function refreshLiveStats() {
    const stats = { ok: 0, mismatch: 0, unknown: 0, errors: 0 };
    Object.values(state.livePermissionReads).forEach((item) => {
      if (!item) return;
      if (item.status === "ok") stats.ok += 1;
      else if (item.status === "mismatch") stats.mismatch += 1;
      else if (item.status === "error") stats.errors += 1;
      else stats.unknown += 1;
    });

    data.proxies.forEach((proxy) => {
      const live = state.liveProxyReads[proxy.id];
      if (!live || live.error) {
        stats.errors += 1;
        return;
      }
      [compareAddress(proxy.documentedImplementation, live.implementation),
        compareAddress(proxy.documentedProxyAdmin, live.proxyAdmin),
        compareAddress(proxy.documentedAdminOwner, live.adminOwner)
      ].forEach((result) => {
        if (result === "ok") stats.ok += 1;
        else if (result === "mismatch") stats.mismatch += 1;
        else stats.unknown += 1;
      });
    });

    state.liveStats = stats;
    renderLiveSummary();
  }

  async function refreshOnchainState() {
    refreshLiveBtn.disabled = true;
    setRpcMessage("Connecting to Base RPC...", "rpc-loading");
    try {
      await connectProvider();
      await Promise.all([loadPermissionReads(), loadProxyReads()]);
      refreshLiveStats();
      renderPermissions();
      renderProxies();
      setRpcMessage("Live data refreshed from " + state.providerUrl, "rpc-ok");
    } catch (error) {
      setRpcMessage(error.message || "RPC refresh failed", "rpc-error");
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
        button.textContent = "Copied";
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
  renderFunctions();
  renderProxies();
  renderExecution();
  renderAudit();
  renderNotes();
  bindEvents();
  refreshOnchainState();
})();
