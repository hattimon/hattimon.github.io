(() => {
  "use strict";

  const STORAGE = {
    language: "lora20.dashboard.language",
    theme: "lora20.dashboard.theme",
    sound: "lora20.dashboard.soundEnabled",
    logDockCollapsed: "lora20.dashboard.logDockCollapsed",
    indexerUrl: "lora20.dashboard.indexerBaseUrl",
    profiles: "lora20.dashboard.profiles",
    scheduler: "lora20.dashboard.scheduler",
    knownDevices: "lora20.dashboard.knownDevices",
    lastSendAt: "lora20.dashboard.lastSuccessfulSendAt"
  };

  const DEFAULTS = {
    language: "pl",
    theme: "dark",
    indexerUrl: "https://lora20.hattimon.pl",
    profiles: [],
    scheduler: { enabled: false, intervalMinutes: 30 }
  };

  const TIMEOUTS = {
    default: 15000,
    get_info: 20000,
    get_lorawan: 20000,
    join_lorawan: 70000,
    lorawan_send: 50000
  };

  const SECRET_KEYS = new Set([
    "appKeyHex",
    "licenseHex",
    "passphrase",
    "ciphertextHex",
    "tagHex",
    "saltHex",
    "ivHex"
  ]);

  const I18N_EN = {
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.sound": "Sound",
    "settings.indexerUrl": "Public indexer URL",
    "actions.saveUrl": "Save URL",
    "actions.connect": "Connect device",
    "actions.disconnect": "Disconnect",
    "actions.refresh": "Refresh state",
    "actions.pullInfo": "Fetch info",
    "actions.publicKey": "Read public key",
    "actions.generateKey": "Generate key",
    "actions.register": "Register in indexer",
    "actions.pullRadio": "Fetch radio",
    "actions.join": "Join LoRaWAN",
    "actions.reloadPortfolio": "Refresh portfolio",
    "actions.reloadHistory": "Refresh history",
    "actions.reloadTokens": "Refresh tokens",
    "actions.checkHealth": "Check indexer",
    "actions.prepareMint": "Prepare mint",
    "actions.sendMint": "Prepare and send",
    "actions.prepareDeploy": "Prepare deploy",
    "actions.sendDeploy": "Prepare and send",
    "actions.prepareTransfer": "Prepare transfer",
    "actions.sendTransfer": "Prepare and send",
    "actions.prepareConfig": "Prepare config",
    "actions.sendConfig": "Prepare and send"
  };

  const refs = {};
  const refNames = [
    "languageSelect", "themeSelect", "soundEnabledInput", "indexerBaseUrlInput", "saveIndexerButton",
    "connectButton", "disconnectButton", "refreshButton", "connectionBadge", "indexerBadge", "radioBadge",
    "serialSupportNotice", "overviewTokensValue", "overviewBalancesValue", "overviewEventsValue",
    "overviewProfilesValue", "overviewLastSendValue", "overviewStatusNote", "getInfoButton",
    "quickMintChecklist", "tokenLibraryStatus", "logDock", "toggleLogDockButton",
    "getLorawanButton", "generateKeyButton", "getPublicKeyButton", "registerDeviceButton",
    "joinLorawanButton", "heltecLicenseInput", "setLicenseButton", "lorawanAutoDevEuiInput",
    "lorawanAdrInput", "lorawanConfirmedInput", "lorawanDevEuiInput", "lorawanJoinEuiInput",
    "lorawanAppKeyInput", "lorawanAppPortInput", "lorawanDataRateInput", "setLorawanButton",
    "linkDevEuiInput", "linkDevEuiButton", "exportBackupButton", "importBackupButton",
    "backupPassphraseInput", "backupImportPassphraseInput", "backupJsonTextarea", "deviceIdValue",
    "nextNonceValue", "autoMintValue", "defaultMintValue", "lorawanJoinedValue", "lorawanPortValue",
    "lorawanEventValue", "lorawanDevEuiValue", "deviceSummaryOutput", "lorawanSummaryOutput",
    "deviceReadinessBanner", "radioActionHint", "knownDevicesList", "tokenSearchInput", "tokenQuickPick",
    "tokenLibraryList", "portfolioList", "recentTransactionsList", "loadPortfolioButton",
    "reloadTokensButton", "selectedTokenSummary", "operationWarnings", "estimatedPayloadValue",
    "estimatedDcValue", "protocolVersionValue", "transportStatusNote", "preparedOutput",
    "allowRiskySendInput", "deployTickInput", "deployMaxSupplyInput", "deployLimitPerMintInput",
    "deployPrepareButton", "deploySendButton", "mintTickInput", "mintAmountInput", "mintPrepareButton",
    "mintSendButton", "transferTickInput", "transferAmountInput", "transferRecipientInput",
    "transferPrepareButton", "transferSendButton", "configAutoMintEnabledInput",
    "configAutoMintIntervalInput", "configPrepareButton", "configSendButton", "profileNameInput",
    "profileTickInput", "profileAmountInput", "profileIntervalInput", "profileEnabledInput",
    "saveProfileButton", "clearProfileButton", "profileQueueEnabledInput", "profileQueueIntervalInput",
    "syncProfilesButton", "syncProfilesBroadcastButton", "stopProfilesButton", "profileQueuePreview",
    "profilesPersistenceNote", "profileList", "onboardingChecklist", "educationContent", "healthButton",
    "healthOutput", "tokenTickInput", "tokenLookupButton", "tokenOutput", "balanceDeviceIdInput",
    "balanceTickInput", "balanceLookupButton", "balanceOutput", "transactionsDeviceIdInput",
    "transactionsTickInput", "transactionsLimitInput", "transactionsButton", "transactionsOutput",
    "rawCommandTextarea", "sendRawCommandButton", "activityLog"
  ];
  const state = {
    language: readStorage(STORAGE.language, DEFAULTS.language),
    theme: readStorage(STORAGE.theme, DEFAULTS.theme),
    soundEnabled: readStorage(STORAGE.sound, "1") !== "0",
    indexerBaseUrl: normalizeUrl(readStorage(STORAGE.indexerUrl, DEFAULTS.indexerUrl)) || DEFAULTS.indexerUrl,
    profiles: loadJson(STORAGE.profiles, DEFAULTS.profiles),
    scheduler: loadJson(STORAGE.scheduler, DEFAULTS.scheduler),
    knownDevices: loadJson(STORAGE.knownDevices, []),
    lastSendAt: readStorage(STORAGE.lastSendAt, ""),
    tokenCatalog: [],
    portfolio: [],
    recentTransactions: [],
    tokenCatalogError: "",
    deviceInfo: null,
    lorawanInfo: null,
    publicKeyInfo: null,
    lastPrepared: null,
    indexerOnline: null,
    logDockCollapsed: readStorage(STORAGE.logDockCollapsed, "0") === "1",
    port: null,
    reader: null,
    disconnecting: false,
    pending: new Map(),
    requestId: 1,
    audioContext: null
  };

  function init() {
    for (const name of refNames) {
      refs[name] = document.getElementById(name);
    }

    captureDefaultTexts();
    bindEvents();
    hydrateSettings();
    renderOnboarding();
    renderEducation();
    applyTheme();
    applyLanguage();
    renderAll();
    updateSerialSupport();
    window.addEventListener("beforeunload", () => {
      if (state.port) {
        void disconnectDevice(false);
      }
    });
    void refreshIndexer(false);
  }

  function captureDefaultTexts() {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.dataset.defaultText = node.textContent;
    });
  }

  function bindEvents() {
    refs.languageSelect?.addEventListener("change", handleLanguageChange);
    refs.themeSelect?.addEventListener("change", handleThemeChange);
    refs.soundEnabledInput?.addEventListener("change", handleSoundToggle);
    refs.toggleLogDockButton?.addEventListener("click", toggleLogDock);
    wireAction(refs.saveIndexerButton, handleSaveIndexerUrl);
    wireAction(refs.connectButton, () => connectDevice());
    wireAction(refs.disconnectButton, () => disconnectDevice(true));
    wireAction(refs.refreshButton, () => refreshEverything());
    wireAction(refs.getInfoButton, () => refreshDeviceInfo());
    wireAction(refs.getLorawanButton, () => refreshLorawanInfo());
    wireAction(refs.generateKeyButton, () => generateKey());
    wireAction(refs.getPublicKeyButton, () => readPublicKey());
    wireAction(refs.registerDeviceButton, () => registerDevice());
    wireAction(refs.joinLorawanButton, () => joinLorawan());
    wireAction(refs.setLicenseButton, () => saveHeltecLicense());
    wireAction(refs.setLorawanButton, () => saveLorawanConfig());
    wireAction(refs.linkDevEuiButton, () => linkDevEui());
    wireAction(refs.exportBackupButton, () => exportBackup());
    wireAction(refs.importBackupButton, () => importBackup());
    wireAction(refs.loadPortfolioButton, () => loadPortfolioAndHistory());
    wireAction(refs.transactionsButton, () => loadTransactions());
    wireAction(refs.reloadTokensButton, () => loadTokens());
    wireAction(refs.healthButton, () => refreshIndexer(true));
    wireAction(refs.tokenLookupButton, () => lookupToken());
    wireAction(refs.balanceLookupButton, () => lookupBalance());
    wireAction(refs.sendRawCommandButton, () => sendRawCommand());
    wireAction(refs.deployPrepareButton, () => prepareDeploy());
    wireAction(refs.deploySendButton, () => sendDeploy());
    wireAction(refs.mintPrepareButton, () => prepareMint());
    wireAction(refs.mintSendButton, () => sendMint());
    wireAction(refs.transferPrepareButton, () => prepareTransfer());
    wireAction(refs.transferSendButton, () => sendTransfer());
    wireAction(refs.configPrepareButton, () => prepareConfig());
    wireAction(refs.configSendButton, () => sendConfig());
    wireAction(refs.saveProfileButton, () => handleSaveProfile());
    wireAction(refs.clearProfileButton, () => clearProfileEditor());
    wireAction(refs.syncProfilesButton, () => syncProfiles(false));
    wireAction(refs.syncProfilesBroadcastButton, () => syncProfiles(true));
    wireAction(refs.stopProfilesButton, () => stopProfiles());
    refs.tokenSearchInput?.addEventListener("input", renderTokenLibrary);
    refs.tokenQuickPick?.addEventListener("change", handleQuickPickChange);
    refs.mintTickInput?.addEventListener("input", renderOperations);
    refs.mintAmountInput?.addEventListener("input", renderOperations);
    refs.allowRiskySendInput?.addEventListener("change", renderOperations);
    refs.profileList?.addEventListener("click", handleProfileListClick);
    refs.tokenLibraryList?.addEventListener("click", handleTokenLibraryClick);
    refs.knownDevicesList?.addEventListener("click", handleKnownDevicesClick);
  }

  function wireAction(node, task) {
    node?.addEventListener("click", (event) => {
      event.preventDefault();
      Promise.resolve()
        .then(() => task())
        .catch((error) => {
          addLog("error", error instanceof Error ? error.message : String(error));
        });
    });
  }

  function hydrateSettings() {
    if (refs.languageSelect) refs.languageSelect.value = state.language;
    if (refs.themeSelect) refs.themeSelect.value = state.theme;
    if (refs.soundEnabledInput) refs.soundEnabledInput.checked = state.soundEnabled;
    if (refs.indexerBaseUrlInput) refs.indexerBaseUrlInput.value = state.indexerBaseUrl;
    if (refs.profileQueueEnabledInput) refs.profileQueueEnabledInput.checked = Boolean(state.scheduler.enabled);
    if (refs.profileQueueIntervalInput) refs.profileQueueIntervalInput.value = String(state.scheduler.intervalMinutes || 30);
    if (refs.protocolVersionValue) refs.protocolVersionValue.textContent = "v1 / Ed25519 / LoRaWAN";
    applyLogDockState();
  }

  function handleLanguageChange() {
    state.language = refs.languageSelect?.value || DEFAULTS.language;
    writeStorage(STORAGE.language, state.language);
    applyLanguage();
    renderAll();
  }

  function handleThemeChange() {
    state.theme = refs.themeSelect?.value || DEFAULTS.theme;
    writeStorage(STORAGE.theme, state.theme);
    applyTheme();
    renderAll();
  }

  function handleSoundToggle() {
    state.soundEnabled = Boolean(refs.soundEnabledInput?.checked);
    writeStorage(STORAGE.sound, state.soundEnabled ? "1" : "0");
  }

  function toggleLogDock() {
    state.logDockCollapsed = !state.logDockCollapsed;
    writeStorage(STORAGE.logDockCollapsed, state.logDockCollapsed ? "1" : "0");
    applyLogDockState();
  }

  function handleSaveIndexerUrl() {
    state.indexerBaseUrl = normalizeUrl(refs.indexerBaseUrlInput?.value) || DEFAULTS.indexerUrl;
    if (refs.indexerBaseUrlInput) refs.indexerBaseUrlInput.value = state.indexerBaseUrl;
    writeStorage(STORAGE.indexerUrl, state.indexerBaseUrl);
    addLog("device", `Indexer URL saved: ${state.indexerBaseUrl}`);
    void refreshIndexer(true);
  }

  function applyLanguage() {
    document.documentElement.lang = state.language;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      node.textContent = state.language === "en" && I18N_EN[key]
        ? I18N_EN[key]
        : (node.dataset.defaultText || node.textContent);
    });

    setSelectLabels(refs.languageSelect, state.language === "en" ? ["Polish", "English"] : ["Polski", "English"]);
    setSelectLabels(refs.themeSelect, state.language === "en" ? ["Dark", "Medium", "Light"] : ["Ciemny", "Średni", "Jasny"]);

    const soundLabel = refs.soundEnabledInput?.parentElement?.querySelector("span");
    if (soundLabel) {
      soundLabel.textContent = state.language === "en" ? "Sound" : "Dźwięki";
    }
  }

  function applyTheme() {
    document.body.dataset.theme = state.theme;
  }

  function applyLogDockState() {
    document.body.dataset.logDock = state.logDockCollapsed ? "collapsed" : "expanded";
    if (refs.logDock) refs.logDock.classList.toggle("log-dock--collapsed", state.logDockCollapsed);
    if (refs.toggleLogDockButton) {
      refs.toggleLogDockButton.textContent = state.logDockCollapsed
        ? (state.language === "en" ? "Show log" : "Pokaż log")
        : (state.language === "en" ? "Minimize log" : "Zwiń log");
    }
  }

  function setSelectLabels(select, labels) {
    if (!select) return;
    Array.from(select.options).forEach((option, index) => {
      if (labels[index]) option.textContent = labels[index];
    });
  }

  function updateSerialSupport() {
    if (!refs.serialSupportNotice) return;
    refs.serialSupportNotice.textContent = "serial" in navigator
      ? "Przed połączeniem zamknij VS Code Serial Monitor, PlatformIO, MobaXterm i inne aplikacje blokujące COM."
      : "Web Serial działa tylko w Chrome lub Edge na HTTPS albo localhost.";
  }

  function renderAll() {
    renderBadges();
    renderOverview();
    renderQuickMintChecklist();
    renderDevice();
    renderRadio();
    renderTokenLibrary();
    renderPortfolio();
    renderPrepared();
    renderProfiles();
    renderOperations();
    syncIndexerLookupFields();
    applyLogDockState();
  }

  function renderBadges() {
    setBadge(refs.connectionBadge, state.port ? "connected" : "danger", state.port ? "USB connected" : "USB offline");
    if (state.indexerOnline === true) setBadge(refs.indexerBadge, "ok", "Indexer online");
    else if (state.indexerOnline === false) setBadge(refs.indexerBadge, "danger", "Indexer offline");
    else setBadge(refs.indexerBadge, "warn", "Indexer probing");

    const runtime = state.lorawanInfo?.runtime || state.lorawanInfo?.lorawanRuntime;
    if (!runtime) setBadge(refs.radioBadge, "warn", "LoRa idle");
    else if (runtime.joined) setBadge(refs.radioBadge, "ok", "LoRa joined");
    else if (runtime.configured || runtime.initialized || runtime.hardwareReady) setBadge(refs.radioBadge, "warn", "LoRa configured");
    else setBadge(refs.radioBadge, "danger", "LoRa not ready");
  }

  function renderOverview() {
    setText(refs.overviewTokensValue, String(getKnownTokens().length));
    setText(refs.overviewBalancesValue, String(state.portfolio.length));
    setText(refs.overviewEventsValue, String(state.recentTransactions.length));
    setText(refs.overviewProfilesValue, String(state.profiles.filter((profile) => profile.enabled).length));
    setText(refs.overviewLastSendValue, formatLastSend(state.lastSendAt));

    const notes = [];
    if (!state.port) notes.push("Urządzenie nie jest jeszcze podłączone przez Web Serial.");
    if (state.indexerOnline !== true) notes.push("Indexer nie odpowiada lub dashboard nie może go odczytać.");
    if (state.tokenCatalogError) notes.push(`Lista tickerów nie odświeżyła się: ${state.tokenCatalogError}.`);
    const runtime = state.lorawanInfo?.runtime || state.lorawanInfo?.lorawanRuntime;
    if (runtime && !runtime.joined) notes.push("Radio nie jest joined, więc próba wysyłki skończy się timeoutem albo odrzuceniem.");
    if (state.lastSendAt) notes.push(`Ostatnia wysyłka: ${formatDateTime(state.lastSendAt)}.`);
    renderCallout(refs.overviewStatusNote, notes.length ? "warn" : "ok", notes.length ? notes.join(" ") : "Panel wygląda na gotowy do pracy.");
  }

  function renderQuickMintChecklist() {
    if (!refs.quickMintChecklist) return;
    const runtime = state.lorawanInfo?.runtime || state.lorawanInfo?.lorawanRuntime;
    const currentTick = normalizeTick(refs.mintTickInput?.value || "");
    const token = findToken(currentTick);
    const title = state.language === "en"
      ? "Quick path for an already configured device"
      : "Szybka ścieżka dla już skonfigurowanego urządzenia";
    const steps = state.language === "en"
      ? [
          state.port ? "Device is already connected by USB." : "Connect the device by USB.",
          state.deviceInfo?.hasKey ? "Device info and key are already available." : "Click Fetch info and confirm the device has a key.",
          runtime?.joined ? "LoRaWAN is already joined." : "Click Fetch radio and run Join LoRaWAN if joined=false.",
          token ? `Ticker ${currentTick} is visible in the indexer.` : "Refresh tokens or portfolio until the ticker appears.",
          "Open the mint card and click Prepare and send. For a brand new Heltec, use the onboarding section below."
        ]
      : [
          state.port ? "Urządzenie jest już podłączone przez USB." : "Podłącz urządzenie przez USB.",
          state.deviceInfo?.hasKey ? "Info i klucz urządzenia są już dostępne." : "Kliknij „Pobierz info” i upewnij się, że urządzenie ma klucz.",
          runtime?.joined ? "LoRaWAN jest już joined." : "Kliknij „Pobierz radio”, a jeśli trzeba także „Join LoRaWAN”.",
          token ? `Ticker ${currentTick} jest widoczny w indexerze.` : "Odśwież tokeny albo portfolio, aż ticker pojawi się w indexerze.",
          "W karcie mintu kliknij „Przygotuj i wyślij”. Jeśli to nowy Heltec, niżej masz pełny onboarding."
        ];

    refs.quickMintChecklist.innerHTML = `
      <div class="callout callout--neutral">
        <strong>${escapeHtml(title)}</strong>
        <ol class="quick-steps__list">
          ${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
      </div>
    `;
  }

  function renderDevice() {
    const device = state.deviceInfo;
    setText(refs.deviceIdValue, device?.deviceId || "-");
    setText(refs.nextNonceValue, device?.nextNonce == null ? "-" : String(device.nextNonce));
    setText(refs.autoMintValue, device?.config?.autoMintEnabled ? "on" : "off");
    setText(refs.defaultMintValue, device?.config ? `${device.config.defaultTick || "-"} / ${device.config.defaultMintAmount || "-"}` : "-");
    setText(refs.deviceSummaryOutput, device ? prettyJson(device) : "No device data yet.");

    const hints = [];
    if (!device) hints.push("Po połączeniu kliknij „Pobierz info”.");
    else {
      hints.push(`Aktywny deviceId: ${device.deviceId}.`);
      if (!device.hasKey) hints.push("Klucz urządzenia nie został jeszcze wygenerowany.");
    }
    renderCallout(refs.deviceReadinessBanner, device?.hasKey ? "ok" : "warn", hints.join(" "));

    if (!refs.knownDevicesList) return;
    if (!state.knownDevices.length) {
      refs.knownDevicesList.innerHTML = `<div class="known-device"><h3>Brak zapisanych urządzeń</h3><p class="helper">Po udanym odczycie info lub rejestracji w indexerze urządzenie pojawi się tutaj.</p></div>`;
      return;
    }

    refs.knownDevicesList.innerHTML = state.knownDevices.map((deviceEntry) => `
      <article class="known-device">
        <div class="known-device__head">
          <div>
            <h3 class="mono">${escapeHtml(deviceEntry.deviceId)}</h3>
            <p class="helper">${escapeHtml(maskSecret(deviceEntry.publicKeyHex || ""))}</p>
          </div>
          <div class="button-row">
            <button class="button button--ghost" type="button" data-action="use-device" data-id="${escapeHtml(deviceEntry.deviceId)}">Use</button>
            <button class="button button--ghost" type="button" data-action="remove-device" data-id="${escapeHtml(deviceEntry.deviceId)}">Remove</button>
          </div>
        </div>
      </article>
    `).join("");
  }

  function renderRadio() {
    const info = state.lorawanInfo;
    const runtime = info?.runtime || info?.lorawanRuntime;
    const config = info?.config || state.deviceInfo?.lorawan;

    setText(refs.lorawanJoinedValue, runtime ? String(Boolean(runtime.joined)) : "-");
    setText(refs.lorawanPortValue, config?.appPort == null ? "-" : String(config.appPort));
    setText(refs.lorawanEventValue, runtime?.lastEvent || "-");
    setText(refs.lorawanDevEuiValue, config?.devEuiHex || "-");
    setText(refs.lorawanSummaryOutput, info ? prettyJson(info) : "No LoRaWAN status yet.");

    const messages = [];
    if (!config?.hasAppKey || !config?.hasJoinEui) messages.push("Brakuje pełnej konfiguracji OTAA.");
    if (runtime && !runtime.hardwareReady) messages.push("hardwareReady=false. Po restarcie Helteca odczekaj chwilę i dopiero odczytaj radio lub wykonaj join.");
    if (runtime && !runtime.initialized) messages.push("initialized=false. Radio nie jest gotowe do wysyłki.");
    if (runtime && !runtime.joined) messages.push("joined=false. Wykonaj join przed wysyłką.");
    renderCallout(refs.radioActionHint, messages.length ? "warn" : "ok", messages.length ? messages.join(" ") : "Radio wygląda na gotowe do wysyłki.");
  }

  function renderPortfolio() {
    if (refs.portfolioList) {
      if (!state.portfolio.length) {
        refs.portfolioList.innerHTML = `<div class="token-card"><h3>Brak balansu</h3><p class="helper">Po pobraniu portfela zobaczysz tu tokeny przypisane do aktywnego deviceId.</p></div>`;
      } else {
        refs.portfolioList.innerHTML = state.portfolio.map((entry) => `
          <article class="token-card">
            <div class="token-card__head">
              <h3>${escapeHtml(entry.tick)}</h3>
              <span class="token-pill">${escapeHtml(entry.balance)}</span>
            </div>
            <div class="token-meta">
              <span class="hero-chip">max ${escapeHtml(entry.token?.maxSupply || "-")}</span>
              <span class="hero-chip">limit ${escapeHtml(entry.token?.limitPerMint || "-")}</span>
            </div>
          </article>
        `).join("");
      }
    }

    if (!refs.recentTransactionsList) return;
    if (!state.recentTransactions.length) {
      refs.recentTransactionsList.innerHTML = `<div class="timeline-card"><h3>Brak historii</h3><p class="helper">Po synchronizacji webhooka i wysłaniu nowego uplinku zobaczysz tu zdarzenia z indexera.</p></div>`;
      return;
    }

    refs.recentTransactionsList.innerHTML = state.recentTransactions.map((event) => `
      <article class="timeline-card">
        <div class="timeline-card__head">
          <h3>${escapeHtml(event.opName || `op ${event.op}`)}</h3>
          <span class="badge ${event.status === "accepted" ? "badge--ok" : "badge--warn"}">${escapeHtml(event.status)}</span>
        </div>
        <div class="token-meta">
          ${event.tick ? `<span class="hero-chip">${escapeHtml(event.tick)}</span>` : ""}
          ${event.amount ? `<span class="hero-chip">${escapeHtml(event.amount)}</span>` : ""}
          ${event.nonce != null ? `<span class="hero-chip">nonce ${escapeHtml(String(event.nonce))}</span>` : ""}
        </div>
        <p class="helper">${escapeHtml(formatDateTime(event.receivedAt || event.createdAt))}</p>
      </article>
    `).join("");
  }

  function renderTokenLibrary() {
    const search = normalizeTick(refs.tokenSearchInput?.value || "");
    const knownTokens = getKnownTokens();
    const filtered = knownTokens.filter((token) => !search || token.tick.includes(search));

    if (refs.tokenQuickPick) {
      const current = refs.tokenQuickPick.value;
      refs.tokenQuickPick.innerHTML = `<option value="">-</option>${knownTokens.map((token) => `<option value="${escapeHtml(token.tick)}">${escapeHtml(token.tick)}</option>`).join("")}`;
      if (current && knownTokens.some((token) => token.tick === current)) refs.tokenQuickPick.value = current;
    }

    if (refs.tokenLibraryStatus) {
      if (state.tokenCatalogError && knownTokens.length) {
        renderCallout(refs.tokenLibraryStatus, "warn", `Lista tokenów z indexera nie odświeżyła się, więc panel pokazuje dane z portfela urządzenia. ${state.tokenCatalogError}`);
      } else if (state.tokenCatalogError) {
        renderCallout(refs.tokenLibraryStatus, "danger", `Nie udało się pobrać listy tokenów z indexera. ${state.tokenCatalogError}`);
      } else {
        renderCallout(refs.tokenLibraryStatus, "ok", "Wybierz ticker z listy, aby automatycznie wypełnić pola deploy, mint i transfer.");
      }
    }

    if (!refs.tokenLibraryList) return;
    if (!filtered.length) {
      refs.tokenLibraryList.innerHTML = `<div class="token-card"><h3>Brak tokenów</h3><p class="helper">Indexer nie zwrócił jeszcze żadnych wdrożonych tickerów.</p></div>`;
      return;
    }

    refs.tokenLibraryList.innerHTML = filtered.map((token) => {
      const remaining = safeBigInt(token.maxSupply) - safeBigInt(token.totalSupply);
      return `
        <article class="token-card">
          <div class="token-card__head">
            <h3>${escapeHtml(token.tick)}</h3>
            <button class="button button--ghost" type="button" data-action="use-token" data-tick="${escapeHtml(token.tick)}">Use</button>
          </div>
          <div class="token-meta">
            <span class="hero-chip">mint ${escapeHtml(token.limitPerMint)}</span>
            <span class="hero-chip">supply ${escapeHtml(token.totalSupply)} / ${escapeHtml(token.maxSupply)}</span>
            <span class="hero-chip">left ${escapeHtml(remaining.toString())}</span>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderPrepared() {
    setText(refs.preparedOutput, state.lastPrepared ? prettyJson(state.lastPrepared) : "No prepared payload yet.");
    const payloadSize = state.lastPrepared?.payloadSize || 81;
    setText(refs.estimatedPayloadValue, `${payloadSize} B`);
    setText(refs.estimatedDcValue, `~${estimateDc(payloadSize)} DC`);
  }

  function renderProfiles() {
    saveJson(STORAGE.profiles, state.profiles);
    saveJson(STORAGE.scheduler, state.scheduler);

    if (refs.profilesPersistenceNote) {
      refs.profilesPersistenceNote.textContent = "Profile są zapamiętywane lokalnie w przeglądarce. „Synchronizuj kolejkę” zapisuje je do Helteca, więc urządzenie może mintować także bez podłączonego panelu.";
    }

    if (refs.profileQueuePreview) {
      const active = state.profiles.filter((profile) => profile.enabled);
      refs.profileQueuePreview.textContent = prettyJson({
        loopEnabled: Boolean(state.scheduler.enabled),
        intervalMinutes: Number(refs.profileQueueIntervalInput?.value || state.scheduler.intervalMinutes || 30),
        activeProfiles: active.map((profile) => ({ tick: profile.tick, amount: profile.amount }))
      });
    }

    if (!refs.profileList) return;
    if (!state.profiles.length) {
      refs.profileList.innerHTML = `<div class="profile-card"><h3>Brak profili</h3><p class="helper">Dodaj profil mintu, a potem zsynchronizuj kolejkę z urządzeniem.</p></div>`;
      return;
    }

    refs.profileList.innerHTML = state.profiles.map((profile, index) => `
      <article class="profile-card ${profile.enabled ? "profile-card--active" : ""}">
        <div class="token-card__head">
          <div>
            <h3>${escapeHtml(profile.name || `${profile.tick} / ${profile.amount}`)}</h3>
            <p class="helper">${escapeHtml(profile.tick)} / ${escapeHtml(profile.amount)} / ${escapeHtml(String(profile.intervalMinutes || 30))} min</p>
          </div>
          <span class="badge ${profile.enabled ? "badge--ok" : "badge--warn"}">${profile.enabled ? "active" : "paused"}</span>
        </div>
        <div class="button-row">
          <button class="button button--ghost" type="button" data-action="use-profile" data-id="${escapeHtml(profile.id)}">Use</button>
          <button class="button button--ghost" type="button" data-action="toggle-profile" data-id="${escapeHtml(profile.id)}">${profile.enabled ? "Pause" : "Enable"}</button>
          <button class="button button--ghost" type="button" data-action="move-up" data-id="${escapeHtml(profile.id)}" ${index === 0 ? "disabled" : ""}>Up</button>
          <button class="button button--ghost" type="button" data-action="move-down" data-id="${escapeHtml(profile.id)}" ${index === state.profiles.length - 1 ? "disabled" : ""}>Down</button>
          <button class="button button--ghost" type="button" data-action="remove-profile" data-id="${escapeHtml(profile.id)}">Remove</button>
        </div>
      </article>
    `).join("");
  }

  function renderOperations() {
    const mintTick = normalizeTick(refs.mintTickInput?.value || "");
    const mintAmount = refs.mintAmountInput?.value?.trim() || "0";
    const selectedToken = findToken(mintTick);
    const warnings = getMintWarnings(mintTick, mintAmount, selectedToken);

    if (refs.selectedTokenSummary) {
      if (!selectedToken) {
        renderCallout(refs.selectedTokenSummary, "warn", mintTick ? `Ticker ${mintTick} nie jest jeszcze widoczny w indexerze. Mint bez wcześniejszego deploy prawdopodobnie nie zostanie zaindeksowany.` : "Wybierz ticker albo kliknij token z biblioteki.");
      } else {
        const remaining = safeBigInt(selectedToken.maxSupply) - safeBigInt(selectedToken.totalSupply);
        renderCallout(refs.selectedTokenSummary, "ok", `${selectedToken.tick}: minted ${selectedToken.totalSupply}/${selectedToken.maxSupply}, limit per mint ${selectedToken.limitPerMint}, remaining ${remaining}.`);
      }
    }

    if (refs.operationWarnings) {
      if (!warnings.length) renderCallout(refs.operationWarnings, "ok", "Brak oczywistych błędów logicznych dla aktualnego mintu.");
      else renderCallout(refs.operationWarnings, warnings.some((warning) => warning.blocking) ? "danger" : "warn", warnings.map((warning) => warning.message).join(" "));
    }

    const lastSendMs = state.lastSendAt ? Date.now() - Date.parse(state.lastSendAt) : Number.POSITIVE_INFINITY;
    const transportNotes = [];
    const runtime = state.lorawanInfo?.runtime || state.lorawanInfo?.lorawanRuntime;
    if (!state.port) transportNotes.push("Brak połączenia USB.");
    if (runtime && !runtime.joined) transportNotes.push("Radio nie jest joined.");
    if (runtime && (!runtime.hardwareReady || !runtime.initialized)) transportNotes.push("Radio po restarcie nie jest jeszcze gotowe do kolejnej wysyłki.");
    if (Number.isFinite(lastSendMs) && lastSendMs < 15000) transportNotes.push(`Ostatnia wysyłka była ${formatRelative(Date.now(), Date.parse(state.lastSendAt))}. Daj urządzeniu chwilę przed następną próbą.`);
    renderCallout(refs.transportStatusNote, transportNotes.length ? "warn" : "ok", transportNotes.length ? transportNotes.join(" ") : "Transport wygląda poprawnie.");
  }

  function renderOnboarding() {
    if (!refs.onboardingChecklist) return;
    refs.onboardingChecklist.innerHTML = [
      { title: "1. Sterowniki i port", body: "Użyj Chrome albo Edge. Zamknij VS Code Serial Monitor, PlatformIO, MobaXterm i każdą aplikację trzymającą COM przed kliknięciem „Połącz urządzenie”." },
      { title: "2. Firmware i klucz", body: "Po połączeniu pobierz info, wygeneruj klucz, odczytaj public key i zarejestruj urządzenie w indexerze. Jeśli firmware był aktualizowany, sprawdź radio i join." },
      { title: "3. LoRaWAN", body: "Wypełnij DevEUI, JoinEUI, AppKey i zapisz radio. Potem wykonaj join. Nie próbuj mintu, gdy runtime pokazuje joined=false albo hardwareReady=false." },
      { title: "4. Indexer i webhook", body: "Sprawdź health indexera, podepnij DevEUI do deviceId i upewnij się, że ChirpStack wysyła webhook na /integrations/chirpstack z aktualnym tokenem." }
    ].map((item) => `
      <article class="guide-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");
  }

  function renderEducation() {
    if (!refs.educationContent) return;
    refs.educationContent.innerHTML = `
      <p>Każda wiadomość jest podpisywana Ed25519. Indexer używa nonce, żeby odrzucić replay i duplikaty. Deploy liczy się tylko pierwszy dla tickera, a mint przestaje być indeksowany po osiągnięciu max supply.</p>
      <ul>
        <li><strong>Mint</strong>: obecnie około 81 B payloadu, czyli około ${estimateDc(81)} DC bazowego kosztu przy porcjach 24 B.</li>
        <li><strong>Config</strong>: zapis ustawień auto-mintu i interwału; profile round-robin są utrzymywane lokalnie w Heltecu po synchronizacji.</li>
        <li><strong>Bezpieczeństwo</strong>: podpis udowadnia autora, nonce pilnuje kolejności, a webhook do indexera powinien być chroniony osobnym tokenem.</li>
      </ul>
    `;
  }

  async function refreshEverything() {
    await Promise.allSettled([refreshDeviceState(), refreshIndexer(true)]);
  }

  async function refreshDeviceState() {
    await Promise.allSettled([refreshDeviceInfo(), refreshLorawanInfo()]);
  }

  async function refreshDeviceInfo() {
    const result = await requestDevice("get_info", {});
    state.deviceInfo = result.device || null;
    if (result.lorawanRuntime) {
      state.lorawanInfo = {
        ...(state.lorawanInfo || {}),
        config: state.lorawanInfo?.config || result.device?.lorawan || null,
        runtime: result.lorawanRuntime,
        heltec: state.lorawanInfo?.heltec || { hasLicense: Boolean(result.device?.heltecLicensePresent) }
      };
    }
    if (result.device?.deviceId) {
      upsertKnownDevice({ deviceId: result.device.deviceId, publicKeyHex: result.device.publicKeyHex || state.publicKeyInfo?.publicKeyHex || "" });
    }
    renderAll();
    return result;
  }

  async function refreshLorawanInfo() {
    const result = await requestDevice("get_lorawan", {});
    state.lorawanInfo = result;
    renderAll();
    return result;
  }

  async function generateKey() {
    const result = await requestDevice("generate_key", { force: false }, 30000);
    state.deviceInfo = result.device || state.deviceInfo;
    if (result.device?.deviceId) {
      upsertKnownDevice({ deviceId: result.device.deviceId, publicKeyHex: result.device.publicKeyHex || "" });
    }
    renderAll();
  }

  async function readPublicKey() {
    const result = await requestDevice("get_public_key", {});
    state.publicKeyInfo = result;
    if (state.deviceInfo) {
      state.deviceInfo.publicKeyHex = result.publicKeyHex;
      state.deviceInfo.deviceId = result.deviceId;
      upsertKnownDevice(result);
    }
    addLog("device", "Public key loaded", result);
    renderAll();
    return result;
  }

  async function registerDevice() {
    let publicKeyHex = state.publicKeyInfo?.publicKeyHex || state.deviceInfo?.publicKeyHex;
    if (!publicKeyHex) {
      const result = await readPublicKey();
      publicKeyHex = result.publicKeyHex;
    }

    const response = await fetchJson("/devices/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKeyRaw: publicKeyHex })
    });

    if (response.device) {
      upsertKnownDevice({ deviceId: response.device.deviceId, publicKeyHex: response.device.publicKeyRaw });
      addLog("indexer", "Device registered in indexer", response.device);
      await loadPortfolioAndHistory();
    }
  }

  async function refreshIndexer(loadMore) {
    let healthOk = false;
    try {
      const health = await fetchJson("/health");
      healthOk = health?.status === "ok";
      state.indexerOnline = healthOk;
      setText(refs.healthOutput, prettyJson(health));
    } catch (error) {
      state.indexerOnline = false;
      addLog("error", error.message);
    }

    if (healthOk && (loadMore || !state.tokenCatalog.length)) {
      await loadTokens().catch((error) => {
        addLog("error", error.message);
      });
    }

    if (healthOk && loadMore && getCurrentDeviceId()) {
      await loadPortfolioAndHistory().catch((error) => {
        addLog("error", error.message);
      });
    }

    renderAll();
  }

  async function loadTokens() {
    const search = refs.tokenSearchInput?.value?.trim() || "";
    const query = new URLSearchParams();
    query.set("limit", "100");
    if (search) query.set("search", search);
    try {
      const response = await fetchJson(`/tokens?${query.toString()}`);
      state.tokenCatalog = Array.isArray(response.tokens) ? response.tokens : [];
      state.tokenCatalogError = "";
      setText(refs.tokenOutput, prettyJson(response));
      renderAll();
      return response;
    } catch (error) {
      state.tokenCatalogError = error instanceof Error ? error.message : String(error);
      setText(refs.tokenOutput, prettyJson({ error: state.tokenCatalogError }));
      renderAll();
      throw error;
    }
  }

  async function lookupToken() {
    const tick = normalizeTick(refs.tokenTickInput?.value || refs.mintTickInput?.value || "");
    if (!tick) throw new Error("Podaj tick do sprawdzenia tokena.");
    const response = await fetchJson(`/tokens/${encodeURIComponent(tick)}`);
    setText(refs.tokenOutput, prettyJson(response));
  }

  async function loadPortfolioAndHistory() {
    await Promise.allSettled([loadPortfolio(), loadTransactions()]);
  }

  async function loadPortfolio() {
    const deviceId = getCurrentDeviceId();
    if (!deviceId) throw new Error("Brak aktywnego deviceId. Najpierw odczytaj info urządzenia albo wybierz zapisany node.");
    const response = await fetchJson(`/devices/${encodeURIComponent(deviceId)}/balances?limit=100`);
    state.portfolio = Array.isArray(response.balances) ? response.balances : [];
    setText(refs.balanceOutput, prettyJson(response));
    renderAll();
  }

  async function lookupBalance() {
    const deviceId = (refs.balanceDeviceIdInput?.value || getCurrentDeviceId() || "").trim().toLowerCase();
    const tick = normalizeTick(refs.balanceTickInput?.value || refs.mintTickInput?.value || "");
    if (!deviceId || !tick) throw new Error("Do sprawdzenia balansu potrzebny jest deviceId i tick.");
    const response = await fetchJson(`/balances/${encodeURIComponent(deviceId)}/${encodeURIComponent(tick)}`);
    setText(refs.balanceOutput, prettyJson(response));
  }

  async function loadTransactions() {
    const deviceId = getCurrentDeviceId();
    if (!deviceId) throw new Error("Brak aktywnego deviceId do pobrania historii.");
    const query = new URLSearchParams({ deviceId, limit: String(Number(refs.transactionsLimitInput?.value || 20)) });
    const response = await fetchJson(`/transactions?${query.toString()}`);
    state.recentTransactions = Array.isArray(response.transactions) ? response.transactions : [];
    setText(refs.transactionsOutput, prettyJson(response));
    renderAll();
  }

  async function saveHeltecLicense() {
    const licenseHex = refs.heltecLicenseInput?.value?.trim() || "";
    if (!licenseHex) throw new Error("Wpisz licencję Heltec przed zapisaniem.");
    await requestDevice("set_heltec_license", { licenseHex }, 30000);
    await refreshLorawanInfo();
  }

  async function saveLorawanConfig() {
    const params = {
      autoDevEui: Boolean(refs.lorawanAutoDevEuiInput?.checked),
      adr: Boolean(refs.lorawanAdrInput?.checked),
      confirmedUplink: Boolean(refs.lorawanConfirmedInput?.checked),
      appPort: Number(refs.lorawanAppPortInput?.value || 1),
      defaultDataRate: Number(refs.lorawanDataRateInput?.value || 3)
    };
    const devEuiHex = refs.lorawanDevEuiInput?.value?.trim();
    const joinEuiHex = refs.lorawanJoinEuiInput?.value?.trim();
    const appKeyHex = refs.lorawanAppKeyInput?.value?.trim();
    if (devEuiHex) params.devEuiHex = devEuiHex;
    if (joinEuiHex) params.joinEuiHex = joinEuiHex;
    if (appKeyHex) params.appKeyHex = appKeyHex;
    await requestDevice("set_lorawan", params, 30000);
    await refreshLorawanInfo();
  }

  async function linkDevEui() {
    const deviceId = getCurrentDeviceId();
    const devEui = (refs.linkDevEuiInput?.value || state.lorawanInfo?.config?.devEuiHex || "").trim();
    if (!deviceId) throw new Error("Brak aktywnego deviceId.");
    if (!devEui) throw new Error("Podaj DevEUI do powiązania.");
    const response = await fetchJson(`/devices/${encodeURIComponent(deviceId)}/lorawan`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devEui })
    });
    addLog("indexer", "DevEUI linked in indexer", response);
  }

  async function exportBackup() {
    const passphrase = refs.backupPassphraseInput?.value || "";
    if (!passphrase) throw new Error("Podaj hasło backupu przed eksportem.");
    const response = await requestDevice("export_backup", { passphrase }, 30000);
    if (refs.backupJsonTextarea) refs.backupJsonTextarea.value = prettyJson(response);
  }

  async function importBackup() {
    const passphrase = refs.backupImportPassphraseInput?.value || "";
    if (!passphrase) throw new Error("Podaj hasło importu backupu.");
    const backup = JSON.parse(refs.backupJsonTextarea?.value || "{}");
    const response = await requestDevice("import_backup", { passphrase, backup, overwrite: true }, 30000);
    state.deviceInfo = response.device || state.deviceInfo;
    renderAll();
  }

  async function joinLorawan() {
    await requestDevice("join_lorawan", {}, TIMEOUTS.join_lorawan);
    for (let attempt = 0; attempt < 10; attempt += 1) {
      await delay(4000);
      const info = await refreshLorawanInfo();
      if (info.runtime?.joined) {
        addLog("device", "LoRaWAN join completed");
        return;
      }
    }
    addLog("warn", "Join started, but joined=true did not appear yet. Check ChirpStack and radio status.");
  }

  async function prepareDeploy() {
    const warnings = getDeployWarnings();
    enforceWarnings(warnings);
    const response = await requestDevice("prepare_deploy", {
      tick: normalizeTick(refs.deployTickInput?.value || ""),
      maxSupply: refs.deployMaxSupplyInput?.value?.trim() || "0",
      limitPerMint: refs.deployLimitPerMintInput?.value?.trim() || "0",
      commit: false
    });
    state.lastPrepared = { type: "deploy", ...response };
    renderAll();
  }

  async function sendDeploy() {
    const warnings = getDeployWarnings();
    enforceWarnings(warnings);
    const prepared = await requestDevice("prepare_deploy", {
      tick: normalizeTick(refs.deployTickInput?.value || ""),
      maxSupply: refs.deployMaxSupplyInput?.value?.trim() || "0",
      limitPerMint: refs.deployLimitPerMintInput?.value?.trim() || "0",
      commit: false
    });
    state.lastPrepared = { type: "deploy", ...prepared };
    renderAll();
    await sendPreparedPayload(prepared);
  }

  async function prepareMint() {
    const warnings = getMintWarnings(normalizeTick(refs.mintTickInput?.value || ""), refs.mintAmountInput?.value?.trim() || "0", findToken(normalizeTick(refs.mintTickInput?.value || "")));
    enforceWarnings(warnings);
    const response = await requestDevice("prepare_mint", {
      tick: normalizeTick(refs.mintTickInput?.value || ""),
      amount: refs.mintAmountInput?.value?.trim() || "0",
      commit: false
    });
    state.lastPrepared = { type: "mint", ...response };
    renderAll();
  }

  async function sendMint() {
    const warnings = getMintWarnings(normalizeTick(refs.mintTickInput?.value || ""), refs.mintAmountInput?.value?.trim() || "0", findToken(normalizeTick(refs.mintTickInput?.value || "")));
    enforceWarnings(warnings);
    const prepared = await requestDevice("prepare_mint", {
      tick: normalizeTick(refs.mintTickInput?.value || ""),
      amount: refs.mintAmountInput?.value?.trim() || "0",
      commit: false
    });
    state.lastPrepared = { type: "mint", ...prepared };
    renderAll();
    await sendPreparedPayload(prepared);
  }

  async function prepareTransfer() {
    const warnings = getTransferWarnings();
    enforceWarnings(warnings);
    const response = await requestDevice("prepare_transfer", {
      tick: normalizeTick(refs.transferTickInput?.value || ""),
      amount: refs.transferAmountInput?.value?.trim() || "0",
      toDeviceId: refs.transferRecipientInput?.value?.trim() || "",
      commit: false
    });
    state.lastPrepared = { type: "transfer", ...response };
    renderAll();
  }

  async function sendTransfer() {
    const warnings = getTransferWarnings();
    enforceWarnings(warnings);
    const prepared = await requestDevice("prepare_transfer", {
      tick: normalizeTick(refs.transferTickInput?.value || ""),
      amount: refs.transferAmountInput?.value?.trim() || "0",
      toDeviceId: refs.transferRecipientInput?.value?.trim() || "",
      commit: false
    });
    state.lastPrepared = { type: "transfer", ...prepared };
    renderAll();
    await sendPreparedPayload(prepared);
  }

  async function prepareConfig() {
    const response = await requestDevice("prepare_config", {
      autoMintEnabled: Boolean(refs.configAutoMintEnabledInput?.checked),
      autoMintIntervalSeconds: Number(refs.configAutoMintIntervalInput?.value || 1800),
      commit: false
    });
    state.lastPrepared = { type: "config", ...response };
    renderAll();
  }

  async function sendConfig() {
    const prepared = await requestDevice("prepare_config", {
      autoMintEnabled: Boolean(refs.configAutoMintEnabledInput?.checked),
      autoMintIntervalSeconds: Number(refs.configAutoMintIntervalInput?.value || 1800),
      commit: false
    });
    state.lastPrepared = { type: "config", ...prepared };
    renderAll();
    await sendPreparedPayload(prepared);
  }

  async function sendPreparedPayload(prepared) {
    const radio = await refreshLorawanInfo();
    const runtime = radio.runtime || radio.lorawanRuntime;
    const config = radio.config || state.deviceInfo?.lorawan;
    if (!runtime?.configured) throw new Error("Radio nie jest skonfigurowane. Najpierw zapisz LoRaWAN.");
    if (!runtime.hardwareReady || !runtime.initialized) throw new Error("Radio nie jest gotowe po restarcie. Odczekaj chwilę, pobierz stan radia i w razie potrzeby zrób join.");
    if (!runtime.joined) throw new Error("Radio nie jest joined. Zrób join przed wysyłką.");

    const response = await requestDevice("lorawan_send", {
      payloadHex: prepared.payloadHex,
      port: config?.appPort || 1,
      confirmed: Boolean(config?.confirmedUplink),
      commitNonce: true,
      nonceToCommit: prepared.nonce
    }, TIMEOUTS.lorawan_send);

    state.lastSendAt = new Date().toISOString();
    writeStorage(STORAGE.lastSendAt, state.lastSendAt);
    addLog("tx", "lorawan_send accepted", response);
    renderAll();

    setTimeout(() => {
      void Promise.allSettled([refreshLorawanInfo(), loadPortfolioAndHistory(), loadTokens()]);
    }, 4000);
  }

  async function sendRawCommand() {
    const payload = JSON.parse(refs.rawCommandTextarea?.value || "{}");
    const response = await sendDevicePayload(payload, TIMEOUTS.default, payload.command || payload.method || "raw");
    addLog("rx", "Raw response", response);
  }

  function handleSaveProfile() {
    const tick = normalizeTick(refs.profileTickInput?.value || "");
    const amount = refs.profileAmountInput?.value?.trim() || "";
    if (!tick || !amount) {
      addLog("error", "Profil wymaga tick i amount.");
      return;
    }

    const profileId = refs.profileNameInput?.dataset.editingId || `profile-${Date.now()}`;
    const profile = {
      id: profileId,
      name: refs.profileNameInput?.value?.trim() || `${tick} / ${amount}`,
      tick,
      amount,
      intervalMinutes: Number(refs.profileIntervalInput?.value || 30),
      enabled: Boolean(refs.profileEnabledInput?.checked)
    };

    const existingIndex = state.profiles.findIndex((item) => item.id === profileId);
    if (existingIndex >= 0) state.profiles.splice(existingIndex, 1, profile);
    else state.profiles.push(profile);
    clearProfileEditor(false);
    renderAll();
    addLog("device", "Profile saved", profile);
  }

  function clearProfileEditor(render = true) {
    if (refs.profileNameInput) {
      refs.profileNameInput.value = "";
      delete refs.profileNameInput.dataset.editingId;
    }
    if (refs.profileTickInput) refs.profileTickInput.value = "LORA";
    if (refs.profileAmountInput) refs.profileAmountInput.value = "100";
    if (refs.profileIntervalInput) refs.profileIntervalInput.value = "30";
    if (refs.profileEnabledInput) refs.profileEnabledInput.checked = true;
    if (render) renderAll();
  }

  async function syncProfiles(broadcast) {
    state.scheduler.enabled = Boolean(refs.profileQueueEnabledInput?.checked);
    state.scheduler.intervalMinutes = Number(refs.profileQueueIntervalInput?.value || 30);
    saveJson(STORAGE.scheduler, state.scheduler);
    const firstActiveProfile = state.profiles.find((profile) => profile.enabled) || state.profiles[0] || null;
    if (refs.configAutoMintEnabledInput) refs.configAutoMintEnabledInput.checked = state.scheduler.enabled && state.profiles.some((profile) => profile.enabled);
    if (refs.configAutoMintIntervalInput) refs.configAutoMintIntervalInput.value = String(Math.max(30, Number(state.scheduler.intervalMinutes || 30) * 60));

    const response = await requestDevice("set_config", {
      autoMintEnabled: state.scheduler.enabled && state.profiles.some((profile) => profile.enabled),
      autoMintIntervalSeconds: Math.max(30, Number(state.scheduler.intervalMinutes || 30) * 60),
      ...(firstActiveProfile ? {
        defaultTick: firstActiveProfile.tick,
        defaultMintAmount: firstActiveProfile.amount
      } : {}),
      profiles: state.profiles.map((profile) => ({
        tick: profile.tick,
        amount: profile.amount,
        enabled: profile.enabled
      }))
    }, 30000);

    if (response) state.deviceInfo = { ...(state.deviceInfo || {}), config: response };
    await refreshDeviceInfo().catch(() => {});
    if (broadcast) await sendConfig();
    else addLog("device", "Profiles synced to device", response);
    renderAll();
  }

  async function stopProfiles() {
    if (refs.profileQueueEnabledInput) refs.profileQueueEnabledInput.checked = false;
    state.scheduler.enabled = false;
    await syncProfiles(false);
  }

  function handleProfileListClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const profile = state.profiles.find((item) => item.id === button.dataset.id);
    if (!profile) return;

    switch (button.dataset.action) {
      case "use-profile":
        if (refs.profileNameInput) {
          refs.profileNameInput.value = profile.name || "";
          refs.profileNameInput.dataset.editingId = profile.id;
        }
        if (refs.profileTickInput) refs.profileTickInput.value = profile.tick;
        if (refs.profileAmountInput) refs.profileAmountInput.value = profile.amount;
        if (refs.profileIntervalInput) refs.profileIntervalInput.value = String(profile.intervalMinutes || 30);
        if (refs.profileEnabledInput) refs.profileEnabledInput.checked = Boolean(profile.enabled);
        if (refs.mintTickInput) refs.mintTickInput.value = profile.tick;
        if (refs.mintAmountInput) refs.mintAmountInput.value = profile.amount;
        break;
      case "toggle-profile":
        profile.enabled = !profile.enabled;
        break;
      case "move-up":
        moveProfile(profile.id, -1);
        break;
      case "move-down":
        moveProfile(profile.id, 1);
        break;
      case "remove-profile":
        state.profiles = state.profiles.filter((item) => item.id !== profile.id);
        break;
      default:
        break;
    }

    renderAll();
  }

  function handleTokenLibraryClick(event) {
    const button = event.target.closest("button[data-action='use-token']");
    if (!button) return;
    const token = findToken(button.dataset.tick || "");
    if (!token) return;
    applyTokenToForms(token);
    renderOperations();
  }

  function handleKnownDevicesClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const deviceId = button.dataset.id;
    if (!deviceId) return;

    if (button.dataset.action === "remove-device") {
      state.knownDevices = state.knownDevices.filter((item) => item.deviceId !== deviceId);
      saveJson(STORAGE.knownDevices, state.knownDevices);
      renderAll();
      return;
    }

    if (button.dataset.action === "use-device") {
      const entry = state.knownDevices.find((item) => item.deviceId === deviceId);
      if (!entry) return;
      state.deviceInfo = {
        ...(state.deviceInfo || {}),
        deviceId: entry.deviceId,
        publicKeyHex: entry.publicKeyHex || state.deviceInfo?.publicKeyHex || "",
        nextNonce: state.deviceInfo?.nextNonce ?? null,
        config: state.deviceInfo?.config || null
      };
      renderAll();
      void loadPortfolioAndHistory();
    }
  }

  function handleQuickPickChange() {
    const token = findToken(refs.tokenQuickPick?.value || "");
    if (!token) return;
    applyTokenToForms(token);
    renderOperations();
  }

  function applyTokenToForms(token) {
    if (refs.mintTickInput) refs.mintTickInput.value = token.tick;
    if (refs.transferTickInput) refs.transferTickInput.value = token.tick;
    if (refs.deployTickInput) refs.deployTickInput.value = token.tick;
    if (refs.deployMaxSupplyInput) refs.deployMaxSupplyInput.value = token.maxSupply;
    if (refs.deployLimitPerMintInput) refs.deployLimitPerMintInput.value = token.limitPerMint;
    if (refs.mintAmountInput) refs.mintAmountInput.value = token.limitPerMint;
    if (refs.tokenTickInput) refs.tokenTickInput.value = token.tick;
    if (refs.balanceTickInput) refs.balanceTickInput.value = token.tick;
    if (refs.transactionsTickInput) refs.transactionsTickInput.value = token.tick;
  }

  function moveProfile(profileId, delta) {
    const index = state.profiles.findIndex((item) => item.id === profileId);
    if (index < 0) return;
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= state.profiles.length) return;
    const [profile] = state.profiles.splice(index, 1);
    state.profiles.splice(nextIndex, 0, profile);
  }

  async function connectDevice() {
    if (!("serial" in navigator)) throw new Error("Ta przeglądarka nie wspiera Web Serial.");
    if (state.port) {
      addLog("device", "Urządzenie jest już podłączone.");
      return;
    }
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200, bufferSize: 4096 });
    state.port = port;
    state.disconnecting = false;
    addLog("device", "Serial port connected.");
    renderAll();
    void startReadLoop();
    await delay(1200);
    await refreshDeviceState();
  }

  async function disconnectDevice(logIt) {
    if (!state.port) return;
    state.disconnecting = true;
    for (const pending of state.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(new Error("Serial port disconnected."));
    }
    state.pending.clear();
    try {
      if (state.reader) await state.reader.cancel();
    } catch (_error) {
      // ignore
    }
    try {
      await state.port.close();
    } catch (_error) {
      // ignore
    }
    cleanupPortState();
    if (logIt) addLog("device", "Serial port disconnected.");
  }

  async function startReadLoop() {
    if (!state.port?.readable) return;
    const decoder = new TextDecoder();
    state.reader = state.port.readable.getReader();
    let buffer = "";

    try {
      while (state.port && state.reader) {
        const { value, done } = await state.reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        while (buffer.includes("\n")) {
          const lineBreakIndex = buffer.indexOf("\n");
          const line = buffer.slice(0, lineBreakIndex).replace(/\r$/, "");
          buffer = buffer.slice(lineBreakIndex + 1);
          handleSerialLine(line);
        }
      }
    } catch (error) {
      if (!state.disconnecting) addLog("error", `Serial read failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      try {
        state.reader?.releaseLock();
      } catch (_error) {
        // ignore
      }
      state.reader = null;
      if (!state.disconnecting) {
        cleanupPortState();
        addLog("device", "Serial port disconnected.");
      }
      renderAll();
    }
  }

  function cleanupPortState() {
    state.port = null;
    state.reader = null;
    state.disconnecting = false;
  }

  async function requestDevice(command, params, timeout) {
    const payload = { id: `req-${state.requestId++}`, command, params: params || {} };
    const response = await sendDevicePayload(payload, timeout || TIMEOUTS[command] || TIMEOUTS.default, command);
    if (response.ok === false) {
      const error = new Error(response.error?.message || `Command ${command} failed`);
      error.code = response.error?.code || "device_command_failed";
      throw error;
    }
    return response.result || {};
  }

  async function sendDevicePayload(payload, timeout, label) {
    if (!state.port?.writable) throw new Error("Urządzenie nie jest podłączone.");
    const writer = state.port.writable.getWriter();
    const encoder = new TextEncoder();
    const serialized = JSON.stringify(payload);
    addLog("tx", label || payload.command || payload.method || "raw", payload);

    const responsePromise = new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        state.pending.delete(payload.id);
        reject(new Error(`Timeout waiting for ${label || payload.command || "response"}`));
      }, timeout || TIMEOUTS.default);
      state.pending.set(payload.id, { resolve, reject, timer, label: label || payload.command || payload.method || "raw" });
    });

    try {
      await writer.write(encoder.encode(`${serialized}\n`));
    } finally {
      writer.releaseLock();
    }

    return responsePromise;
  }

  function handleSerialLine(line) {
    if (!line) return;
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch (_error) {
      addLog("serial", line);
      return;
    }

    if (parsed.id && state.pending.has(parsed.id)) {
      const pending = state.pending.get(parsed.id);
      clearTimeout(pending.timer);
      state.pending.delete(parsed.id);
      if (parsed.ok === false) addLog("error", `${pending.label} failed`, parsed.error);
      else addLog("rx", `${pending.label} ok`, parsed.result);
      pending.resolve(parsed);
      return;
    }

    if (parsed.type === "boot") {
      addLog("device", "Boot event", parsed);
      return;
    }
    if (parsed.ok === false) {
      addLog("error", parsed.error?.message || "Device returned an error", parsed.error);
      return;
    }
    addLog("event", "Device event", parsed);
  }

  async function fetchJson(path, options = {}) {
    const response = await fetch(`${state.indexerBaseUrl}${path}`, options);
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) throw new Error(data?.error?.message || `${response.status} ${response.statusText}`);
    return data;
  }

  function getCurrentDeviceId() {
    return state.deviceInfo?.deviceId || state.publicKeyInfo?.deviceId || state.knownDevices[0]?.deviceId || "";
  }

  function syncIndexerLookupFields() {
    const deviceId = getCurrentDeviceId();
    if (refs.balanceDeviceIdInput && !refs.balanceDeviceIdInput.value) refs.balanceDeviceIdInput.value = deviceId;
    if (refs.transactionsDeviceIdInput && !refs.transactionsDeviceIdInput.value) refs.transactionsDeviceIdInput.value = deviceId;
    const config = state.lorawanInfo?.config || state.deviceInfo?.lorawan;
    if (refs.linkDevEuiInput && !refs.linkDevEuiInput.value && config?.devEuiHex) refs.linkDevEuiInput.value = config.devEuiHex;
    if (refs.lorawanDevEuiInput && !refs.lorawanDevEuiInput.value && config?.devEuiHex) refs.lorawanDevEuiInput.value = config.devEuiHex;
    if (refs.lorawanJoinEuiInput && !refs.lorawanJoinEuiInput.value && config?.joinEuiHex) refs.lorawanJoinEuiInput.value = config.joinEuiHex;
    if (refs.lorawanAppPortInput && config?.appPort != null) refs.lorawanAppPortInput.value = String(config.appPort);
    if (refs.lorawanDataRateInput && config?.defaultDataRate != null) refs.lorawanDataRateInput.value = String(config.defaultDataRate);
    if (refs.lorawanAutoDevEuiInput) refs.lorawanAutoDevEuiInput.checked = Boolean(config?.autoDevEui);
    if (refs.lorawanAdrInput) refs.lorawanAdrInput.checked = Boolean(config?.adr);
    if (refs.lorawanConfirmedInput) refs.lorawanConfirmedInput.checked = Boolean(config?.confirmedUplink);
    if (refs.configAutoMintEnabledInput) refs.configAutoMintEnabledInput.checked = Boolean(state.deviceInfo?.config?.autoMintEnabled);
    if (refs.configAutoMintIntervalInput && state.deviceInfo?.config?.autoMintIntervalSeconds != null) refs.configAutoMintIntervalInput.value = String(state.deviceInfo.config.autoMintIntervalSeconds);
  }

  function getDeployWarnings() {
    const tick = normalizeTick(refs.deployTickInput?.value || "");
    const maxSupply = safeBigInt(refs.deployMaxSupplyInput?.value || "0");
    const limitPerMint = safeBigInt(refs.deployLimitPerMintInput?.value || "0");
    const existing = findToken(tick);
    const warnings = [];
    if (!tick) warnings.push({ blocking: true, message: "Tick deploy musi być ustawiony." });
    if (maxSupply <= 0n) warnings.push({ blocking: true, message: "maxSupply musi być większe od zera." });
    if (limitPerMint <= 0n) warnings.push({ blocking: true, message: "limitPerMint musi być większe od zera." });
    if (limitPerMint > maxSupply) warnings.push({ blocking: true, message: "limitPerMint nie może przekraczać maxSupply." });
    if (existing) warnings.push({ blocking: true, message: `Ticker ${tick} jest już wdrożony. Duplikat deploy nie zostanie uznany przez indexer.` });
    return warnings;
  }

  function getMintWarnings(tick, amountText, token) {
    const amount = safeBigInt(amountText || "0");
    const warnings = [];
    if (!tick) {
      warnings.push({ blocking: true, message: "Tick mintu jest pusty." });
      return warnings;
    }
    if (amount <= 0n) warnings.push({ blocking: true, message: "Ilość mintu musi być większa od zera." });
    if (!token) {
      warnings.push({ blocking: true, message: `Ticker ${tick} nie jest wdrożony w indexerze. Taki mint najpewniej nie zostanie zaindeksowany.` });
      return warnings;
    }
    const limit = safeBigInt(token.limitPerMint);
    const total = safeBigInt(token.totalSupply);
    const maxSupply = safeBigInt(token.maxSupply);
    const remaining = maxSupply - total;
    if (amount > limit) warnings.push({ blocking: true, message: `Mint ${amount} przekracza limitPerMint=${limit}. Indexer odrzuci taką wiadomość.` });
    if (remaining <= 0n) warnings.push({ blocking: true, message: `Token ${tick} osiągnął już max supply. Dalszy mint nie będzie indeksowany.` });
    else if (amount > remaining) warnings.push({ blocking: true, message: `Pozostało tylko ${remaining}. Mint ${amount} nie zmieści się w max supply.` });
    return warnings;
  }

  function getTransferWarnings() {
    const warnings = [];
    const tick = normalizeTick(refs.transferTickInput?.value || "");
    const amount = safeBigInt(refs.transferAmountInput?.value || "0");
    const recipient = refs.transferRecipientInput?.value?.trim() || "";
    if (!tick) warnings.push({ blocking: true, message: "Tick transferu jest pusty." });
    if (amount <= 0n) warnings.push({ blocking: true, message: "Ilość transferu musi być większa od zera." });
    if (!/^[0-9a-fA-F]{16}$/.test(recipient)) warnings.push({ blocking: true, message: "Recipient deviceId musi mieć dokładnie 16 znaków hex." });
    if (!findToken(tick)) warnings.push({ blocking: true, message: `Ticker ${tick} nie istnieje w indexerze.` });
    return warnings;
  }

  function enforceWarnings(warnings) {
    const blocking = warnings.filter((warning) => warning.blocking);
    if (blocking.length && !refs.allowRiskySendInput?.checked) {
      throw new Error(blocking.map((warning) => warning.message).join(" "));
    }
  }

  function getKnownTokens() {
    const byTick = new Map();

    for (const token of state.tokenCatalog) {
      if (token?.tick) byTick.set(token.tick, token);
    }

    for (const entry of state.portfolio) {
      if (entry?.tick && entry?.token && !byTick.has(entry.tick)) {
        byTick.set(entry.tick, { ...entry.token, tick: entry.tick });
      }
    }

    return Array.from(byTick.values()).sort((left, right) => left.tick.localeCompare(right.tick));
  }

  function findToken(tick) {
    return getKnownTokens().find((token) => token.tick === normalizeTick(tick));
  }

  function upsertKnownDevice(entry) {
    if (!entry?.deviceId) return;
    const next = { deviceId: String(entry.deviceId).toLowerCase(), publicKeyHex: entry.publicKeyHex || "", updatedAt: new Date().toISOString() };
    const index = state.knownDevices.findIndex((device) => device.deviceId === next.deviceId);
    if (index >= 0) state.knownDevices.splice(index, 1, { ...state.knownDevices[index], ...next });
    else state.knownDevices.unshift(next);
    state.knownDevices = state.knownDevices.slice(0, 10);
    saveJson(STORAGE.knownDevices, state.knownDevices);
  }

  function addLog(kind, message, payload) {
    if (!refs.activityLog) return;
    playSoundFor(kind);
    const entry = document.createElement("article");
    entry.className = "log-entry";
    const head = document.createElement("div");
    head.className = "log-entry__head";
    const kindNode = document.createElement("strong");
    kindNode.className = "log-entry__kind";
    kindNode.textContent = kind;
    const timeNode = document.createElement("span");
    timeNode.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    head.appendChild(kindNode);
    head.appendChild(timeNode);
    entry.appendChild(head);
    const messageNode = document.createElement("div");
    messageNode.className = "log-entry__message";
    messageNode.textContent = message;
    entry.appendChild(messageNode);
    if (payload !== undefined) {
      const pre = document.createElement("pre");
      pre.textContent = prettyJson(payload);
      entry.appendChild(pre);
    }
    refs.activityLog.prepend(entry);
    while (refs.activityLog.children.length > 120) {
      refs.activityLog.removeChild(refs.activityLog.lastChild);
    }
  }

  function playSoundFor(kind) {
    if (!state.soundEnabled) return;
    const presets = { error: [220, 0.18], warn: [320, 0.12], tx: [660, 0.08], rx: [560, 0.08], device: [480, 0.06], indexer: [520, 0.06] };
    const [frequency, duration] = presets[kind] || [420, 0.05];
    try {
      if (!state.audioContext) state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const context = state.audioContext;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.0001;
      oscillator.connect(gain);
      gain.connect(context.destination);
      const now = context.currentTime;
      gain.gain.exponentialRampToValueAtTime(0.025, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.02);
    } catch (_error) {
      // ignore
    }
  }

  function setBadge(node, status, text) {
    if (!node) return;
    node.className = `badge badge--${status}`;
    node.textContent = text;
  }

  function renderCallout(node, tone, text) {
    if (!node) return;
    node.className = `callout callout--${tone}`;
    node.textContent = text;
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function readStorage(key, fallback) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_error) {
      // ignore
    }
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_error) {
      // ignore
    }
  }

  function normalizeUrl(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function normalizeTick(value) {
    return String(value || "").trim().toUpperCase().slice(0, 4);
  }

  function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }

  function safeBigInt(value) {
    try {
      return BigInt(String(value || "0"));
    } catch (_error) {
      return 0n;
    }
  }

  function estimateDc(bytes) {
    return Math.max(1, Math.ceil(Number(bytes || 0) / 24));
  }

  function prettyJson(value) {
    return JSON.stringify(redactSecrets(value), null, 2);
  }

  function redactSecrets(value) {
    if (Array.isArray(value)) return value.map(redactSecrets);
    if (value && typeof value === "object") {
      const result = {};
      for (const [key, nestedValue] of Object.entries(value)) {
        result[key] = SECRET_KEYS.has(key) ? maskSecret(String(nestedValue || "")) : redactSecrets(nestedValue);
      }
      return result;
    }
    return value;
  }

  function maskSecret(value) {
    const text = String(value || "");
    if (!text) return "";
    if (text.length <= 12) return `${text.slice(0, 2)}...${text.slice(-2)}`;
    return `${text.slice(0, 4)}...${text.slice(-4)}`;
  }

  function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  }

  function formatLastSend(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return `${formatDateTime(value)} (${formatRelative(Date.now(), date.getTime())})`;
  }

  function formatRelative(nowMs, thenMs) {
    const deltaMs = Math.max(0, nowMs - thenMs);
    const seconds = Math.round(deltaMs / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    return `${hours}h ago`;
  }

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
