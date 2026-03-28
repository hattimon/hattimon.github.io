(() => {
  "use strict";

  const STORAGE = {
    language: "lora20.dashboard.language",
    theme: "lora20.dashboard.theme",
    sound: "lora20.dashboard.soundEnabled",
    logDockCollapsed: "lora20.dashboard.logDockCollapsed",
    indexerUrl: "lora20.dashboard.indexerBaseUrl",
    deviceBridgeUrl: "lora20.dashboard.deviceBridgeUrl",
    deviceWifiSsid: "lora20.dashboard.deviceWifiSsid",
    deviceWifiPassword: "lora20.dashboard.deviceWifiPassword",
    deviceAuthToken: "lora20.dashboard.deviceAuthToken",
    profiles: "lora20.dashboard.profiles",
    scheduler: "lora20.dashboard.scheduler",
    knownDevices: "lora20.dashboard.knownDevices",
    lastSendAt: "lora20.dashboard.lastSuccessfulSendAt"
  };

  const DEFAULTS = {
    language: "pl",
    theme: "dark",
    indexerUrl: "https://lora20.hattimon.pl",
    deviceBridgeUrl: "http://192.168.4.1",
    deviceWifiSsid: "",
    deviceWifiPassword: "",
    deviceAuthToken: "",
    profiles: [],
    scheduler: { enabled: false, intervalMinutes: 30 }
  };

  const PLATFORM_COPY_COUNT = 2;

  const TIMEOUTS = {
    default: 15000,
    get_info: 20000,
    get_lorawan: 20000,
    set_config: 60000,
    prepare_deploy: 30000,
    prepare_mint: 30000,
    prepare_transfer: 30000,
    prepare_config: 30000,
    join_lorawan: 70000,
    lorawan_send: 90000
  };

  const SECRET_KEYS = new Set([
    "appKeyHex",
    "licenseHex",
    "passphrase",
    "ciphertextHex",
    "tagHex",
    "saltHex",
    "ivHex",
    "auth",
    "rpcToken",
    "wifiPassword"
  ]);

  const I18N_EN = {
    "hero.eyebrow": "lora20 control plane",
    "hero.title": "Lightweight dashboard for sending inscriptions through Heltec V4 and LoRaWAN.",
    "hero.lead": "The panel guides you from onboarding and radio configuration to deploy, mint, transfer and balance checks.",
    "hero.chipOne": "Web Serial + HTTPS",
    "hero.chipTwo": "Heltec V4 onboarding",
    "hero.chipThree": "Sticky log dock",
    "mintStream.kicker": "Mint stream",
    "mintStream.title": "Latest mint operations",
    "mintStream.hint": "Click an entry to open witness details and the signal-flow diagram.",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.sound": "Sounds",
    "settings.indexerUrl": "Public indexer URL",
    "settings.deviceBridgeUrl": "Device bridge URL (Wi-Fi)",
    "settings.deviceWifiSsid": "Device Wi-Fi SSID",
    "settings.deviceWifiPassword": "Device Wi-Fi password",
    "settings.deviceAuthToken": "Device auth token",
    "actions.saveUrl": "Save URL",
    "actions.saveConnectivity": "Apply connectivity",
    "actions.connectUsb": "Connect USB",
    "actions.connectBle": "Connect Bluetooth",
    "actions.connectWifi": "Connect Wi-Fi",
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
    "actions.sendConfig": "Prepare and send",
    "actions.saveLicense": "Save license",
    "actions.saveRadio": "Save radio",
    "actions.linkDevEui": "Link DevEUI",
    "actions.exportBackup": "Export backup",
    "actions.importBackup": "Import backup",
    "actions.sendRaw": "Send raw JSON",
    "actions.saveProfile": "Save profile",
    "actions.clearProfile": "Clear editor",
    "actions.syncQueue": "Sync queue",
    "actions.syncBroadcast": "Sync + broadcast",
    "actions.stopQueue": "Stop loop",
    "sections.overviewKicker": "Overview",
    "sections.overviewTitle": "Most important things first",
    "sections.deviceKicker": "Device",
    "sections.deviceTitle": "Current node and known devices",
    "sections.knownDevicesKicker": "Remembered",
    "sections.knownDevicesTitle": "Configured devices",
    "sections.radioKicker": "Radio",
    "sections.radioTitle": "LoRaWAN readiness",
    "sections.portfolioKicker": "Portfolio",
    "sections.portfolioTitle": "Balances and recent events",
    "sections.tokensKicker": "Tokens",
    "sections.tokensTitle": "Deployed tickers and form autofill",
    "sections.operationsKicker": "Operations",
    "sections.operationsTitle": "Deploy, mint, transfer and config",
    "sections.profilesKicker": "Profiles",
    "sections.profilesTitle": "Mint library and round-robin queue",
    "sections.onboardingKicker": "Onboarding",
    "sections.onboardingTitle": "New device step by step",
    "sections.educationKicker": "Education",
    "sections.educationTitle": "How it works and what it does not promise",
    "sections.advancedKicker": "Advanced",
    "sections.advancedTitle": "Radio, backup and raw JSON",
    "overview.deployedTokens": "Deployed tokens",
    "overview.portfolioEntries": "Portfolio entries",
    "overview.recentEvents": "Recent events",
    "overview.activeProfiles": "Active profiles",
    "overview.lastSend": "Last send",
    "device.deviceId": "Device ID",
    "device.nextNonce": "Next nonce",
    "device.autoMint": "Auto-mint",
    "device.defaultMint": "Default mint",
    "radio.joined": "Joined",
    "radio.port": "Port",
    "radio.event": "Last event",
    "radio.devEui": "DevEUI",
    "portfolio.balancesTitle": "Tokens in portfolio",
    "portfolio.historyTitle": "Recent events",
    "tokens.search": "Search ticker",
    "tokens.quickPick": "Pick for forms",
    "operations.focusKicker": "Most used",
    "operations.mintTitle": "Mint token",
    "operations.tick": "Tick",
    "operations.amount": "Amount",
    "operations.payloadSize": "Payload",
    "operations.dcCost": "Est. DC",
    "operations.protocol": "Protocol",
    "operations.allowRisky": "Allow send despite predicted indexer error",
    "operations.deployTitle": "Deploy token",
    "operations.maxSupply": "Max supply",
    "operations.limitPerMint": "Limit per mint",
    "operations.transferTitle": "Transfer token",
    "operations.recipient": "Recipient deviceId",
    "operations.configTitle": "Config inscription",
    "operations.autoMintEnabled": "Auto-mint enabled",
    "operations.intervalSeconds": "Interval (seconds)",
    "operations.preparedPreview": "Preview of the last prepared payload",
    "profiles.name": "Name",
    "profiles.amount": "Mint amount",
    "profiles.interval": "Preferred interval (min)",
    "profiles.include": "Add to active queue",
    "profiles.loopEnabled": "Loop enabled",
    "profiles.loopInterval": "Loop interval (min)",
    "advanced.radioConfig": "LoRaWAN config and Heltec license",
    "advanced.license": "Heltec license",
    "advanced.autoDevEui": "Auto DevEUI",
    "advanced.adr": "ADR",
    "advanced.confirmed": "Confirmed uplink",
    "advanced.devEui": "DevEUI",
    "advanced.joinEui": "JoinEUI",
    "advanced.appKey": "AppKey",
    "advanced.appPort": "App port",
    "advanced.dataRate": "Data rate",
    "advanced.indexerBinding": "DevEUI linking",
    "advanced.devEuiLink": "DevEUI to link",
    "advanced.backupTitle": "Backup and restore",
    "advanced.exportPassphrase": "Export passphrase",
    "advanced.importPassphrase": "Import passphrase",
    "advanced.rawTitle": "Raw commands and indexer debug",
    "logs.kicker": "Event report",
    "logs.title": "Activity log",
    "witness.kicker": "Signal diagram",
    "witness.close": "Close"
  };

  const I18N_PL = {
    "hero.eyebrow": "lora20 control plane",
    "hero.title": "Lekki panel do wysyłania inskrypcji przez Heltec V4 i LoRaWAN.",
    "hero.lead": "Panel prowadzi od onboardingu i konfiguracji radia do deploy, mint, transfer oraz odczytu balansu.",
    "hero.chipOne": "Web Serial + HTTPS",
    "hero.chipTwo": "Onboarding Heltec V4",
    "hero.chipThree": "Sticky log dock",
    "mintStream.kicker": "Mint stream",
    "mintStream.title": "Ostatnie operacje mint",
    "mintStream.hint": "Kliknij wpis, aby otworzyć szczegóły witness i diagram przepływu sygnału.",
    "settings.language": "Język",
    "settings.theme": "Motyw",
    "settings.sound": "Dźwięki",
    "settings.indexerUrl": "Publiczny adres indexera",
    "settings.deviceBridgeUrl": "Adres mostka urządzenia (Wi‑Fi)",
    "settings.deviceWifiSsid": "SSID Wi‑Fi urządzenia",
    "settings.deviceWifiPassword": "Hasło Wi‑Fi urządzenia",
    "settings.deviceAuthToken": "Token autoryzacji urządzenia",
    "actions.saveUrl": "Zapisz URL",
    "actions.saveConnectivity": "Zastosuj łączność",
    "actions.connectUsb": "Połącz USB",
    "actions.connectBle": "Połącz Bluetooth",
    "actions.connectWifi": "Połącz Wi‑Fi",
    "actions.disconnect": "Rozłącz",
    "actions.refresh": "Odśwież stan",
    "actions.pullInfo": "Pobierz info",
    "actions.publicKey": "Odczytaj klucz",
    "actions.generateKey": "Wygeneruj klucz",
    "actions.register": "Zarejestruj w indexerze",
    "actions.pullRadio": "Pobierz radio",
    "actions.join": "Join LoRaWAN",
    "actions.reloadPortfolio": "Odśwież portfolio",
    "actions.reloadHistory": "Odśwież historię",
    "actions.reloadTokens": "Odśwież tokeny",
    "actions.checkHealth": "Sprawdź indexer",
    "actions.prepareMint": "Przygotuj mint",
    "actions.sendMint": "Przygotuj i wyślij",
    "actions.prepareDeploy": "Przygotuj deploy",
    "actions.sendDeploy": "Przygotuj i wyślij",
    "actions.prepareTransfer": "Przygotuj transfer",
    "actions.sendTransfer": "Przygotuj i wyślij",
    "actions.prepareConfig": "Przygotuj config",
    "actions.sendConfig": "Przygotuj i wyślij",
    "actions.saveLicense": "Zapisz licencję",
    "actions.saveRadio": "Zapisz radio",
    "actions.linkDevEui": "Powiąż DevEUI",
    "actions.exportBackup": "Eksportuj backup",
    "actions.importBackup": "Importuj backup",
    "actions.sendRaw": "Wyślij raw JSON",
    "actions.saveProfile": "Zapisz profil",
    "actions.clearProfile": "Wyczyść edytor",
    "actions.syncQueue": "Synchronizuj kolejkę",
    "actions.syncBroadcast": "Synchronizuj + broadcast",
    "actions.stopQueue": "Zatrzymaj pętlę",
    "sections.overviewKicker": "Przegląd",
    "sections.overviewTitle": "Najważniejsze rzeczy na start",
    "sections.deviceKicker": "Urządzenie",
    "sections.deviceTitle": "Aktualny node i znane urządzenia",
    "sections.knownDevicesKicker": "Zapamiętane",
    "sections.knownDevicesTitle": "Skonfigurowane urządzenia",
    "sections.radioKicker": "Radio",
    "sections.radioTitle": "Gotowość LoRaWAN",
    "sections.portfolioKicker": "Portfolio",
    "sections.portfolioTitle": "Balanse i ostatnie zdarzenia",
    "sections.tokensKicker": "Tokeny",
    "sections.tokensTitle": "Wdrożone tickery i wypełnianie formularzy",
    "sections.operationsKicker": "Operacje",
    "sections.operationsTitle": "Deploy, mint, transfer i config",
    "sections.profilesKicker": "Profile",
    "sections.profilesTitle": "Biblioteka mintu i kolejka round‑robin",
    "sections.onboardingKicker": "Onboarding",
    "sections.onboardingTitle": "Nowe urządzenie krok po kroku",
    "sections.educationKicker": "Edukacja",
    "sections.educationTitle": "Jak to działa i czego nie obiecuje protokół",
    "sections.advancedKicker": "Zaawansowane",
    "sections.advancedTitle": "Radio, backup i raw JSON",
    "overview.deployedTokens": "Wdrożone tokeny",
    "overview.portfolioEntries": "Pozycje w portfelu",
    "overview.recentEvents": "Ostatnie zdarzenia",
    "overview.activeProfiles": "Aktywne profile",
    "overview.lastSend": "Ostatnia wysyłka",
    "device.deviceId": "Device ID",
    "device.nextNonce": "Następny nonce",
    "device.autoMint": "Auto‑mint",
    "device.defaultMint": "Domyślny mint",
    "radio.joined": "Joined",
    "radio.port": "Port",
    "radio.event": "Ostatnie zdarzenie",
    "radio.devEui": "DevEUI",
    "portfolio.balancesTitle": "Tokeny w portfelu",
    "portfolio.historyTitle": "Ostatnie zdarzenia",
    "tokens.search": "Szukaj tickera",
    "tokens.quickPick": "Wybierz do formularzy",
    "operations.focusKicker": "Najczęściej używane",
    "operations.mintTitle": "Mint tokena",
    "operations.tick": "Tick",
    "operations.amount": "Ilość",
    "operations.payloadSize": "Payload",
    "operations.dcCost": "Szac. DC",
    "operations.protocol": "Protokół",
    "operations.allowRisky": "Pozwól wysłać mimo przewidywanego błędu indexera",
    "operations.deployTitle": "Deploy tokena",
    "operations.maxSupply": "Max supply",
    "operations.limitPerMint": "Limit per mint",
    "operations.transferTitle": "Transfer tokena",
    "operations.recipient": "Odbiorca deviceId",
    "operations.configTitle": "Config inscription",
    "operations.autoMintEnabled": "Auto‑mint włączony",
    "operations.intervalSeconds": "Interwał (sekundy)",
    "operations.preparedPreview": "Podgląd ostatnio przygotowanego payloadu",
    "profiles.name": "Nazwa",
    "profiles.amount": "Mint amount",
    "profiles.interval": "Preferowany interwał (min)",
    "profiles.include": "Dodaj do aktywnej kolejki",
    "profiles.loopEnabled": "Pętla włączona",
    "profiles.loopInterval": "Interwał pętli (min)",
    "advanced.radioConfig": "Konfiguracja LoRaWAN i licencja Heltec",
    "advanced.license": "Licencja Heltec",
    "advanced.autoDevEui": "Auto DevEUI",
    "advanced.adr": "ADR",
    "advanced.confirmed": "Confirmed uplink",
    "advanced.devEui": "DevEUI",
    "advanced.joinEui": "JoinEUI",
    "advanced.appKey": "AppKey",
    "advanced.appPort": "App port",
    "advanced.dataRate": "Data rate",
    "advanced.indexerBinding": "Powiązanie DevEUI",
    "advanced.devEuiLink": "DevEUI do powiązania",
    "advanced.backupTitle": "Backup i restore",
    "advanced.exportPassphrase": "Hasło eksportu",
    "advanced.importPassphrase": "Hasło importu",
    "advanced.rawTitle": "Surowe polecenia i debug indexera",
    "logs.kicker": "Raport zdarzeń",
    "logs.title": "Activity log",
    "witness.kicker": "Diagram sygnału",
    "witness.close": "Zamknij"
  };

  const refs = {};
  const refNames = [
    "languageSelect", "themeSelect", "soundEnabledInput", "indexerBaseUrlInput", "deviceBridgeUrlInput",
    "deviceWifiSsidInput", "deviceWifiPasswordInput", "deviceAuthTokenInput", "saveConnectivityButton", "saveIndexerButton",
    "connectUsbButton", "connectBleButton", "connectWifiButton", "disconnectButton", "refreshButton", "connectionBadge", "indexerBadge", "radioBadge",
    "mintMatrixHeading", "mintMatrixHint", "mintMatrixFeed",
    "serialSupportNotice", "overviewTokensValue", "overviewBalancesValue", "overviewEventsValue",
    "overviewProfilesValue", "overviewLastSendValue", "overviewStatusNote", "getInfoButton",
    "quickMintChecklist", "tokenLibraryStatus", "logDock", "toggleLogDockButton", "operationActionNote",
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
    "rawCommandTextarea", "sendRawCommandButton", "activityLog",
    "witnessModal", "closeWitnessModalButton", "witnessModalTitle", "witnessModalSubtitle",
    "witnessGraph", "witnessMetaList"
  ];
    const state = {
      language: readStorage(STORAGE.language, DEFAULTS.language),
      theme: readStorage(STORAGE.theme, DEFAULTS.theme),
      soundEnabled: readStorage(STORAGE.sound, "1") !== "0",
      indexerBaseUrl: normalizeUrl(readStorage(STORAGE.indexerUrl, DEFAULTS.indexerUrl)) || DEFAULTS.indexerUrl,
      deviceBridgeUrl: normalizeUrl(readStorage(STORAGE.deviceBridgeUrl, DEFAULTS.deviceBridgeUrl)) || DEFAULTS.deviceBridgeUrl,
      deviceWifiSsid: readStorage(STORAGE.deviceWifiSsid, DEFAULTS.deviceWifiSsid),
      deviceWifiPassword: readStorage(STORAGE.deviceWifiPassword, DEFAULTS.deviceWifiPassword),
      deviceAuthToken: readStorage(STORAGE.deviceAuthToken, DEFAULTS.deviceAuthToken),
      profiles: loadJson(STORAGE.profiles, DEFAULTS.profiles),
      scheduler: loadJson(STORAGE.scheduler, DEFAULTS.scheduler),
      knownDevices: loadJson(STORAGE.knownDevices, []),
      lastSendAt: readStorage(STORAGE.lastSendAt, ""),
      deviceTransport: null,
      wifiConnected: false,
      ble: null,
    tokenCatalog: [],
    portfolio: [],
    recentTransactions: [],
    tokenCatalogError: "",
    tokenCatalogErrorRaw: "",
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
    audioContext: null,
    deviceRequestChain: Promise.resolve(),
    mintMatrixHoldUntil: 0,
    mintMatrixHover: false,
    mintMatrixTopEventId: null,
    mintMatrixProgrammaticScroll: false,
    activeWitnessEventId: null
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
      if (state.deviceTransport) {
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
    refs.deviceBridgeUrlInput?.addEventListener("change", handleSaveDeviceBridgeUrl);
    wireAction(refs.saveConnectivityButton, handleSaveConnectivity);
      wireAction(refs.connectUsbButton, () => connectUsbDevice());
      wireAction(refs.connectBleButton, () => connectBleDevice());
      wireAction(refs.connectWifiButton, () => connectWifiDevice());
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
    refs.mintMatrixFeed?.addEventListener("click", handleMintMatrixClick);
    refs.mintMatrixFeed?.addEventListener("scroll", handleMintMatrixScroll);
    refs.mintMatrixFeed?.addEventListener("mouseenter", () => handleMintMatrixHover(true));
    refs.mintMatrixFeed?.addEventListener("mouseleave", () => handleMintMatrixHover(false));
    refs.closeWitnessModalButton?.addEventListener("click", closeWitnessModal);
    refs.witnessModal?.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.dataset.action === "close-witness-modal") {
        closeWitnessModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && refs.witnessModal?.classList.contains("is-open")) {
        closeWitnessModal();
      }
    });
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
      if (refs.deviceBridgeUrlInput) refs.deviceBridgeUrlInput.value = state.deviceBridgeUrl;
      if (refs.deviceWifiSsidInput) refs.deviceWifiSsidInput.value = state.deviceWifiSsid || "";
      if (refs.deviceWifiPasswordInput) refs.deviceWifiPasswordInput.value = state.deviceWifiPassword || "";
      if (refs.deviceAuthTokenInput) refs.deviceAuthTokenInput.value = state.deviceAuthToken || "";
      if (refs.profileQueueEnabledInput) refs.profileQueueEnabledInput.checked = Boolean(state.scheduler.enabled);
      if (refs.profileQueueIntervalInput) refs.profileQueueIntervalInput.value = String(state.scheduler.intervalMinutes || 30);
      if (refs.protocolVersionValue) refs.protocolVersionValue.textContent = "v1 / Ed25519 / LoRaWAN";
      applyLogDockState();
    }

  function handleLanguageChange() {
    state.language = refs.languageSelect?.value || DEFAULTS.language;
    writeStorage(STORAGE.language, state.language);
    applyLanguage();
    updateSerialSupport();
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

  function handleSaveDeviceBridgeUrl() {
    state.deviceBridgeUrl = normalizeUrl(refs.deviceBridgeUrlInput?.value) || DEFAULTS.deviceBridgeUrl;
    if (refs.deviceBridgeUrlInput) refs.deviceBridgeUrlInput.value = state.deviceBridgeUrl;
    writeStorage(STORAGE.deviceBridgeUrl, state.deviceBridgeUrl);
  }

  function handleSaveConnectivity() {
    state.deviceWifiSsid = refs.deviceWifiSsidInput?.value?.trim() || "";
    state.deviceWifiPassword = refs.deviceWifiPasswordInput?.value || "";
    state.deviceAuthToken = refs.deviceAuthTokenInput?.value || "";
    writeStorage(STORAGE.deviceWifiSsid, state.deviceWifiSsid);
    writeStorage(STORAGE.deviceWifiPassword, state.deviceWifiPassword);
    writeStorage(STORAGE.deviceAuthToken, state.deviceAuthToken);
    addLog("device", txt("Zapisano ustawienia łączności.", "Connectivity settings saved."));
    if (isDeviceConnected() && state.deviceTransport !== "wifi") {
      void applyConnectivityMode("wifi");
    }
  }

  function buildConnectivityParams(modeOverride) {
    const params = {};
    if (modeOverride) params.mode = modeOverride;
    if (state.deviceWifiSsid) params.wifiSsid = state.deviceWifiSsid;
    if (state.deviceWifiPassword) params.wifiPassword = state.deviceWifiPassword;
    if (state.deviceAuthToken) params.rpcToken = state.deviceAuthToken;
    return params;
  }

  async function applyConnectivityMode(modeOverride) {
    if (!isDeviceConnected()) return;
    const params = buildConnectivityParams(modeOverride);
    if (!Object.keys(params).length) return;
    try {
      const result = await requestDevice("set_connectivity", params, TIMEOUTS.set_config);
      addLog("device", txt("Zaktualizowano tryb łączności.", "Connectivity mode updated."), result);
    } catch (error) {
      addLog("error", error instanceof Error ? error.message : String(error));
    }
  }

  function applyLanguage() {
    document.documentElement.lang = state.language;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      const table = state.language === "en" ? I18N_EN : I18N_PL;
      node.textContent = table && table[key]
        ? table[key]
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

  function isEnglish() {
    return state.language === "en";
  }

  function txt(pl, en) {
    return isEnglish() ? en : pl;
  }

  function updateSerialSupport() {
    if (!refs.serialSupportNotice) return;
    refs.serialSupportNotice.textContent = "serial" in navigator
      ? (state.language === "en"
          ? "Before connecting over USB, close VS Code Serial Monitor, PlatformIO, MobaXterm and any app holding the COM port. You can also use Bluetooth or Wi-Fi bridge."
          : "Przed połączeniem przez USB zamknij VS Code Serial Monitor, PlatformIO, MobaXterm i inne aplikacje blokujące COM. Możesz też użyć Bluetooth albo mostka Wi‑Fi.")
      : (state.language === "en"
          ? "Web Serial is not available here. Use Bluetooth or the Wi-Fi bridge."
          : "Web Serial nie jest dostępny w tej przeglądarce. Użyj Bluetooth albo mostka Wi‑Fi.");
  }

  function renderAll() {
    renderBadges();
    renderOverview();
    renderMintMatrix();
    renderQuickMintChecklist();
    renderDevice();
    renderRadio();
    renderTokenLibrary();
    renderPortfolio();
    renderPrepared();
    renderProfiles();
    renderOnboarding();
    renderEducation();
    renderOperations();
    syncIndexerLookupFields();
    applyLogDockState();
  }

  function isDeviceConnected() {
    if (state.deviceTransport === "serial") return Boolean(state.port);
    if (state.deviceTransport === "ble") return Boolean(state.ble?.connected);
    if (state.deviceTransport === "wifi") return Boolean(state.wifiConnected);
    return false;
  }

  function getConnectionBadgeLabel() {
    if (state.deviceTransport === "serial") {
      return state.port ? txt("USB podłączony", "USB connected") : txt("USB offline", "USB offline");
    }
    if (state.deviceTransport === "ble") {
      return state.ble?.connected ? txt("Bluetooth podłączony", "Bluetooth connected") : txt("Bluetooth offline", "Bluetooth offline");
    }
    if (state.deviceTransport === "wifi") {
      return state.wifiConnected ? txt("Wi‑Fi bridge podłączony", "Wi‑Fi bridge connected") : txt("Wi‑Fi bridge offline", "Wi‑Fi bridge offline");
    }
    return txt("Brak połączenia", "No device connection");
  }

  function getConnectionBadgeTone() {
    if (state.deviceTransport === "serial") return state.port ? "connected" : "danger";
    if (state.deviceTransport === "ble") return state.ble?.connected ? "connected" : "warn";
    if (state.deviceTransport === "wifi") return state.wifiConnected ? "connected" : "warn";
    return "danger";
  }

  function renderBadges() {
    setBadge(refs.connectionBadge, getConnectionBadgeTone(), getConnectionBadgeLabel());
    if (state.indexerOnline === true) setBadge(refs.indexerBadge, "ok", txt("Indexer online", "Indexer online"));
    else if (state.indexerOnline === false) setBadge(refs.indexerBadge, "danger", txt("Indexer offline", "Indexer offline"));
    else setBadge(refs.indexerBadge, "warn", txt("Indexer sprawdzanie", "Indexer probing"));

    const runtime = state.lorawanInfo?.runtime || state.lorawanInfo?.lorawanRuntime;
    if (!runtime) setBadge(refs.radioBadge, "warn", txt("LoRa bezczynna", "LoRa idle"));
    else if (runtime.joined) setBadge(refs.radioBadge, "ok", txt("LoRa dolaczona", "LoRa joined"));
    else if (runtime.configured || runtime.initialized || runtime.hardwareReady) {
      setBadge(refs.radioBadge, "warn", txt("LoRa skonfigurowana", "LoRa configured"));
    } else setBadge(refs.radioBadge, "danger", txt("LoRa niegotowa", "LoRa not ready"));
  }

  function renderOverview() {
    setText(refs.overviewTokensValue, String(getKnownTokens().length));
    setText(refs.overviewBalancesValue, String(state.portfolio.length));
    setText(refs.overviewEventsValue, String(state.recentTransactions.length));
    setText(refs.overviewProfilesValue, String(state.profiles.filter((profile) => profile.enabled).length));
    setText(refs.overviewLastSendValue, formatLastSend(state.lastSendAt));

    const notes = [];
    if (!isDeviceConnected()) notes.push(txt("Urządzenie nie jest jeszcze podłączone.", "The device is not connected yet."));
    if (state.indexerOnline !== true) notes.push(txt("Indexer nie odpowiada lub dashboard nie może go odczytać.", "Indexer is not responding or dashboard cannot read it."));
    if (state.tokenCatalogError) notes.push(state.tokenCatalogError);
    const runtime = state.lorawanInfo?.runtime || state.lorawanInfo?.lorawanRuntime;
    if (runtime && !runtime.joined) notes.push(txt("Radio nie jest joined, więc próba wysyłki skończy się timeoutem albo odrzuceniem.", "Radio is not joined, so sending will likely timeout or be rejected."));
    if (state.lastSendAt) notes.push(txt(`Ostatnia wysyłka: ${formatDateTime(state.lastSendAt)}.`, `Last send: ${formatDateTime(state.lastSendAt)}.`));
    renderCallout(refs.overviewStatusNote, notes.length ? "warn" : "ok", notes.length ? notes.join(" ") : txt("Panel wyglada na gotowy do pracy.", "Dashboard looks ready."));
  }

  function renderMintMatrix() {
    if (refs.mintMatrixHeading) refs.mintMatrixHeading.textContent = txt("Ostatnie operacje mint", "Latest mint operations");
    if (refs.mintMatrixHint) refs.mintMatrixHint.textContent = txt(
      "Kliknij wpis, aby otworzyć szczegóły witness i diagram przepływu sygnału.",
      "Click an entry to open witness details and the signal-flow diagram."
    );

    if (!refs.mintMatrixFeed) return;
    const mintEvents = getMintEvents();

    if (!mintEvents.length) {
      refs.mintMatrixFeed.innerHTML = `
        <div class="mint-matrix__empty">
          ${escapeHtml(txt("Brak operacji mint w historii indexera.", "No mint operations in indexer history yet."))}
        </div>
      `;
      state.mintMatrixTopEventId = null;
      return;
    }

    refs.mintMatrixFeed.innerHTML = mintEvents.map((event, index) => {
      const firstWitness = getFirstWitness(event);
      const operationLabel = formatMintOperation(event);
      const nonce = getEventNonce(event);
      const operationWithNonce = nonce != null ? `${operationLabel} · nonce ${nonce}` : operationLabel;
      const timestamp = formatMatrixDateTime(event.receivedAt || event.createdAt);
      const witnessLine = txt(
        `Pierwszy świadek: "${firstWitness.name}"`,
        `First Witness by "${firstWitness.name}"`
      );
      const eventId = event.id || `mint-row-${index}`;
      return `
        <button class="mint-matrix__item" type="button" data-event-id="${escapeHtml(eventId)}" data-event-index="${index}">
          <span class="mint-matrix__op">${escapeHtml(operationWithNonce)}</span>
          <span class="mint-matrix__witness">${escapeHtml(witnessLine)}</span>
          <span class="mint-matrix__time">${escapeHtml(timestamp)}</span>
        </button>
      `;
    }).join("");

    const topEventKey = getMintEventKey(mintEvents[0], 0);
    maybeScrollMintMatrixToTop(topEventKey);
  }

  function getMintEvents() {
    return state.recentTransactions
      .filter((event) => {
        const opName = String(event?.opName || "").toUpperCase();
        const opCode = Number(event?.op);
        return opName === "MINT" || opCode === 2;
      })
      .sort((left, right) => getEventTimestamp(right) - getEventTimestamp(left))
      .slice(0, 30);
  }

  function getMintEventKey(event, fallbackIndex) {
    if (event?.id) return String(event.id);
    const nonce = getEventNonce(event);
    const tick = normalizeTick(event?.tick || "");
    const amount = event?.amount == null ? "" : String(event.amount);
    const timestamp = event?.receivedAt || event?.createdAt || event?.time || event?.timestamp || "";
    return `${tick}|${amount}|${nonce ?? ""}|${timestamp}|${fallbackIndex}`;
  }

  function getWitnesses(event) {
    const metadataCandidates = [
      event?.networkMetadata,
      event?.network_metadata,
      event?.networkmetadata,
      event?.metadata,
      event?.meta
    ];
    const parsedCandidates = metadataCandidates.map((candidate) => {
      if (!candidate) return null;
      if (typeof candidate === "string") {
        try {
          return JSON.parse(candidate);
        } catch (_error) {
          return null;
        }
      }
      if (typeof candidate === "object") return candidate;
      return null;
    }).filter(Boolean);

    const sources = [];
    for (const meta of parsedCandidates) {
      sources.push(meta?.rxInfo, meta?.rx_info);
      const uplinkMeta = meta?.uplink || meta?.uplinkMessage || meta?.uplink_message;
      if (uplinkMeta) sources.push(uplinkMeta?.rxInfo, uplinkMeta?.rx_info);
    }
    sources.push(event?.rxInfo, event?.rx_info, event?.uplink?.rxInfo, event?.uplink?.rx_info);
    sources.push(event?.gateways, event?.gatewayInfo, event?.witnesses);

    const flattened = sources.filter(Array.isArray).flatMap((list) => list || []);
    const normalized = flattened.map((entry, index) => {
      const entryMeta = entry && typeof entry === "object"
        ? (entry.metadata && typeof entry.metadata === "object" ? entry.metadata : (entry.meta && typeof entry.meta === "object" ? entry.meta : {}))
        : {};
      const name = [
        entryMeta.gateway_name,
        entryMeta.gatewayName,
        entry?.gatewayName,
        entry?.gateway_name,
        entry?.gatewayId,
        entry?.gateway_id,
        entryMeta.gateway_id
      ].find((value) => typeof value === "string" && value.trim()) || `hotspot-${index + 1}`;
      const hotspotId = [
        entryMeta.gateway_id,
        entryMeta.gatewayId,
        entry?.gatewayId,
        entry?.gateway_id,
        entry?.gatewayAddress
      ].find((value) => typeof value === "string" && value.trim()) || "unknown";
      const gwTime = typeof entry?.gwTime === "string"
        ? entry.gwTime
        : (typeof entry?.gw_time === "string" ? entry.gw_time : (typeof entry?.time === "string" ? entry.time : (typeof entry?.timestamp === "string" ? entry.timestamp : null)));
      const parsedTime = gwTime ? Date.parse(gwTime) : Number.NaN;
      return {
        name: String(name).trim(),
        hotspotId: String(hotspotId).trim(),
        gwTime,
        orderIndex: index,
        sortTime: Number.isNaN(parsedTime) ? Number.POSITIVE_INFINITY : parsedTime
      };
    });

    const deduped = [];
    const seen = new Set();
    for (const witness of normalized) {
      const key = `${witness.hotspotId}|${witness.name}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(witness);
    }

    return deduped.sort((left, right) => {
      if (left.sortTime !== right.sortTime) return left.sortTime - right.sortTime;
      return left.orderIndex - right.orderIndex;
    });
  }

  function getFirstWitness(event) {
    const witnesses = getWitnesses(event);
    return witnesses[0] || { name: "unknown-hotspot", hotspotId: "unknown", gwTime: null };
  }

  function formatMintOperation(event) {
    const tick = normalizeTick(event?.tick || "");
    const amount = event?.amount == null ? "?" : String(event.amount);
    return `MINT ${tick || "----"} ${amount}`;
  }

  function getEventNonce(event) {
    const candidates = [
      event?.nonce,
      event?.nonceToCommit,
      event?.commitNonce,
      event?.params?.nonce,
      event?.payload?.nonce,
      event?.data?.nonce,
      event?.meta?.nonce
    ];
    for (const value of candidates) {
      if (value == null) continue;
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return null;
  }

  function getPayloadSizeBytes(event) {
    const candidates = [
      event?.payloadHex,
      event?.payload_hex,
      event?.payload,
      event?.data?.payloadHex,
      event?.meta?.payloadHex
    ];
    for (const value of candidates) {
      if (typeof value !== "string") continue;
      const hexValue = value.trim();
      if (!hexValue || (hexValue.length % 2) !== 0) continue;
      if (!/^[0-9a-fA-F]+$/.test(hexValue)) continue;
      return Math.floor(hexValue.length / 2);
    }
    return null;
  }

  function formatMatrixDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    const pad = (number) => String(number).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function getEventTimestamp(event) {
    const value = event?.receivedAt || event?.createdAt || event?.time || event?.gwTime || event?.timestamp;
    if (!value) return 0;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function shouldAutoScrollMintMatrix() {
    if (state.mintMatrixHover) return false;
    if (state.mintMatrixHoldUntil && Date.now() < state.mintMatrixHoldUntil) return false;
    return true;
  }

  function maybeScrollMintMatrixToTop(nextKey) {
    const container = refs.mintMatrixFeed;
    if (!container) return;
    if (!nextKey) {
      state.mintMatrixTopEventId = null;
      return;
    }
    if (nextKey === state.mintMatrixTopEventId) return;
    state.mintMatrixTopEventId = nextKey;
    if (!shouldAutoScrollMintMatrix()) return;
    state.mintMatrixProgrammaticScroll = true;
    container.scrollTop = 0;
    window.requestAnimationFrame(() => {
      state.mintMatrixProgrammaticScroll = false;
    });
  }

  function handleMintMatrixScroll() {
    if (state.mintMatrixProgrammaticScroll) {
      state.mintMatrixProgrammaticScroll = false;
      return;
    }
    state.mintMatrixHoldUntil = Date.now() + 10000;
  }

  function handleMintMatrixHover(isHovering) {
    state.mintMatrixHover = isHovering;
    if (!isHovering) {
      state.mintMatrixHoldUntil = Date.now() + 10000;
    }
  }

  function handleMintMatrixClick(event) {
    const trigger = event.target instanceof HTMLElement ? event.target.closest("[data-event-id]") : null;
    if (!trigger) return;
    const eventId = trigger.dataset.eventId;
    const eventIndex = Number(trigger.dataset.eventIndex);
    if (!eventId) return;
    openWitnessModal(eventId, Number.isFinite(eventIndex) ? eventIndex : null);
  }

  function openWitnessModal(eventId, eventIndex = null) {
    let event = state.recentTransactions.find((entry) => String(entry.id) === String(eventId));
    if (!event && Number.isInteger(eventIndex) && eventIndex >= 0) {
      const mintEvents = getMintEvents();
      event = mintEvents[eventIndex] || null;
    }
    if (!event || !refs.witnessModal) return;
    state.activeWitnessEventId = eventId;
    renderWitnessModal(event);
    refs.witnessModal.classList.add("is-open");
    refs.witnessModal.setAttribute("aria-hidden", "false");
  }

  function closeWitnessModal() {
    state.activeWitnessEventId = null;
    if (!refs.witnessModal) return;
    refs.witnessModal.classList.remove("is-open");
    refs.witnessModal.setAttribute("aria-hidden", "true");
  }

  function renderWitnessModal(event) {
    const witnesses = getWitnesses(event);
    const firstWitness = witnesses[0] || { name: "unknown-hotspot" };
    if (refs.witnessModalTitle) refs.witnessModalTitle.textContent = formatMintOperation(event);
    if (refs.witnessModalSubtitle) {
      const nonce = getEventNonce(event);
      const nonceLabel = nonce != null ? ` · nonce ${nonce}` : "";
      const payloadSize = getPayloadSizeBytes(event);
      const payloadLabel = payloadSize != null
        ? txt(` · rozmiar ${payloadSize} B`, ` · payload ${payloadSize} B`)
        : "";
      const subtitle = txt(
        `Pierwszy świadek: \"${firstWitness.name}\" - ${formatMatrixDateTime(event.receivedAt || event.createdAt)}${nonceLabel}${payloadLabel}`,
        `First Witness by \"${firstWitness.name}\" - ${formatMatrixDateTime(event.receivedAt || event.createdAt)}${nonceLabel}${payloadLabel}`
      );
      refs.witnessModalSubtitle.textContent = subtitle;
    }

    renderWitnessGraph(event, witnesses);

    if (refs.witnessMetaList) {
      refs.witnessMetaList.innerHTML = witnesses.length
        ? witnesses.map((witness, index) => `
            <article class="witness-meta-card">
              <div class="witness-meta-card__name">${escapeHtml(`${index + 1}. ${witness.name}`)}</div>
              <div class="witness-meta-card__id">${escapeHtml(`${txt("Hotspot ID", "Hotspot ID")}: ${witness.hotspotId}`)}</div>
            </article>
          `).join("")
        : `<div class="witness-meta-card">${escapeHtml(txt("Brak danych witness dla tego uplinku.", "No witness data available for this uplink."))}</div>`;
    }
  }

  function renderWitnessGraph(event, witnesses) {
    if (!refs.witnessGraph) return;
    if (!witnesses.length) {
      refs.witnessGraph.innerHTML = `
        <div class="callout callout--warn">
          ${escapeHtml(txt("Brak rxInfo w networkMetadata dla tej operacji.", "No rxInfo in networkMetadata for this operation."))}
        </div>
      `;
      return;
    }

    const width = 1060;
    const sourceWidth = 280;
    const sourceHeight = 118;
    const sourceX = 70;
    const targetWidth = 360;
    const targetHeight = 130;
    const targetX = 640;
    const gap = 24;
    const totalTargetsHeight = witnesses.length * targetHeight + Math.max(0, witnesses.length - 1) * gap;
    const height = Math.max(340, totalTargetsHeight + 120);
    const sourceY = Math.round((height - sourceHeight) / 2);
    const targetsStartY = Math.round((height - totalTargetsHeight) / 2);
    const sourceCenterX = sourceX + sourceWidth;
    const sourceCenterY = sourceY + sourceHeight / 2;
    const sourceDeviceId = event?.deviceId ? String(event.deviceId) : "unknown";

    const lines = witnesses.map((witness, index) => {
      const y = targetsStartY + index * (targetHeight + gap) + targetHeight / 2;
      return `<line class="signal-line" x1="${sourceCenterX}" y1="${sourceCenterY}" x2="${targetX}" y2="${y}" marker-end="url(#signalArrow)" />`;
    }).join("");

    const nodes = witnesses.map((witness, index) => {
      const y = targetsStartY + index * (targetHeight + gap);
      return `
        <g>
          <rect class="signal-node-hotspot" x="${targetX}" y="${y}" rx="14" ry="14" width="${targetWidth}" height="${targetHeight}" />
          <foreignObject x="${targetX + 12}" y="${y + 12}" width="${targetWidth - 24}" height="${targetHeight - 24}">
            <div xmlns="http://www.w3.org/1999/xhtml" class="signal-node-fo">
              <div class="signal-node-name">${escapeHtml(witness.name)}</div>
              <div class="signal-node-id">${escapeHtml(`${txt("Hotspot ID", "Hotspot ID")}: ${witness.hotspotId}`)}</div>
            </div>
          </foreignObject>
        </g>
      `;
    }).join("");

    refs.witnessGraph.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="LoRa signal witness graph">
        <defs>
          <marker id="signalArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="rgba(62, 192, 255, 0.9)" />
          </marker>
        </defs>
        ${lines}
        <g>
          <rect class="signal-node-source" x="${sourceX}" y="${sourceY}" rx="16" ry="16" width="${sourceWidth}" height="${sourceHeight}" />
          <foreignObject x="${sourceX + 12}" y="${sourceY + 12}" width="${sourceWidth - 24}" height="${sourceHeight - 24}">
            <div xmlns="http://www.w3.org/1999/xhtml" class="signal-node-fo signal-node-fo--source">
              <div class="signal-node-name">Heltec V4</div>
              <div class="signal-node-id">${escapeHtml(`Device ID: ${shortenMiddle(sourceDeviceId, 36)}`)}</div>
            </div>
          </foreignObject>
        </g>
        ${nodes}
      </svg>
    `;
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
        isDeviceConnected() ? "Device connection is active." : "Connect the device (USB, Bluetooth or Wi-Fi).",
          state.deviceInfo?.hasKey ? "Device info and key are already available." : "Click Fetch info and confirm the device has a key.",
          runtime?.joined ? "LoRaWAN is already joined." : "Click Fetch radio and run Join LoRaWAN if joined=false.",
          token ? `Ticker ${currentTick} is visible in the indexer.` : "Refresh tokens or portfolio until the ticker appears.",
          "Open the mint card and click Prepare and send. For a brand new Heltec, use the onboarding section below."
        ]
      : [
        isDeviceConnected() ? "Połączenie z urządzeniem jest aktywne." : "Podłącz urządzenie (USB, Bluetooth lub Wi‑Fi).",
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
    if (!device) hints.push(txt("Po połączeniu kliknij \"Pobierz info\".", "After connecting, click \"Fetch info\"."));
    else {
      hints.push(txt(`Aktywny deviceId: ${device.deviceId}.`, `Active deviceId: ${device.deviceId}.`));
      if (!device.hasKey) hints.push(txt("Klucz urządzenia nie został jeszcze wygenerowany.", "Device key has not been generated yet."));
    }
    renderCallout(refs.deviceReadinessBanner, device?.hasKey ? "ok" : "warn", hints.join(" "));

    if (!refs.knownDevicesList) return;
    if (!state.knownDevices.length) {
      refs.knownDevicesList.innerHTML = `<div class="known-device"><h3>${escapeHtml(txt("Brak zapisanych urządzeń", "No saved devices"))}</h3><p class="helper">${escapeHtml(txt("Po udanym odczycie info lub rejestracji w indexerze urządzenie pojawi się tutaj.", "After successful info read or indexer registration, the device will appear here."))}</p></div>`;
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
            <button class="button button--ghost" type="button" data-action="use-device" data-id="${escapeHtml(deviceEntry.deviceId)}">${escapeHtml(txt("Uzyj", "Use"))}</button>
            <button class="button button--ghost" type="button" data-action="remove-device" data-id="${escapeHtml(deviceEntry.deviceId)}">${escapeHtml(txt("Usun", "Remove"))}</button>
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
    if (!config?.hasAppKey || !config?.hasJoinEui) messages.push(txt("Brakuje pelnej konfiguracji OTAA.", "Full OTAA configuration is missing."));
    if (runtime && !runtime.hardwareReady) messages.push(txt("hardwareReady=false. Po restarcie Helteca odczekaj chwilę i dopiero odczytaj radio lub wykonaj join.", "hardwareReady=false. After Heltec restart, wait a moment, then refresh radio state or run join."));
    if (runtime && !runtime.initialized) messages.push(txt("initialized=false. Radio nie jest gotowe do wysyłki.", "initialized=false. Radio is not ready to send yet."));
    if (runtime && !runtime.joined) messages.push(txt("joined=false. Wykonaj join przed wysyłką.", "joined=false. Run join before sending."));
    renderCallout(refs.radioActionHint, messages.length ? "warn" : "ok", messages.length ? messages.join(" ") : txt("Radio wygląda na gotowe do wysyłki.", "Radio looks ready to send."));
  }

  function renderPortfolio() {
    if (refs.portfolioList) {
      if (!state.portfolio.length) {
        refs.portfolioList.innerHTML = `<div class="token-card"><h3>${escapeHtml(txt("Brak balansu", "No balances yet"))}</h3><p class="helper">${escapeHtml(txt("Po pobraniu portfela zobaczysz tu tokeny przypisane do aktywnego deviceId.", "After loading portfolio, tokens for the active deviceId will appear here."))}</p></div>`;
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
      refs.recentTransactionsList.innerHTML = `<div class="timeline-card"><h3>${escapeHtml(txt("Brak historii", "No history yet"))}</h3><p class="helper">${escapeHtml(txt("Po synchronizacji webhooka i wyslaniu nowego uplinku zobaczysz tu zdarzenia z indexera.", "After webhook sync and sending a new uplink, indexer events will appear here."))}</p></div>`;
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
        ${event.rejectionReason ? `<p class="helper">${escapeHtml(txt("Powod odrzucenia", "Rejection reason"))}: ${escapeHtml(event.rejectionReason)}</p>` : ""}
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
        renderCallout(refs.tokenLibraryStatus, "warn", state.tokenCatalogError);
      } else if (state.tokenCatalogError) {
        renderCallout(refs.tokenLibraryStatus, "danger", state.tokenCatalogError);
      } else {
        renderCallout(refs.tokenLibraryStatus, "ok", txt(
          "Wybierz ticker z listy, aby automatycznie wypelnic pola deploy, mint i transfer.",
          "Choose a ticker from the list to autofill deploy, mint and transfer forms."
        ));
      }
    }

    if (!refs.tokenLibraryList) return;
    if (!filtered.length) {
      refs.tokenLibraryList.innerHTML = `<div class="token-card"><h3>${escapeHtml(txt("Brak tokenów", "No tokens found"))}</h3><p class="helper">${escapeHtml(txt("Indexer nie zwrócił jeszcze żadnych wdrożonych tickerów.", "Indexer has not returned any deployed tickers yet."))}</p></div>`;
      return;
    }

    refs.tokenLibraryList.innerHTML = filtered.map((token) => {
      const remaining = safeBigInt(token.maxSupply) - safeBigInt(token.totalSupply);
      return `
        <article class="token-card">
          <div class="token-card__head">
            <h3>${escapeHtml(token.tick)}</h3>
            <button class="button button--ghost" type="button" data-action="use-token" data-tick="${escapeHtml(token.tick)}">${escapeHtml(txt("Uzyj", "Use"))}</button>
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
    setText(refs.preparedOutput, state.lastPrepared ? prettyJson(state.lastPrepared) : txt("Brak przygotowanego payloadu.", "No prepared payload yet."));
    const payloadSize = state.lastPrepared?.payloadSize || 81;
    setText(refs.estimatedPayloadValue, `${payloadSize} B`);
    setText(refs.estimatedDcValue, formatDcEstimate(payloadSize));
  }

  function renderProfiles() {
    saveJson(STORAGE.profiles, state.profiles);
    saveJson(STORAGE.scheduler, state.scheduler);

    if (refs.profilesPersistenceNote) {
      refs.profilesPersistenceNote.textContent = txt(
        "Profile są zapamiętywane lokalnie w przeglądarce. \"Synchronizuj kolejkę\" zapisuje je do Helteca, więc urządzenie może mintować także bez podłączonego panelu.",
        "Profiles are stored locally in the browser. 'Sync queue' writes them to Heltec, so the device can keep minting without an attached dashboard."
      );
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
      refs.profileList.innerHTML = `<div class="profile-card"><h3>${escapeHtml(txt("Brak profili", "No profiles yet"))}</h3><p class="helper">${escapeHtml(txt("Dodaj profil mintu, a potem zsynchronizuj kolejkę z urządzeniem.", "Add a mint profile, then sync queue with the device."))}</p></div>`;
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
          <button class="button button--ghost" type="button" data-action="use-profile" data-id="${escapeHtml(profile.id)}">${escapeHtml(txt("Uzyj", "Use"))}</button>
          <button class="button button--ghost" type="button" data-action="toggle-profile" data-id="${escapeHtml(profile.id)}">${escapeHtml(profile.enabled ? txt("Pauza", "Pause") : txt("Wlacz", "Enable"))}</button>
          <button class="button button--ghost" type="button" data-action="move-up" data-id="${escapeHtml(profile.id)}" ${index === 0 ? "disabled" : ""}>${escapeHtml(txt("Gora", "Up"))}</button>
          <button class="button button--ghost" type="button" data-action="move-down" data-id="${escapeHtml(profile.id)}" ${index === state.profiles.length - 1 ? "disabled" : ""}>${escapeHtml(txt("Dol", "Down"))}</button>
          <button class="button button--ghost" type="button" data-action="remove-profile" data-id="${escapeHtml(profile.id)}">${escapeHtml(txt("Usun", "Remove"))}</button>
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
        renderCallout(
          refs.selectedTokenSummary,
          "warn",
          mintTick
            ? txt(
        `Ticker ${mintTick} nie jest jeszcze widoczny w indexerze. Mint bez wcześniejszego deploy prawdopodobnie nie zostanie zaindeksowany.`,
              `Ticker ${mintTick} is not visible in indexer yet. Mint without prior deploy is likely to be rejected.`
            )
            : txt("Wybierz ticker albo kliknij token z biblioteki.", "Choose a ticker or click a token from the library.")
        );
      } else {
        const remaining = safeBigInt(selectedToken.maxSupply) - safeBigInt(selectedToken.totalSupply);
        renderCallout(
          refs.selectedTokenSummary,
          "ok",
          txt(
            `${selectedToken.tick}: wybite ${selectedToken.totalSupply}/${selectedToken.maxSupply}, limit na mint ${selectedToken.limitPerMint}, pozostalo ${remaining}.`,
            `${selectedToken.tick}: minted ${selectedToken.totalSupply}/${selectedToken.maxSupply}, limit per mint ${selectedToken.limitPerMint}, remaining ${remaining}.`
          )
        );
      }
    }

    if (refs.operationWarnings) {
      if (!warnings.length) renderCallout(refs.operationWarnings, "ok", txt("Brak oczywistych bledow logicznych dla aktualnego mintu.", "No obvious logical issues for this mint."));
      else renderCallout(refs.operationWarnings, warnings.some((warning) => warning.blocking) ? "danger" : "warn", warnings.map((warning) => warning.message).join(" "));
    }

    const lastSendMs = state.lastSendAt ? Date.now() - Date.parse(state.lastSendAt) : Number.POSITIVE_INFINITY;
    const transportNotes = [];
    const runtime = state.lorawanInfo?.runtime || state.lorawanInfo?.lorawanRuntime;
    if (!isDeviceConnected()) transportNotes.push(txt("Brak połączenia z urządzeniem.", "No device connection."));
    if (runtime && !runtime.joined) transportNotes.push(txt("Radio nie jest joined.", "Radio is not joined."));
    if (runtime && (!runtime.hardwareReady || !runtime.initialized)) transportNotes.push(txt("Radio po restarcie nie jest jeszcze gotowe do kolejnej wysyłki.", "After restart the radio is not ready for the next send yet."));
    if (Number.isFinite(lastSendMs) && lastSendMs < 15000) {
      transportNotes.push(txt(
        `Ostatnia wysyłka była ${formatRelative(Date.now(), Date.parse(state.lastSendAt))}. Daj urządzeniu chwilę przed następną próbą.`,
        `Last send was ${formatRelative(Date.now(), Date.parse(state.lastSendAt))}. Give the device a short pause before trying again.`
      ));
    }
    renderCallout(refs.transportStatusNote, transportNotes.length ? "warn" : "ok", transportNotes.length ? transportNotes.join(" ") : txt("Transport wyglada poprawnie.", "Transport looks healthy."));

    const actionNote = txt(
      "Przygotuj uruchamia na Heltecu tylko lokalne polecenie prepare_*, podpisuje payload i pokazuje podgląd. Nie wysyła nic przez LoRaWAN i nie zapisuje nonce. Przygotuj i wyślij najpierw robi prepare, potem wywołuje lorawan_send, kolejkuje uplink w radiu i zapisuje nonce po akceptacji przez urządzenie. Stan indexera zmienia się dopiero po przekazaniu uplinku przez webhook ChirpStack.",
      "Prepare only runs local prepare_* on Heltec, signs payload and shows preview. It does not transmit over LoRaWAN and does not commit nonce. Prepare and send first prepares, then calls lorawan_send, queues uplink in radio and commits nonce after device accepts queueing. Indexer state changes only after ChirpStack forwards the uplink to webhook."
    );
    renderCallout(refs.operationActionNote, "ok", actionNote);
  }

  function renderOnboarding() {
    if (!refs.onboardingChecklist) return;
    const items = state.language === "en"
      ? [
          { title: "1. Drivers and port", body: "Use Chrome or Edge. Close VS Code Serial Monitor, PlatformIO, MobaXterm and every app holding the COM port before clicking Connect device." },
          { title: "2. Firmware and key", body: "After connecting, fetch info, generate the key, read the public key and register the device in the indexer. If firmware changed, verify radio state and join." },
          { title: "3. LoRaWAN", body: "Fill DevEUI, JoinEUI and AppKey, save radio settings and then run join. Do not try mint when runtime shows joined=false or hardwareReady=false." },
          { title: "4. Indexer and webhook", body: "Check indexer health, link DevEUI to deviceId and confirm ChirpStack sends the webhook to /integrations/chirpstack with the current token." }
        ]
      : [
          { title: "1. Sterowniki i port", body: "Użyj Chrome albo Edge. Zamknij VS Code Serial Monitor, PlatformIO, MobaXterm i każdą aplikację trzymającą COM przed kliknięciem „Połącz urządzenie”." },
          { title: "2. Firmware i klucz", body: "Po połączeniu pobierz info, wygeneruj klucz, odczytaj public key i zarejestruj urządzenie w indexerze. Jeśli firmware był aktualizowany, sprawdź radio i join." },
          { title: "3. LoRaWAN", body: "Wypełnij DevEUI, JoinEUI, AppKey i zapisz radio. Potem wykonaj join. Nie próbuj mintu, gdy runtime pokazuje joined=false albo hardwareReady=false." },
          { title: "4. Indexer i webhook", body: "Sprawdź health indexera, podepnij DevEUI do deviceId i upewnij się, że ChirpStack wysyła webhook na /integrations/chirpstack z aktualnym tokenem." }
        ];
    refs.onboardingChecklist.innerHTML = items.map((item) => `
      <article class="guide-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");
  }

  function renderEducation() {
    if (!refs.educationContent) return;
    const mintBaseDc = estimateDcBase(81);
    const mintEffectiveDc = estimateDcTotal(81);
    refs.educationContent.innerHTML = state.language === "en"
      ? `
        <p>Every message is signed with Ed25519. The indexer uses the nonce to reject replay and duplicates. Only the first deploy counts for a ticker, and mint stops being indexed after max supply is reached.</p>
        <ul>
          <li><strong>Mint</strong>: currently about 81 B of payload, which is about ${mintBaseDc} DC of base cost in 24 B chunks. With the current tenant setting Max copy = ${PLATFORM_COPY_COUNT}, this becomes about ${mintEffectiveDc} DC of effective cost.</li>
          <li><strong>Prepare vs send</strong>: prepare only creates and signs the payload locally, while send also asks the radio to transmit a real LoRaWAN uplink.</li>
          <li><strong>Config</strong>: stores auto-mint settings and interval; round-robin profiles stay locally in Heltec after synchronization.</li>
          <li><strong>Security</strong>: the signature proves the author, nonce preserves order, and the webhook to the indexer should be protected by a separate token.</li>
        </ul>
      `
      : `
        <p>Każda wiadomość jest podpisywana Ed25519. Indexer używa nonce, żeby odrzucić replay i duplikaty. Deploy liczy się tylko pierwszy dla tickera, a mint przestaje być indeksowany po osiągnięciu max supply.</p>
        <ul>
          <li><strong>Mint</strong>: obecnie około 81 B payloadu, czyli około ${mintBaseDc} DC bazowego kosztu przy porcjach 24 B. Przy aktualnym ustawieniu tenantu Max copy = ${PLATFORM_COPY_COUNT} daje to około ${mintEffectiveDc} DC kosztu efektywnego.</li>
          <li><strong>Prepare vs send</strong>: prepare tylko tworzy i podpisuje payload lokalnie, a send dodatkowo zleca faktyczny uplink LoRaWAN.</li>
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
    addLog("device", txt("Public key odczytany", "Public key loaded"), result);
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
    addLog("indexer", txt("Urządzenie zarejestrowane w indexerze", "Device registered in indexer"), response.device);
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
    const query = new URLSearchParams();
    query.set("limit", "100");
    try {
      const response = await fetchJson(`/tokens?${query.toString()}`);
      state.tokenCatalog = Array.isArray(response.tokens) ? response.tokens : [];
      state.tokenCatalogError = "";
      state.tokenCatalogErrorRaw = "";
      setText(refs.tokenOutput, prettyJson(response));
      renderAll();
      return response;
    } catch (error) {
      const rawError = error instanceof Error ? error.message : String(error);
      state.tokenCatalogErrorRaw = rawError;
      const hasFallbackTokens = getKnownTokens().length > 0;
      state.tokenCatalogError = humanizeTokenCatalogError(rawError, hasFallbackTokens);
      setText(refs.tokenOutput, prettyJson({
        error: state.tokenCatalogError,
        rawError: state.tokenCatalogErrorRaw
      }));
      renderAll();
      if (hasFallbackTokens && isIndexerParameterTypeError(rawError)) {
        return { tokens: getKnownTokens(), fallback: true };
      }
      throw new Error(state.tokenCatalogError);
    }
  }

  function isIndexerParameterTypeError(rawError) {
    return /could not determine data type of parameter \$\d+/i.test(String(rawError || "").trim());
  }

  function humanizeTokenCatalogError(rawError, hasFallbackTokens) {
    const normalized = String(rawError || "").trim();
    if (isIndexerParameterTypeError(normalized)) {
      return hasFallbackTokens
        ? txt(
            "Lista tokenów z indexera nie odświeżyła się (błąd zapytania po stronie indexera). Panel pokazuje dane z portfela urządzenia.",
            "Indexer token list refresh failed (server-side query error). Dashboard is showing portfolio-derived data."
          )
        : txt(
            "Indexer zwrócił błąd zapytania przy pobieraniu listy tokenów. Spróbuj ponownie po aktualizacji indexera.",
            "Indexer returned a query error while loading the token list. Retry after updating the indexer."
          );
    }

    return hasFallbackTokens
      ? txt(
          "Lista tokenów z indexera nie odświeżyła się. Panel pokazuje dane z portfela urządzenia.",
          "Indexer token list refresh failed. Dashboard is showing portfolio-derived data."
        )
      : txt(
          "Nie udało się pobrać listy tokenów z indexera.",
          "Failed to fetch token list from indexer."
        );
  }

  async function lookupToken() {
    const tick = normalizeTick(refs.tokenTickInput?.value || refs.mintTickInput?.value || "");
    if (!tick) throw new Error(txt("Podaj tick do sprawdzenia tokena.", "Provide ticker to check token."));
    const response = await fetchJson(`/tokens/${encodeURIComponent(tick)}`);
    setText(refs.tokenOutput, prettyJson(response));
  }

  async function loadPortfolioAndHistory() {
    await Promise.allSettled([loadPortfolio(), loadTransactions()]);
  }

  async function loadPortfolio() {
    const deviceId = getCurrentDeviceId();
    if (!deviceId) throw new Error(txt("Brak aktywnego deviceId. Najpierw odczytaj info urządzenia albo wybierz zapisany node.", "No active deviceId. Fetch device info first or choose a saved node."));
    const response = await fetchJson(`/devices/${encodeURIComponent(deviceId)}/balances?limit=100`);
    state.portfolio = Array.isArray(response.balances) ? response.balances : [];
    setText(refs.balanceOutput, prettyJson(response));
    renderAll();
  }

  async function lookupBalance() {
    const deviceId = (refs.balanceDeviceIdInput?.value || getCurrentDeviceId() || "").trim().toLowerCase();
    const tick = normalizeTick(refs.balanceTickInput?.value || refs.mintTickInput?.value || "");
    if (!deviceId || !tick) throw new Error(txt("Do sprawdzenia balansu potrzebny jest deviceId i tick.", "Balance lookup requires deviceId and ticker."));
    const response = await fetchJson(`/balances/${encodeURIComponent(deviceId)}/${encodeURIComponent(tick)}`);
    setText(refs.balanceOutput, prettyJson(response));
  }

  async function loadTransactions() {
    const deviceId = getCurrentDeviceId();
    if (!deviceId) throw new Error(txt("Brak aktywnego deviceId do pobrania historii.", "No active deviceId to load history."));
    const query = new URLSearchParams({ deviceId, limit: String(Number(refs.transactionsLimitInput?.value || 20)) });
    const response = await fetchJson(`/transactions?${query.toString()}`);
    state.recentTransactions = Array.isArray(response.transactions) ? response.transactions : [];
    setText(refs.transactionsOutput, prettyJson(response));
    renderAll();
  }

  async function saveHeltecLicense() {
    const licenseHex = refs.heltecLicenseInput?.value?.trim() || "";
    if (!licenseHex) throw new Error(txt("Wpisz licencje Heltec przed zapisaniem.", "Enter Heltec license before saving."));
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
    if (!deviceId) throw new Error(txt("Brak aktywnego deviceId.", "No active deviceId."));
    if (!devEui) throw new Error(txt("Podaj DevEUI do powiazania.", "Provide DevEUI to link."));
    const response = await fetchJson(`/devices/${encodeURIComponent(deviceId)}/lorawan`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devEui })
    });
    addLog("indexer", txt("DevEUI powiazane w indexerze", "DevEUI linked in indexer"), response);
  }

  async function exportBackup() {
    const passphrase = refs.backupPassphraseInput?.value || "";
    if (!passphrase) throw new Error(txt("Podaj haslo backupu przed eksportem.", "Enter backup passphrase before export."));
    const response = await requestDevice("export_backup", { passphrase }, 30000);
    if (refs.backupJsonTextarea) refs.backupJsonTextarea.value = prettyJson(response);
  }

  async function importBackup() {
    const passphrase = refs.backupImportPassphraseInput?.value || "";
    if (!passphrase) throw new Error(txt("Podaj haslo importu backupu.", "Enter import backup passphrase."));
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
        addLog("device", txt("Dolaczenie LoRaWAN zakonczone.", "LoRaWAN join completed."));
        return;
      }
    }
    addLog("warn", txt("Join uruchomiony, ale joined=true jeszcze sie nie pojawilo. Sprawdz ChirpStack i stan radia.", "Join started, but joined=true did not appear yet. Check ChirpStack and radio status."));
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
    if (!runtime?.configured) throw new Error(txt("Radio nie jest skonfigurowane. Najpierw zapisz LoRaWAN.", "Radio is not configured. Save LoRaWAN first."));
    if (!runtime.hardwareReady || !runtime.initialized) throw new Error(txt("Radio nie jest gotowe po restarcie. Odczekaj chwilę, pobierz stan radia i w razie potrzeby zrób join.", "Radio is not ready after restart. Wait a moment, refresh radio status, and run join if needed."));
    if (!runtime.joined) throw new Error(txt("Radio nie jest joined. Zrób join przed wysyłką.", "Radio is not joined. Run join before sending."));

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
      addLog("error", txt("Profil wymaga tick i amount.", "Profile requires tick and amount."));
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
    addLog("device", txt("Profil zapisany", "Profile saved"), profile);
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

  async function connectUsbDevice() {
    if (!("serial" in navigator)) throw new Error(txt("Ta przeglądarka nie wspiera Web Serial.", "This browser does not support Web Serial."));
    if (state.port) {
      addLog("device", txt("Urządzenie jest już podłączone.", "Device is already connected."));
      return;
    }
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200, bufferSize: 4096 });
    state.port = port;
    state.disconnecting = false;
    state.deviceTransport = "serial";
    state.wifiConnected = false;
    addLog("device", txt("Port szeregowy podłączony.", "Serial port connected."));
    renderAll();
    void startReadLoop();
    await delay(1200);
    await refreshDeviceState();
    await applyConnectivityMode("usb");
  }

  async function connectBleDevice() {
    if (!("bluetooth" in navigator)) {
      throw new Error(txt("Ta przeglądarka nie wspiera Web Bluetooth.", "This browser does not support Web Bluetooth."));
    }
    if (state.ble?.connected) {
      addLog("device", txt("Bluetooth jest już połączony.", "Bluetooth is already connected."));
      return;
    }

    const serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    const rxUuid = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
    const txUuid = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [serviceUuid] }],
      optionalServices: [serviceUuid]
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUuid);
    const rxChar = await service.getCharacteristic(rxUuid);
    const txChar = await service.getCharacteristic(txUuid);
    await txChar.startNotifications();

    const bleState = {
      device,
      server,
      rxChar,
      txChar,
      buffer: "",
      connected: true
    };

    const handleDisconnect = () => {
      if (state.ble) {
        state.ble.connected = false;
      }
      if (state.deviceTransport === "ble") {
        state.deviceTransport = null;
      }
      renderAll();
      addLog("device", txt("Bluetooth rozlaczony.", "Bluetooth disconnected."));
    };

    device.addEventListener("gattserverdisconnected", handleDisconnect);
    txChar.addEventListener("characteristicvaluechanged", (event) => {
      const value = event.target.value;
      if (!value) return;
      const decoder = new TextDecoder();
      bleState.buffer += decoder.decode(value);
      let newlineIndex = bleState.buffer.indexOf("\n");
      while (newlineIndex >= 0) {
        const line = bleState.buffer.slice(0, newlineIndex).replace(/\r$/, "");
        bleState.buffer = bleState.buffer.slice(newlineIndex + 1);
        handleDeviceLine(line, "ble");
        newlineIndex = bleState.buffer.indexOf("\n");
      }
    });

    state.ble = bleState;
    state.deviceTransport = "ble";
    state.wifiConnected = false;
    addLog("device", txt("Bluetooth podłączony.", "Bluetooth connected."));
    renderAll();
    await delay(400);
    await refreshDeviceState();
    await applyConnectivityMode("ble");
  }

  async function connectWifiDevice() {
    handleSaveDeviceBridgeUrl();
    if (!state.deviceBridgeUrl) throw new Error(txt("Podaj adres mostka Wi‑Fi.", "Provide the Wi-Fi bridge URL."));
    state.deviceTransport = "wifi";
    try {
      const response = await sendWifiPayload(withAuth({ id: `req-${state.requestId++}`, command: "ping", params: {} }), 8000, "ping");
      state.wifiConnected = true;
      addLog("device", txt("Wi‑Fi bridge połączony.", "Wi‑Fi bridge connected."), response);
      renderAll();
      await refreshDeviceState();
    } catch (error) {
      state.wifiConnected = false;
      state.deviceTransport = null;
      throw error;
    }
  }

  async function disconnectDevice(logIt) {
    if (state.deviceTransport === "serial") {
      if (!state.port) return;
      state.disconnecting = true;
      for (const pending of state.pending.values()) {
        clearTimeout(pending.timer);
        pending.reject(new Error(txt("Port szeregowy rozlaczony.", "Serial port disconnected.")));
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
      state.deviceTransport = null;
      if (logIt) addLog("device", txt("Port szeregowy rozlaczony.", "Serial port disconnected."));
      renderAll();
      return;
    }

    if (state.deviceTransport === "ble") {
      if (state.ble?.device?.gatt?.connected) {
        state.ble.device.gatt.disconnect();
      }
      state.ble = null;
      state.deviceTransport = null;
      if (logIt) addLog("device", txt("Bluetooth rozlaczony.", "Bluetooth disconnected."));
      renderAll();
      return;
    }

    if (state.deviceTransport === "wifi") {
      state.deviceTransport = null;
      state.wifiConnected = false;
      if (logIt) addLog("device", txt("Wi‑Fi bridge rozlaczony.", "Wi‑Fi bridge disconnected."));
      renderAll();
    }
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
          handleDeviceLine(line, "serial");
        }
      }
    } catch (error) {
      if (!state.disconnecting) addLog("error", txt(`Blad odczytu serial: ${error instanceof Error ? error.message : String(error)}`, `Serial read failed: ${error instanceof Error ? error.message : String(error)}`));
    } finally {
      try {
        state.reader?.releaseLock();
      } catch (_error) {
        // ignore
      }
      state.reader = null;
      if (!state.disconnecting) {
        cleanupPortState();
        addLog("device", txt("Port szeregowy rozlaczony.", "Serial port disconnected."));
      }
      renderAll();
    }
  }

  function cleanupPortState() {
    state.port = null;
    state.reader = null;
    state.disconnecting = false;
    if (state.deviceTransport === "serial") {
      state.deviceTransport = null;
    }
  }

  async function requestDevice(command, params, timeout) {
    const run = async () => {
      const payload = { id: `req-${state.requestId++}`, command, params: params || {} };
      const response = await sendDevicePayload(payload, timeout || TIMEOUTS[command] || TIMEOUTS.default, command);
      if (response.ok === false) {
        const error = new Error(response.error?.message || `Command ${command} failed`);
        error.code = response.error?.code || "device_command_failed";
        throw error;
      }
      return response.result || {};
    };

    const next = state.deviceRequestChain.then(run, run);
    state.deviceRequestChain = next.catch(() => {});
    return next;
  }

  function withAuth(payload) {
    if (state.deviceTransport !== "serial" && state.deviceAuthToken) {
      return { ...payload, auth: state.deviceAuthToken };
    }
    return payload;
  }

  async function sendDevicePayload(payload, timeout, label) {
    const securedPayload = withAuth(payload);
    if (state.deviceTransport === "wifi") {
      return sendWifiPayload(securedPayload, timeout, label);
    }
    if (state.deviceTransport === "ble") {
      return sendBlePayload(securedPayload, timeout, label);
    }
    return sendSerialPayload(securedPayload, timeout, label);
  }

  async function sendSerialPayload(payload, timeout, label) {
    if (!state.port?.writable) throw new Error(txt("Urządzenie nie jest podłączone.", "Device is not connected."));
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

  async function sendBlePayload(payload, timeout, label) {
    if (!state.ble?.rxChar) throw new Error(txt("Bluetooth nie jest podłączony.", "Bluetooth is not connected."));
    const serialized = JSON.stringify(payload);
    addLog("tx", label || payload.command || payload.method || "raw", payload);

    const responsePromise = new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        state.pending.delete(payload.id);
        reject(new Error(`Timeout waiting for ${label || payload.command || "response"}`));
      }, timeout || TIMEOUTS.default);
      state.pending.set(payload.id, { resolve, reject, timer, label: label || payload.command || payload.method || "raw" });
    });

    await writeBleLine(`${serialized}\n`);
    return responsePromise;
  }

  async function writeBleLine(text) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const chunkSize = 20;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      const chunk = bytes.slice(offset, offset + chunkSize);
      await state.ble.rxChar.writeValueWithoutResponse(chunk);
      await delay(10);
    }
  }

  async function sendWifiPayload(payload, timeout, label) {
    if (!state.deviceBridgeUrl) throw new Error(txt("Brak adresu mostka Wi‑Fi.", "Missing Wi-Fi bridge URL."));
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeout || TIMEOUTS.default);
    const url = `${state.deviceBridgeUrl.replace(/\/$/, "")}/rpc`;
    addLog("tx", label || payload.command || payload.method || "raw", payload);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (!response.ok) throw new Error(data?.error?.message || `${response.status} ${response.statusText}`);
      return data;
    } catch (error) {
      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  function handleDeviceLine(line, source) {
    if (!line) return;
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch (_error) {
      addLog(source === "ble" ? "ble" : "serial", line);
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
      addLog("device", txt("Zdarzenie boot", "Boot event"), parsed);
      return;
    }
    if (parsed.ok === false) {
      addLog("error", parsed.error?.message || txt("Urządzenie zwróciło błąd", "Device returned an error"), parsed.error);
      return;
    }
    addLog("event", txt("Zdarzenie urządzenia", "Device event"), parsed);
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
    if (!tick) warnings.push({ blocking: true, message: txt("Tick deploy musi byc ustawiony.", "Deploy tick must be set.") });
    if (maxSupply <= 0n) warnings.push({ blocking: true, message: txt("maxSupply musi być większe od zera.", "maxSupply must be greater than zero.") });
    if (limitPerMint <= 0n) warnings.push({ blocking: true, message: txt("limitPerMint musi być większe od zera.", "limitPerMint must be greater than zero.") });
    if (limitPerMint > maxSupply) warnings.push({ blocking: true, message: txt("limitPerMint nie moze przekraczac maxSupply.", "limitPerMint cannot exceed maxSupply.") });
    if (existing) warnings.push({ blocking: true, message: txt(`Ticker ${tick} jest już wdrożony. Duplikat deploy nie zostanie uznany przez indexer.`, `Ticker ${tick} is already deployed. Duplicate deploy will be rejected by indexer.`) });
    return warnings;
  }
  function getMintWarnings(tick, amountText, token) {
    const amount = safeBigInt(amountText || "0");
    const warnings = [];
    if (!tick) {
      warnings.push({ blocking: true, message: txt("Tick mintu jest pusty.", "Mint ticker is empty.") });
      return warnings;
    }
    if (amount <= 0n) warnings.push({ blocking: true, message: txt("Ilość mintu musi być większa od zera.", "Mint amount must be greater than zero.") });
    if (!token) {
      warnings.push({ blocking: true, message: txt(`Ticker ${tick} nie jest wdrożony w indexerze. Taki mint najpewniej nie zostanie zaindeksowany.`, `Ticker ${tick} is not deployed in indexer. This mint will likely not be indexed.`) });
      return warnings;
    }
    const limit = safeBigInt(token.limitPerMint);
    const total = safeBigInt(token.totalSupply);
    const maxSupply = safeBigInt(token.maxSupply);
    const remaining = maxSupply - total;
    if (amount > limit) warnings.push({ blocking: true, message: txt(`Mint ${amount} przekracza limitPerMint=${limit}. Indexer odrzuci taka wiadomosc.`, `Mint ${amount} exceeds limitPerMint=${limit}. Indexer will reject this message.`) });
    if (remaining <= 0n) warnings.push({ blocking: true, message: txt(`Token ${tick} osiagnal juz max supply. Dalszy mint nie bedzie indeksowany.`, `Token ${tick} has already reached max supply. Further mint will not be indexed.`) });
    else if (amount > remaining) warnings.push({ blocking: true, message: txt(`Pozostalo tylko ${remaining}. Mint ${amount} nie zmiesci sie w max supply.`, `Only ${remaining} remains. Mint ${amount} does not fit max supply.`) });
    return warnings;
  }
  function getTransferWarnings() {
    const warnings = [];
    const tick = normalizeTick(refs.transferTickInput?.value || "");
    const amount = safeBigInt(refs.transferAmountInput?.value || "0");
    const recipient = refs.transferRecipientInput?.value?.trim() || "";
    if (!tick) warnings.push({ blocking: true, message: txt("Tick transferu jest pusty.", "Transfer ticker is empty.") });
    if (amount <= 0n) warnings.push({ blocking: true, message: txt("Ilość transferu musi być większa od zera.", "Transfer amount must be greater than zero.") });
    if (!/^[0-9a-fA-F]{16}$/.test(recipient)) warnings.push({ blocking: true, message: txt("Recipient deviceId musi miec dokladnie 16 znakow hex.", "Recipient deviceId must be exactly 16 hex characters.") });
    if (!findToken(tick)) warnings.push({ blocking: true, message: txt(`Ticker ${tick} nie istnieje w indexerze.`, `Ticker ${tick} does not exist in indexer.`) });
    const currentDeviceId = getCurrentDeviceId();
    if (currentDeviceId && recipient.toLowerCase() === currentDeviceId.toLowerCase()) {
      warnings.push({
        blocking: false,
        message: txt(
          "Transfer na wlasny deviceId zwykle nie ma sensu biznesowego. Jesli pojawia sie rejected, sprawdz rejectionReason w historii zdarzen.",
          "Transfer to your own deviceId usually has no business effect. If you get rejected, check rejectionReason in event history."
        )
      });
    }
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

  function estimateDcBase(bytes) {
    return Math.max(1, Math.ceil(Number(bytes || 0) / 24));
  }

  function estimateDcTotal(bytes, copies = PLATFORM_COPY_COUNT) {
    return estimateDcBase(bytes) * Math.max(1, Number(copies) || 1);
  }

  function formatDcEstimate(bytes) {
    const base = estimateDcBase(bytes);
    const effective = estimateDcTotal(bytes);
    if (effective === base) return `~${base} DC`;
    return state.language === "en"
      ? `~${base} DC base / ~${effective} DC with copy x${PLATFORM_COPY_COUNT}`
      : `~${base} DC bazowe / ~${effective} DC przy copy x${PLATFORM_COPY_COUNT}`;
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

  function shortenMiddle(value, maxLength = 28) {
    const text = String(value || "");
    if (!text || text.length <= maxLength) return text;
    const safeMax = Math.max(11, Number(maxLength) || 28);
    const left = Math.max(4, Math.floor((safeMax - 3) / 2));
    const right = Math.max(4, safeMax - 3 - left);
    return `${text.slice(0, left)}...${text.slice(-right)}`;
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

  // Legacy override block kept only for reference; functions below are not used.
  function _legacy_applyLanguageOverride() {
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

  function _legacy_applyLogDockStateOverride() {
    document.body.dataset.logDock = state.logDockCollapsed ? "collapsed" : "expanded";
    if (refs.logDock) refs.logDock.classList.toggle("log-dock--collapsed", state.logDockCollapsed);
    if (refs.toggleLogDockButton) {
      refs.toggleLogDockButton.textContent = state.logDockCollapsed
        ? (state.language === "en" ? "Show log" : "Pokaż log")
        : (state.language === "en" ? "Minimize log" : "Zwiń log");
    }
  }

  function _legacy_updateSerialSupportOverride() {
    if (!refs.serialSupportNotice) return;
    refs.serialSupportNotice.textContent = "serial" in navigator
      ? (state.language === "en"
          ? "Before connecting over USB, close VS Code Serial Monitor, PlatformIO, MobaXterm and any app holding the COM port. You can also use Bluetooth or Wi-Fi bridge."
          : "Przed połączeniem przez USB zamknij VS Code Serial Monitor, PlatformIO, MobaXterm i inne aplikacje blokujące COM. Możesz też użyć Bluetooth albo mostka Wi‑Fi.")
      : (state.language === "en"
          ? "Web Serial is not available here. Use Bluetooth or the Wi-Fi bridge."
          : "Web Serial nie jest dostępny w tej przeglądarce. Użyj Bluetooth albo mostka Wi‑Fi.");
  }

  function _legacy_renderQuickMintChecklistOverride() {
    if (!refs.quickMintChecklist) return;
    const runtime = state.lorawanInfo?.runtime || state.lorawanInfo?.lorawanRuntime;
    const currentTick = normalizeTick(refs.mintTickInput?.value || "");
    const token = findToken(currentTick);
    const title = state.language === "en"
      ? "Quick path for an already configured device"
      : "Szybka ścieżka dla już skonfigurowanego urządzenia";
    const steps = state.language === "en"
      ? [
          isDeviceConnected() ? "Device connection is active." : "Connect the device (USB, Bluetooth or Wi-Fi).",
          state.deviceInfo?.hasKey ? "Device info and key are already available." : "Click Fetch info and confirm the device has a key.",
          runtime?.joined ? "LoRaWAN is already joined." : "Click Fetch radio and run Join LoRaWAN if joined=false.",
          token ? `Ticker ${currentTick} is visible in the indexer.` : "Refresh tokens or portfolio until the ticker appears.",
          "Open the mint card and click Prepare and send. For a brand new Heltec, use the onboarding section below."
        ]
      : [
          isDeviceConnected() ? "Połączenie z urządzeniem jest aktywne." : "Podłącz urządzenie (USB, Bluetooth lub Wi‑Fi).",
          state.deviceInfo?.hasKey ? "Info i klucz urządzenia są już dostępne." : "Kliknij \"Pobierz info\" i upewnij się, że urządzenie ma klucz.",
          runtime?.joined ? "LoRaWAN jest już joined." : "Kliknij \"Pobierz radio\", a jeśli trzeba także \"Join LoRaWAN\".",
          token ? `Ticker ${currentTick} jest widoczny w indexerze.` : "Odśwież tokeny albo portfolio, aż ticker pojawi się w indexerze.",
          "W karcie mintu kliknij \"Przygotuj i wyślij\". Jeśli to nowy Heltec, niżej masz pełny onboarding."
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

  function _legacy_renderOnboardingOverride() {
    if (!refs.onboardingChecklist) return;
    const items = state.language === "en"
      ? [
          { title: "1. Drivers and port", body: "Use Chrome or Edge. Close VS Code Serial Monitor, PlatformIO, MobaXterm and every app holding the COM port before clicking Connect device." },
          { title: "2. Firmware and key", body: "After connecting, fetch info, generate the key, read the public key and register the device in the indexer. If firmware changed, verify radio state and join." },
          { title: "3. LoRaWAN", body: "Fill DevEUI, JoinEUI and AppKey, save radio settings and then run join. Do not try mint when runtime shows joined=false or hardwareReady=false." },
          { title: "4. Indexer and webhook", body: "Check indexer health, link DevEUI to deviceId and confirm ChirpStack sends the webhook to /integrations/chirpstack with the current token." }
        ]
      : [
          { title: "1. Sterowniki i port", body: "Użyj Chrome albo Edge. Zamknij VS Code Serial Monitor, PlatformIO, MobaXterm i każdą aplikację trzymającą COM przed kliknięciem \"Połącz urządzenie\"." },
          { title: "2. Firmware i klucz", body: "Po połączeniu pobierz info, wygeneruj klucz, odczytaj public key i zarejestruj urządzenie w indexerze. Jeśli firmware był aktualizowany, sprawdź radio i join." },
          { title: "3. LoRaWAN", body: "Wypełnij DevEUI, JoinEUI, AppKey i zapisz radio. Potem wykonaj join. Nie próbuj mintu, gdy runtime pokazuje joined=false albo hardwareReady=false." },
          { title: "4. Indexer i webhook", body: "Sprawdź health indexera, podepnij DevEUI do deviceId i upewnij się, że ChirpStack wysyła webhook na /integrations/chirpstack z aktualnym tokenem." }
        ];
    refs.onboardingChecklist.innerHTML = items.map((item) => `
      <article class="guide-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");
  }

  function _legacy_renderEducationOverride() {
    if (!refs.educationContent) return;
    const mintBaseDc = estimateDcBase(81);
    const mintEffectiveDc = estimateDcTotal(81);
    refs.educationContent.innerHTML = state.language === "en"
      ? `
        <p>Every message is signed with Ed25519. The indexer uses the nonce to reject replay and duplicates. Only the first deploy counts for a ticker, and mint stops being indexed after max supply is reached.</p>
        <ul>
          <li><strong>Mint</strong>: currently about 81 B of payload, which is about ${mintBaseDc} DC of base cost in 24 B chunks. With the current tenant setting Max copy = ${PLATFORM_COPY_COUNT}, this becomes about ${mintEffectiveDc} DC of effective cost.</li>
          <li><strong>Prepare vs send</strong>: prepare only creates and signs the payload locally, while send also asks the radio to transmit a real LoRaWAN uplink.</li>
          <li><strong>Config</strong>: stores auto-mint settings and interval; round-robin profiles stay locally in Heltec after synchronization.</li>
          <li><strong>Security</strong>: the signature proves the author, nonce preserves order, and the webhook to the indexer should be protected by a separate token.</li>
        </ul>
      `
      : `
        <p>Każda wiadomość jest podpisywana Ed25519. Indexer używa nonce, żeby odrzucić replay i duplikaty. Deploy liczy się tylko pierwszy dla tickera, a mint przestaje być indeksowany po osiągnięciu max supply.</p>
        <ul>
          <li><strong>Mint</strong>: obecnie około 81 B payloadu, czyli około ${mintBaseDc} DC bazowego kosztu przy porcjach 24 B. Przy aktualnym ustawieniu tenantu Max copy = ${PLATFORM_COPY_COUNT} daje to około ${mintEffectiveDc} DC kosztu efektywnego.</li>
          <li><strong>Prepare vs send</strong>: prepare tylko tworzy i podpisuje payload lokalnie, a send dodatkowo zleca faktyczny uplink LoRaWAN.</li>
          <li><strong>Config</strong>: zapis ustawień auto-mintu i interwału; profile round-robin są utrzymywane lokalnie w Heltecu po synchronizacji.</li>
          <li><strong>Bezpieczeństwo</strong>: podpis udowadnia autora, nonce pilnuje kolejności, a webhook do indexera powinien być chroniony osobnym tokenem.</li>
        </ul>
      `;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();




