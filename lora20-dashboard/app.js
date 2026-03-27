const STORAGE_KEYS = {
  indexerBaseUrl: "lora20.dashboard.indexerBaseUrl",
  profiles: "lora20.dashboard.profiles",
  scheduler: "lora20.dashboard.scheduler",
  language: "lora20.dashboard.language",
  theme: "lora20.dashboard.theme",
  knownDevices: "lora20.dashboard.knownDevices"
};

const DEFAULT_INDEXER_BASE_URL = "https://lora20.hattimon.pl";
const DEFAULT_LANGUAGE = "pl";
const DEFAULT_THEME = "medium";
const DEFAULT_PROFILES = [
  {
    id: "seed-lora-100",
    name: "LORA / 100",
    tick: "LORA",
    amount: "100",
    intervalMinutes: 30,
    enabled: true
  }
];
const DEFAULT_SCHEDULER = {
  enabled: true,
  intervalMinutes: 30
};

const OPERATION_SIZES = {
  prepare_deploy: 89,
  prepare_mint: 81,
  prepare_transfer: 89,
  prepare_config: 74
};

const COMMAND_TIMEOUTS = {
  default: 15000,
  get_info: 20000,
  get_lorawan: 20000,
  join_lorawan: 45000,
  lorawan_send: 30000
};

const CONTENT = {
  pl: {
    hero: {
      eyebrow: "lora20 control plane",
      title: "Lekki panel do wysyłania inskrypcji przez Heltec V4 i LoRaWAN.",
      lead: "Panel prowadzi od onboardingu i konfiguracji radia do deploy, mint, transfer oraz odczytu balansu.",
      chipOne: "Web Serial + HTTPS",
      chipTwo: "Onboarding Heltec V4",
      chipThree: "Sticky log dock"
    },
    settings: {
      language: "Język",
      theme: "Motyw",
      indexerUrl: "Publiczny adres indexera"
    },
    actions: {
      saveUrl: "Zapisz URL",
      connect: "Połącz urządzenie",
      disconnect: "Rozłącz",
      refresh: "Odśwież stan",
      pullInfo: "Pobierz info",
      publicKey: "Odczytaj klucz",
      generateKey: "Wygeneruj klucz",
      register: "Zarejestruj w indexerze",
      pullRadio: "Pobierz radio",
      join: "Join LoRaWAN",
      reloadPortfolio: "Odśwież portfolio",
      reloadHistory: "Odśwież historię",
      reloadTokens: "Odśwież tokeny",
      checkHealth: "Sprawdź indexer",
      prepareMint: "Przygotuj mint",
      sendMint: "Przygotuj i wyślij",
      prepareDeploy: "Przygotuj deploy",
      sendDeploy: "Przygotuj i wyślij",
      prepareTransfer: "Przygotuj transfer",
      sendTransfer: "Przygotuj i wyślij",
      prepareConfig: "Przygotuj config",
      sendConfig: "Przygotuj i wyślij",
      saveProfile: "Zapisz profil",
      clearProfile: "Wyczyść edytor",
      syncQueue: "Synchronizuj kolejkę",
      syncBroadcast: "Synchronizuj + broadcast",
      stopQueue: "Zatrzymaj pętlę",
      saveLicense: "Zapisz licencję",
      saveRadio: "Zapisz radio",
      linkDevEui: "Powiąż DevEUI",
      exportBackup: "Eksportuj backup",
      importBackup: "Importuj backup",
      sendRaw: "Wyślij raw JSON"
    },
    sections: {
      overviewKicker: "Przegląd",
      overviewTitle: "Najważniejsze rzeczy na start",
      deviceKicker: "Urządzenie",
      deviceTitle: "Aktualny node i znane urządzenia",
      knownDevicesKicker: "Zapamiętane",
      knownDevicesTitle: "Skonfigurowane urządzenia",
      radioKicker: "Radio",
      radioTitle: "Gotowość LoRaWAN",
      portfolioKicker: "Portfolio",
      portfolioTitle: "Balanse i ostatnie zdarzenia",
      tokensKicker: "Tokeny",
      tokensTitle: "Wdrożone tickery i wypełnianie formularzy",
      operationsKicker: "Operacje",
      operationsTitle: "Deploy, mint, transfer i config",
      profilesKicker: "Profile",
      profilesTitle: "Biblioteka mintu i kolejka round-robin",
      onboardingKicker: "Onboarding",
      onboardingTitle: "Nowe urządzenie krok po kroku",
      educationKicker: "Edukacja",
      educationTitle: "Jak to działa i czego nie obiecuje protokół",
      advancedKicker: "Zaawansowane",
      advancedTitle: "Radio, backup i raw JSON"
    },
    overview: {
      deployedTokens: "Wdrożone tokeny",
      portfolioEntries: "Pozycje w portfelu",
      recentEvents: "Ostatnie zdarzenia",
      activeProfiles: "Aktywne profile"
    },
    device: {
      deviceId: "Device ID",
      nextNonce: "Następny nonce",
      autoMint: "Auto-mint",
      defaultMint: "Domyślny mint",
      waitingTitle: "Brak danych urządzenia",
      waitingBody: "Połącz Helteca przez Web Serial, a panel zapisze go też do listy znanych urządzeń.",
      knownHint: "Panel zapamiętuje lokalnie urządzenia, które były już odczytane.",
      activeTitle: "Urządzenie gotowe",
      activeBody: "Klucz i tożsamość są widoczne. Teraz sprawdź radio i limity tokena przed wysyłką."
    },
    radio: {
      joined: "Joined",
      port: "Port",
      event: "Ostatnie zdarzenie",
      devEui: "DevEUI",
      waitingTitle: "Radio jeszcze niegotowe",
      waitingBody: "Jeżeli `joined=false`, panel przed wysyłką najpierw wykona join i sprawdzi status.",
      okTitle: "Radio gotowe",
      okBody: "Urządzenie jest dołączone do sieci i może przyjąć kolejny uplink."
    },
    portfolio: {
      balancesTitle: "Tokeny w portfelu",
      historyTitle: "Ostatnie zdarzenia"
    },
    tokens: {
      search: "Szukaj tickera",
      quickPick: "Wybierz do formularzy"
    },
    operations: {
      focusKicker: "Najczęściej używane",
      mintTitle: "Mint tokena",
      noTokenSelectedTitle: "Nie wybrano tokena",
      noTokenSelectedBody: "Kliknij wdrożony ticker wyżej, aby wypełnić formularz i zobaczyć limity.",
      preflightTitle: "Analiza przed wysyłką",
      preflightBody: "Tu pojawią się limity tokena, ryzyka logiczne i szacowany koszt uplinku.",
      tick: "Tick",
      amount: "Ilość",
      payloadSize: "Payload",
      dcCost: "Szac. DC",
      protocol: "Protokół",
      allowRisky: "Pozwól wysłać mimo przewidywanego błędu indexera",
      deployTitle: "Deploy tokena",
      maxSupply: "Max supply",
      limitPerMint: "Limit per mint",
      transferTitle: "Transfer tokena",
      recipient: "Odbiorca deviceId",
      configTitle: "Config inscription",
      autoMintEnabled: "Auto-mint włączony",
      intervalSeconds: "Interwał (sekundy)",
      preparedPreview: "Podgląd ostatnio przygotowanego payloadu"
    },
    profiles: {
      name: "Nazwa",
      amount: "Mint amount",
      interval: "Preferowany interwał (min)",
      include: "Dodaj do aktywnej kolejki",
      loopEnabled: "Pętla włączona",
      loopInterval: "Interwał pętli (min)"
    },
    advanced: {
      radioConfig: "Konfiguracja LoRaWAN i licencja Heltec",
      license: "Licencja Heltec",
      autoDevEui: "Auto DevEUI",
      adr: "ADR",
      confirmed: "Confirmed uplink",
      devEui: "DevEUI",
      joinEui: "JoinEUI",
      appKey: "AppKey",
      appPort: "App port",
      dataRate: "Data rate",
      indexerBinding: "Powiązanie DevEUI",
      devEuiLink: "DevEUI do powiązania",
      backupTitle: "Backup i restore",
      exportPassphrase: "Hasło eksportu",
      importPassphrase: "Hasło importu",
      rawTitle: "Surowe polecenia i debug indexera"
    },
    logs: {
      kicker: "Raport zdarzeń",
      title: "Activity log"
    },
    misc: {
      browserHint: "Web Serial działa w Chrome lub Edge na HTTPS albo localhost.",
      browserUnsupported: "Ta przeglądarka nie obsługuje Web Serial. Użyj Chrome albo Edge.",
      disconnected: "Rozłączono",
      connected: "Połączono",
      ready: "Gotowe"
    }
  },
  en: {
    hero: {
      eyebrow: "lora20 control plane",
      title: "A lightweight panel for sending inscriptions over Heltec V4 and LoRaWAN.",
      lead: "The panel guides users from onboarding and radio setup to deploy, mint, transfer, and balance reads.",
      chipOne: "Web Serial + HTTPS",
      chipTwo: "Heltec V4 onboarding",
      chipThree: "Sticky log dock"
    },
    settings: {
      language: "Language",
      theme: "Theme",
      indexerUrl: "Public indexer URL"
    },
    actions: {
      saveUrl: "Save URL",
      connect: "Connect device",
      disconnect: "Disconnect",
      refresh: "Refresh state",
      pullInfo: "Pull info",
      publicKey: "Read public key",
      generateKey: "Generate key",
      register: "Register in indexer",
      pullRadio: "Pull radio",
      join: "Join LoRaWAN",
      reloadPortfolio: "Reload portfolio",
      reloadHistory: "Reload history",
      reloadTokens: "Reload tokens",
      checkHealth: "Check indexer",
      prepareMint: "Prepare mint",
      sendMint: "Prepare and send",
      prepareDeploy: "Prepare deploy",
      sendDeploy: "Prepare and send",
      prepareTransfer: "Prepare transfer",
      sendTransfer: "Prepare and send",
      prepareConfig: "Prepare config",
      sendConfig: "Prepare and send",
      saveProfile: "Save profile",
      clearProfile: "Clear editor",
      syncQueue: "Sync queue",
      syncBroadcast: "Sync + broadcast",
      stopQueue: "Stop loop",
      saveLicense: "Save license",
      saveRadio: "Save radio",
      linkDevEui: "Link DevEUI",
      exportBackup: "Export backup",
      importBackup: "Import backup",
      sendRaw: "Send raw JSON"
    },
    sections: {
      overviewKicker: "Overview",
      overviewTitle: "What matters first",
      deviceKicker: "Device",
      deviceTitle: "Current node and known devices",
      knownDevicesKicker: "Remembered",
      knownDevicesTitle: "Configured devices",
      radioKicker: "Radio",
      radioTitle: "LoRaWAN readiness",
      portfolioKicker: "Portfolio",
      portfolioTitle: "Balances and recent activity",
      tokensKicker: "Tokens",
      tokensTitle: "Deployed tickers and form autofill",
      operationsKicker: "Operations",
      operationsTitle: "Deploy, mint, transfer, and config",
      profilesKicker: "Profiles",
      profilesTitle: "Mint library and round-robin queue",
      onboardingKicker: "Onboarding",
      onboardingTitle: "New device step by step",
      educationKicker: "Education",
      educationTitle: "How it works and what the protocol does not promise",
      advancedKicker: "Advanced",
      advancedTitle: "Radio, backup, and raw JSON"
    },
    overview: {
      deployedTokens: "Deployed tokens",
      portfolioEntries: "Portfolio entries",
      recentEvents: "Recent events",
      activeProfiles: "Active profiles"
    },
    device: {
      deviceId: "Device ID",
      nextNonce: "Next nonce",
      autoMint: "Auto-mint",
      defaultMint: "Default mint",
      waitingTitle: "No device data yet",
      waitingBody: "Connect the Heltec over Web Serial and the panel will also store it in the known devices list.",
      knownHint: "The panel stores previously read devices locally.",
      activeTitle: "Device ready",
      activeBody: "The signing identity is available. Check radio readiness and token limits before sending."
    },
    radio: {
      joined: "Joined",
      port: "Port",
      event: "Last event",
      devEui: "DevEUI",
      waitingTitle: "Radio not ready yet",
      waitingBody: "If `joined=false`, the panel will perform join first and verify the status before sending.",
      okTitle: "Radio ready",
      okBody: "The device is joined and can accept the next uplink."
    },
    portfolio: {
      balancesTitle: "Tokens in wallet",
      historyTitle: "Recent events"
    },
    tokens: {
      search: "Search ticker",
      quickPick: "Fill forms from ticker"
    },
    operations: {
      focusKicker: "Most used",
      mintTitle: "Mint token",
      noTokenSelectedTitle: "No token selected",
      noTokenSelectedBody: "Click a deployed ticker above to fill the form and load its mint limits.",
      preflightTitle: "Preflight analysis",
      preflightBody: "Token limits, logical risks, and estimated uplink cost will appear here.",
      tick: "Tick",
      amount: "Amount",
      payloadSize: "Payload",
      dcCost: "Est. DC",
      protocol: "Protocol",
      allowRisky: "Allow send even if the indexer is expected to reject it",
      deployTitle: "Deploy token",
      maxSupply: "Max supply",
      limitPerMint: "Limit per mint",
      transferTitle: "Transfer token",
      recipient: "Recipient deviceId",
      configTitle: "Config inscription",
      autoMintEnabled: "Auto-mint enabled",
      intervalSeconds: "Interval (seconds)",
      preparedPreview: "Last prepared payload preview"
    },
    profiles: {
      name: "Name",
      amount: "Mint amount",
      interval: "Preferred interval (min)",
      include: "Include in active queue",
      loopEnabled: "Loop enabled",
      loopInterval: "Loop interval (min)"
    },
    advanced: {
      radioConfig: "LoRaWAN config and Heltec license",
      license: "Heltec license",
      autoDevEui: "Auto DevEUI",
      adr: "ADR",
      confirmed: "Confirmed uplink",
      devEui: "DevEUI",
      joinEui: "JoinEUI",
      appKey: "AppKey",
      appPort: "App port",
      dataRate: "Data rate",
      indexerBinding: "Link DevEUI",
      devEuiLink: "DevEUI to link",
      backupTitle: "Backup and restore",
      exportPassphrase: "Export passphrase",
      importPassphrase: "Import passphrase",
      rawTitle: "Raw commands and indexer debug"
    },
    logs: {
      kicker: "Activity feed",
      title: "Activity log"
    },
    misc: {
      browserHint: "Web Serial works in Chrome or Edge on HTTPS or localhost.",
      browserUnsupported: "This browser does not support Web Serial. Use Chrome or Edge.",
      disconnected: "Disconnected",
      connected: "Connected",
      ready: "Ready"
    }
  }
};

const SENSITIVE_KEYS = new Set([
  "appKeyHex",
  "passphrase",
  "licenseHex",
  "ciphertextHex",
  "tagHex",
  "saltHex",
  "ivHex",
  "backup"
]);

const refs = {
  languageSelect: document.getElementById("languageSelect"),
  themeSelect: document.getElementById("themeSelect"),
  indexerBaseUrlInput: document.getElementById("indexerBaseUrlInput"),
  saveIndexerButton: document.getElementById("saveIndexerButton"),
  connectButton: document.getElementById("connectButton"),
  disconnectButton: document.getElementById("disconnectButton"),
  refreshButton: document.getElementById("refreshButton"),
  connectionBadge: document.getElementById("connectionBadge"),
  serialSupportNotice: document.getElementById("serialSupportNotice"),
  overviewTokensValue: document.getElementById("overviewTokensValue"),
  overviewBalancesValue: document.getElementById("overviewBalancesValue"),
  overviewEventsValue: document.getElementById("overviewEventsValue"),
  overviewProfilesValue: document.getElementById("overviewProfilesValue"),
  overviewStatusNote: document.getElementById("overviewStatusNote"),
  getInfoButton: document.getElementById("getInfoButton"),
  getLorawanButton: document.getElementById("getLorawanButton"),
  deviceSummaryOutput: document.getElementById("deviceSummaryOutput"),
  lorawanSummaryOutput: document.getElementById("lorawanSummaryOutput"),
  deviceIdValue: document.getElementById("deviceIdValue"),
  nextNonceValue: document.getElementById("nextNonceValue"),
  autoMintValue: document.getElementById("autoMintValue"),
  defaultMintValue: document.getElementById("defaultMintValue"),
  lorawanJoinedValue: document.getElementById("lorawanJoinedValue"),
  lorawanPortValue: document.getElementById("lorawanPortValue"),
  lorawanEventValue: document.getElementById("lorawanEventValue"),
  lorawanDevEuiValue: document.getElementById("lorawanDevEuiValue"),
  deviceReadinessBanner: document.getElementById("deviceReadinessBanner"),
  knownDevicesList: document.getElementById("knownDevicesList"),
  radioActionHint: document.getElementById("radioActionHint"),
  generateKeyButton: document.getElementById("generateKeyButton"),
  getPublicKeyButton: document.getElementById("getPublicKeyButton"),
  joinLorawanButton: document.getElementById("joinLorawanButton"),
  heltecLicenseInput: document.getElementById("heltecLicenseInput"),
  setLicenseButton: document.getElementById("setLicenseButton"),
  lorawanAutoDevEuiInput: document.getElementById("lorawanAutoDevEuiInput"),
  lorawanAdrInput: document.getElementById("lorawanAdrInput"),
  lorawanConfirmedInput: document.getElementById("lorawanConfirmedInput"),
  lorawanDevEuiInput: document.getElementById("lorawanDevEuiInput"),
  lorawanJoinEuiInput: document.getElementById("lorawanJoinEuiInput"),
  lorawanAppKeyInput: document.getElementById("lorawanAppKeyInput"),
  lorawanAppPortInput: document.getElementById("lorawanAppPortInput"),
  lorawanDataRateInput: document.getElementById("lorawanDataRateInput"),
  setLorawanButton: document.getElementById("setLorawanButton"),
  backupPassphraseInput: document.getElementById("backupPassphraseInput"),
  backupImportPassphraseInput: document.getElementById("backupImportPassphraseInput"),
  backupJsonTextarea: document.getElementById("backupJsonTextarea"),
  exportBackupButton: document.getElementById("exportBackupButton"),
  importBackupButton: document.getElementById("importBackupButton"),
  registerDeviceButton: document.getElementById("registerDeviceButton"),
  linkDevEuiButton: document.getElementById("linkDevEuiButton"),
  linkDevEuiInput: document.getElementById("linkDevEuiInput"),
  deployTickInput: document.getElementById("deployTickInput"),
  deployMaxSupplyInput: document.getElementById("deployMaxSupplyInput"),
  deployLimitPerMintInput: document.getElementById("deployLimitPerMintInput"),
  deployPrepareButton: document.getElementById("deployPrepareButton"),
  deploySendButton: document.getElementById("deploySendButton"),
  mintTickInput: document.getElementById("mintTickInput"),
  mintAmountInput: document.getElementById("mintAmountInput"),
  mintPrepareButton: document.getElementById("mintPrepareButton"),
  mintSendButton: document.getElementById("mintSendButton"),
  transferTickInput: document.getElementById("transferTickInput"),
  transferAmountInput: document.getElementById("transferAmountInput"),
  transferRecipientInput: document.getElementById("transferRecipientInput"),
  transferPrepareButton: document.getElementById("transferPrepareButton"),
  transferSendButton: document.getElementById("transferSendButton"),
  configAutoMintEnabledInput: document.getElementById("configAutoMintEnabledInput"),
  configAutoMintIntervalInput: document.getElementById("configAutoMintIntervalInput"),
  configPrepareButton: document.getElementById("configPrepareButton"),
  configSendButton: document.getElementById("configSendButton"),
  profileNameInput: document.getElementById("profileNameInput"),
  profileTickInput: document.getElementById("profileTickInput"),
  profileAmountInput: document.getElementById("profileAmountInput"),
  profileIntervalInput: document.getElementById("profileIntervalInput"),
  profileEnabledInput: document.getElementById("profileEnabledInput"),
  saveProfileButton: document.getElementById("saveProfileButton"),
  clearProfileButton: document.getElementById("clearProfileButton"),
  profileQueueEnabledInput: document.getElementById("profileQueueEnabledInput"),
  profileQueueIntervalInput: document.getElementById("profileQueueIntervalInput"),
  syncProfilesButton: document.getElementById("syncProfilesButton"),
  syncProfilesBroadcastButton: document.getElementById("syncProfilesBroadcastButton"),
  stopProfilesButton: document.getElementById("stopProfilesButton"),
  profileQueuePreview: document.getElementById("profileQueuePreview"),
  profileList: document.getElementById("profileList"),
  loadPortfolioButton: document.getElementById("loadPortfolioButton"),
  reloadTokensButton: document.getElementById("reloadTokensButton"),
  tokenSearchInput: document.getElementById("tokenSearchInput"),
  tokenQuickPick: document.getElementById("tokenQuickPick"),
  tokenLibraryList: document.getElementById("tokenLibraryList"),
  portfolioList: document.getElementById("portfolioList"),
  recentTransactionsList: document.getElementById("recentTransactionsList"),
  selectedTokenSummary: document.getElementById("selectedTokenSummary"),
  operationWarnings: document.getElementById("operationWarnings"),
  estimatedPayloadValue: document.getElementById("estimatedPayloadValue"),
  estimatedDcValue: document.getElementById("estimatedDcValue"),
  protocolVersionValue: document.getElementById("protocolVersionValue"),
  allowRiskySendInput: document.getElementById("allowRiskySendInput"),
  onboardingChecklist: document.getElementById("onboardingChecklist"),
  educationContent: document.getElementById("educationContent"),
  healthButton: document.getElementById("healthButton"),
  healthOutput: document.getElementById("healthOutput"),
  tokenTickInput: document.getElementById("tokenTickInput"),
  tokenLookupButton: document.getElementById("tokenLookupButton"),
  tokenOutput: document.getElementById("tokenOutput"),
  balanceDeviceIdInput: document.getElementById("balanceDeviceIdInput"),
  balanceTickInput: document.getElementById("balanceTickInput"),
  balanceLookupButton: document.getElementById("balanceLookupButton"),
  balanceOutput: document.getElementById("balanceOutput"),
  transactionsDeviceIdInput: document.getElementById("transactionsDeviceIdInput"),
  transactionsTickInput: document.getElementById("transactionsTickInput"),
  transactionsLimitInput: document.getElementById("transactionsLimitInput"),
  transactionsButton: document.getElementById("transactionsButton"),
  transactionsOutput: document.getElementById("transactionsOutput"),
  rawCommandTextarea: document.getElementById("rawCommandTextarea"),
  sendRawCommandButton: document.getElementById("sendRawCommandButton"),
  preparedOutput: document.getElementById("preparedOutput"),
  activityLog: document.getElementById("activityLog")
};

const state = {
  port: null,
  reader: null,
  writer: null,
  nextRequestId: 1,
  pending: new Map(),
  readLoopTask: null,
  decoder: new TextDecoder(),
  deviceInfo: null,
  lorawanInfo: null,
  lastPrepared: null,
  profiles: loadProfiles(),
  scheduler: loadScheduler(),
  language: loadPreference(STORAGE_KEYS.language, DEFAULT_LANGUAGE),
  theme: loadPreference(STORAGE_KEYS.theme, DEFAULT_THEME),
  knownDevices: loadKnownDevices(),
  tokenCatalog: [],
  portfolio: [],
  recentTransactions: [],
  editingProfileId: null,
  indexerBaseUrl: loadIndexerBaseUrl(),
  formsHydrated: false,
  joinPollTimer: null,
  lastBootAt: 0
};

init();

function init() {
  applyLanguage(state.language);
  applyTheme(state.theme);
  refs.languageSelect.value = state.language;
  refs.themeSelect.value = state.theme;
  refs.indexerBaseUrlInput.value = state.indexerBaseUrl;
  refs.profileQueueEnabledInput.checked = state.scheduler.enabled;
  refs.profileQueueIntervalInput.value = String(state.scheduler.intervalMinutes);
  refs.serialSupportNotice.textContent = t("misc.browserHint");
  refs.disconnectButton.disabled = true;
  refs.protocolVersionValue.textContent = "v1 / Ed25519";

  syncConfigFormFromScheduler();
  bindEvents();
  renderOverview();
  renderDeviceReadiness();
  renderKnownDevices();
  renderProfiles();
  renderQueuePreview();
  renderPreparedOutput();
  renderDeviceSummary();
  renderLorawanSummary();
  renderPortfolio();
  renderRecentTransactions();
  renderTokenLibrary();
  renderOperationWarnings();
  renderOnboarding();
  renderEducation();
  clearProfileEditor();

  if (!("serial" in navigator)) {
    refs.serialSupportNotice.textContent = t("misc.browserUnsupported");
    refs.connectButton.disabled = true;
  }

  void loadIndexerDashboardData({ silent: true });
}

function bindEvents() {
  refs.languageSelect.addEventListener("change", () => {
    state.language = refs.languageSelect.value || DEFAULT_LANGUAGE;
    localStorage.setItem(STORAGE_KEYS.language, state.language);
    applyLanguage(state.language);
    renderAll();
  });
  refs.themeSelect.addEventListener("change", () => {
    state.theme = refs.themeSelect.value || DEFAULT_THEME;
    localStorage.setItem(STORAGE_KEYS.theme, state.theme);
    applyTheme(state.theme);
    renderAll();
  });
  refs.saveIndexerButton.addEventListener("click", saveIndexerBaseUrl);
  refs.connectButton.addEventListener("click", wrapUi(connectSerial));
  refs.disconnectButton.addEventListener("click", wrapUi(() => disconnectSerial({ notify: true })));
  refs.refreshButton.addEventListener("click", wrapUi(refreshDeviceState));
  refs.getInfoButton.addEventListener("click", wrapUi(async () => {
    const info = await sendCommand("get_info");
    state.deviceInfo = info;
    hydrateFromDevice(true);
    renderDeviceSummary();
  }));
  refs.getLorawanButton.addEventListener("click", wrapUi(async () => {
    const lorawan = await sendCommand("get_lorawan");
    state.lorawanInfo = lorawan;
    hydrateFromLoRaWan(true);
    renderLorawanSummary();
  }));
  refs.generateKeyButton.addEventListener("click", wrapUi(handleGenerateKey));
  refs.getPublicKeyButton.addEventListener("click", wrapUi(async () => {
    const result = await sendCommand("get_public_key");
    appendLog("device", "Public key loaded", result);
  }));
  refs.joinLorawanButton.addEventListener("click", wrapUi(handleJoin));
  refs.setLicenseButton.addEventListener("click", wrapUi(handleSetLicense));
  refs.setLorawanButton.addEventListener("click", wrapUi(handleSetLorawan));
  refs.exportBackupButton.addEventListener("click", wrapUi(handleExportBackup));
  refs.importBackupButton.addEventListener("click", wrapUi(handleImportBackup));
  refs.registerDeviceButton.addEventListener("click", wrapUi(handleRegisterDevice));
  refs.linkDevEuiButton.addEventListener("click", wrapUi(handleLinkDevEui));
  refs.deployPrepareButton.addEventListener("click", wrapUi(() => handleDeploy(false)));
  refs.deploySendButton.addEventListener("click", wrapUi(() => handleDeploy(true)));
  refs.mintPrepareButton.addEventListener("click", wrapUi(() => handleMint(false)));
  refs.mintSendButton.addEventListener("click", wrapUi(() => handleMint(true)));
  refs.transferPrepareButton.addEventListener("click", wrapUi(() => handleTransfer(false)));
  refs.transferSendButton.addEventListener("click", wrapUi(() => handleTransfer(true)));
  refs.configPrepareButton.addEventListener("click", wrapUi(() => handleConfigInscription(false)));
  refs.configSendButton.addEventListener("click", wrapUi(() => handleConfigInscription(true)));
  refs.saveProfileButton.addEventListener("click", wrapUi(saveProfileFromEditor));
  refs.clearProfileButton.addEventListener("click", clearProfileEditor);
  refs.syncProfilesButton.addEventListener("click", wrapUi(() => syncProfilesToDevice({ broadcastConfig: false })));
  refs.syncProfilesBroadcastButton.addEventListener(
    "click",
    wrapUi(() => syncProfilesToDevice({ broadcastConfig: true }))
  );
  refs.stopProfilesButton.addEventListener("click", wrapUi(stopProfileLoop));
  refs.profileList.addEventListener("click", wrapUi(handleProfileAction));
  refs.profileQueueEnabledInput.addEventListener("change", handleSchedulerInputChange);
  refs.profileQueueIntervalInput.addEventListener("input", handleSchedulerInputChange);
  refs.loadPortfolioButton.addEventListener("click", wrapUi(() => loadPortfolioSummary(true)));
  refs.reloadTokensButton.addEventListener("click", wrapUi(() => loadTokenCatalog(true)));
  refs.tokenSearchInput.addEventListener("input", renderTokenLibrary);
  refs.tokenQuickPick.addEventListener("change", () => {
    if (refs.tokenQuickPick.value) {
      fillOperationFormsFromToken(refs.tokenQuickPick.value);
    }
  });
  refs.tokenLibraryList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-token-select]");
    if (button) {
      fillOperationFormsFromToken(button.dataset.tokenSelect);
    }
  });
  refs.portfolioList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-token-select]");
    if (button) {
      fillOperationFormsFromToken(button.dataset.tokenSelect);
    }
  });
  refs.knownDevicesList?.addEventListener("click", wrapUi(handleKnownDeviceAction));
  refs.healthButton.addEventListener("click", wrapUi(loadHealth));
  refs.tokenLookupButton.addEventListener("click", wrapUi(loadToken));
  refs.balanceLookupButton.addEventListener("click", wrapUi(loadBalance));
  refs.transactionsButton.addEventListener("click", wrapUi(loadTransactions));
  refs.sendRawCommandButton.addEventListener("click", wrapUi(handleRawCommand));
  [
    refs.deployTickInput,
    refs.deployMaxSupplyInput,
    refs.deployLimitPerMintInput,
    refs.mintTickInput,
    refs.mintAmountInput,
    refs.transferTickInput,
    refs.transferAmountInput,
    refs.transferRecipientInput,
    refs.configAutoMintEnabledInput,
    refs.configAutoMintIntervalInput,
    refs.allowRiskySendInput
  ].forEach((element) => {
    element?.addEventListener("input", () => renderOperationWarnings());
    element?.addEventListener("change", () => renderOperationWarnings());
  });

  if ("serial" in navigator) {
    navigator.serial.addEventListener("disconnect", async (event) => {
      if (state.port && event.target === state.port) {
        await disconnectSerial({ notify: true });
      }
    });
  }
}

function wrapUi(handler) {
  return async (event) => {
    try {
      await handler(event);
    } catch (error) {
      appendLog("error", error instanceof Error ? error.message : String(error));
    }
  };
}

function renderAll() {
  renderOverview();
  renderDeviceReadiness();
  renderKnownDevices();
  renderProfiles();
  renderQueuePreview();
  renderPreparedOutput();
  renderDeviceSummary();
  renderLorawanSummary();
  renderPortfolio();
  renderRecentTransactions();
  renderTokenLibrary();
  renderOperationWarnings();
  renderOnboarding();
  renderEducation();
}

function loadIndexerBaseUrl() {
  return localStorage.getItem(STORAGE_KEYS.indexerBaseUrl) || DEFAULT_INDEXER_BASE_URL;
}

function loadPreference(key, fallback) {
  return localStorage.getItem(key) || fallback;
}

function loadKnownDevices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.knownDevices);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistKnownDevices() {
  localStorage.setItem(STORAGE_KEYS.knownDevices, JSON.stringify(state.knownDevices.slice(0, 12)));
}

function applyTheme(theme) {
  document.body.dataset.theme = theme || DEFAULT_THEME;
}

function applyLanguage(language) {
  const locale = CONTENT[language] ? language : DEFAULT_LANGUAGE;
  document.documentElement.lang = locale;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = t(element.dataset.i18n, locale);
    if (value) {
      element.textContent = value;
    }
  });
}

function t(path, locale = state.language || DEFAULT_LANGUAGE) {
  const segments = path.split(".");
  let cursor = CONTENT[locale] ?? CONTENT[DEFAULT_LANGUAGE];
  for (const segment of segments) {
    cursor = cursor?.[segment];
  }
  return typeof cursor === "string" ? cursor : path;
}

function localeText(pl, en) {
  return state.language === "pl" ? pl : en;
}

function isRecentBoot(windowMs = 8000) {
  return Boolean(state.lastBootAt) && Date.now() - state.lastBootAt < windowMs;
}

function formatClock(value) {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleTimeString();
}

function radioReadyForSend(runtime = state.lorawanInfo?.runtime) {
  return Boolean(runtime?.hardwareReady && runtime?.initialized && runtime?.configured && runtime?.joined);
}

function saveIndexerBaseUrl({ silent = false } = {}) {
  state.indexerBaseUrl = normalizeBaseUrl(refs.indexerBaseUrlInput.value) || DEFAULT_INDEXER_BASE_URL;
  refs.indexerBaseUrlInput.value = state.indexerBaseUrl;
  localStorage.setItem(STORAGE_KEYS.indexerBaseUrl, state.indexerBaseUrl);
  if (!silent) {
    appendLog("indexer", `Saved indexer URL: ${state.indexerBaseUrl}`);
  }
}

function loadProfiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profiles);
    const parsed = raw ? JSON.parse(raw) : DEFAULT_PROFILES;
    if (!Array.isArray(parsed) || !parsed.length) {
      return DEFAULT_PROFILES.map((profile, index) => normalizeProfile(profile, index));
    }
    return parsed.map((profile, index) => normalizeProfile(profile, index));
  } catch {
    return DEFAULT_PROFILES.map((profile, index) => normalizeProfile(profile, index));
  }
}

function loadScheduler() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.scheduler);
    const parsed = raw ? JSON.parse(raw) : DEFAULT_SCHEDULER;
    return normalizeScheduler(parsed);
  } catch {
    return { ...DEFAULT_SCHEDULER };
  }
}

function persistProfiles() {
  localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(state.profiles));
}

function persistScheduler() {
  localStorage.setItem(STORAGE_KEYS.scheduler, JSON.stringify(state.scheduler));
}

function normalizeScheduler(input) {
  const intervalMinutes = Number(input?.intervalMinutes);
  return {
    enabled: input?.enabled !== false,
    intervalMinutes: Number.isFinite(intervalMinutes) && intervalMinutes > 0 ? intervalMinutes : 30
  };
}

function normalizeProfile(input, index = 0) {
  const tick = String(input?.tick || "LORA").trim().toUpperCase().slice(0, 4) || "LORA";
  const amount = String(input?.amount || "100").trim() || "100";
  const intervalMinutes = Number(input?.intervalMinutes);
  return {
    id: input?.id || `profile-${Date.now()}-${index}`,
    name: String(input?.name || `${tick} / ${amount}`).trim() || `${tick} / ${amount}`,
    tick,
    amount,
    intervalMinutes: Number.isFinite(intervalMinutes) && intervalMinutes > 0 ? intervalMinutes : 30,
    enabled: input?.enabled !== false
  };
}

function profileFingerprint(profile) {
  return `${profile.tick}:${profile.amount}`;
}

function normalizeBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function createRequestId() {
  return `req-${state.nextRequestId++}`;
}

function updateConnectionBadge(label, variant = "") {
  refs.connectionBadge.textContent = label;
  refs.connectionBadge.className = "badge";
  if (variant) {
    refs.connectionBadge.classList.add(`badge--${variant}`);
  }
}

async function connectSerial() {
  if (!("serial" in navigator)) {
    throw new Error("Web Serial is not available in this browser.");
  }

  if (state.port) {
    await disconnectSerial({ notify: false });
  }

  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });

  state.port = port;
  state.reader = port.readable.getReader();
  state.writer = port.writable.getWriter();
  state.readLoopTask = readLoop();
  refs.connectButton.disabled = true;
  refs.disconnectButton.disabled = false;
  updateConnectionBadge(t("misc.connected"), "connected");
  appendLog("device", "Serial port connected.");

  await delay(1200);
  try {
    await refreshDeviceState();
  } catch (error) {
    appendLog("warn", "Initial device refresh failed after connect. Retrying once.");
    await delay(1200);
    await refreshDeviceState();
  }
}

async function disconnectSerial({ notify } = { notify: false }) {
  clearJoinPolling();
  rejectPending("Serial connection closed.");

  const reader = state.reader;
  const writer = state.writer;
  const port = state.port;

  state.reader = null;
  state.writer = null;
  state.port = null;
  state.readLoopTask = null;

  try {
    await reader?.cancel();
  } catch {}

  try {
    reader?.releaseLock();
  } catch {}

  try {
    writer?.releaseLock();
  } catch {}

  try {
    await port?.close();
  } catch {}

  refs.connectButton.disabled = !("serial" in navigator);
  refs.disconnectButton.disabled = true;
  updateConnectionBadge(t("misc.disconnected"), "warn");

  if (notify) {
    appendLog("device", "Serial port disconnected.");
  }
}

function rejectPending(message) {
  for (const pending of state.pending.values()) {
    clearTimeout(pending.timeoutId);
    pending.reject(new Error(message));
  }
  state.pending.clear();
}

async function readLoop() {
  let buffer = "";

  while (state.reader) {
    let chunk;
    try {
      chunk = await state.reader.read();
    } catch (error) {
      appendLog("error", "Serial read failed.", error instanceof Error ? error.message : String(error));
      break;
    }

    if (!chunk || chunk.done) {
      break;
    }

    buffer += state.decoder.decode(chunk.value, { stream: true });

    let newlineIndex = buffer.indexOf("\n");
    while (newlineIndex >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (line) {
        handleIncomingLine(line);
      }
      newlineIndex = buffer.indexOf("\n");
    }
  }

  if (state.port) {
    await disconnectSerial({ notify: true });
  }
}

function handleIncomingLine(line) {
  let payload;
  try {
    payload = JSON.parse(line);
  } catch {
    appendLog("serial", line);
    if (line.includes("ESP-ROM") || line.toLowerCase().includes("reset")) {
      state.lastBootAt = Date.now();
      appendLog(
        "device",
        localeText(
          "Wykryto restart płytki. Wstrzymaj wysyłkę, aż odświeżenie ponownie pokaże stan radia.",
          "Board reboot detected. Pause sending until refresh shows radio state again."
        )
      );
    }
    if (line.toLowerCase().includes("joined")) {
      scheduleJoinPolling();
    }
    return;
  }

  if (payload.type === "boot") {
    appendLog("boot", "Device boot event", sanitizeForLog(payload));
    scheduleJoinPolling();
    return;
  }

  if (payload.id && state.pending.has(payload.id)) {
    const pending = state.pending.get(payload.id);
    state.pending.delete(payload.id);
    clearTimeout(pending.timeoutId);

    if (payload.ok) {
      appendLog("rx", `${pending.command} ok`, sanitizeForLog(payload.result));
      pending.resolve(payload.result);
      return;
    }

    const error = new Error(payload.error?.message || payload.error?.code || "Unknown device error");
    appendLog("error", `${pending.command} failed`, sanitizeForLog(payload.error));
    pending.reject(error);
    return;
  }

  appendLog("event", "Device event", sanitizeForLog(payload));
}

async function sendCommand(command, params = {}) {
  if (!state.writer) {
    throw new Error("Connect the device first.");
  }

  const id = createRequestId();
  const request = { id, command, params };
  appendLog("tx", command, sanitizeForLog(request));

  const timeoutId = window.setTimeout(() => {
    const pending = state.pending.get(id);
    if (pending) {
      state.pending.delete(id);
      const extra =
        command === "lorawan_send"
          ? `${isRecentBoot(12000) ? " A recent reboot was detected." : ""} Verify join status, close VS Code / PlatformIO / serial monitors, and press RST if the board rebooted.`
          : "";
      pending.reject(new Error(`Timeout waiting for ${command}.${extra}`));
      appendLog("error", `${command} timed out`);
    }
  }, COMMAND_TIMEOUTS[command] ?? COMMAND_TIMEOUTS.default);

  const promise = new Promise((resolve, reject) => {
    state.pending.set(id, {
      command,
      resolve,
      reject,
      timeoutId
    });
  });

  await writeJsonLine(request);
  return promise;
}

async function writeJsonLine(payload) {
  const encoded = new TextEncoder().encode(`${JSON.stringify(payload)}\n`);
  await state.writer.write(encoded);
}

async function refreshDeviceState() {
  if (!state.port) {
    throw new Error("Connect the device before refreshing.");
  }

  const info = await sendCommand("get_info");
  const lorawan = await sendCommand("get_lorawan");
  state.deviceInfo = info;
  state.lorawanInfo = lorawan;
  hydrateFromDevice(!state.formsHydrated);
  hydrateFromLoRaWan(!state.formsHydrated);
  state.formsHydrated = true;
  rememberKnownDevice();
  renderDeviceSummary();
  renderLorawanSummary();
  await loadIndexerDashboardData({ silent: true });
  renderAll();
}

function hydrateFromDevice(force = false) {
  const device = state.deviceInfo?.device;
  if (!device) {
    return;
  }

  const autoMintIntervalSeconds = device.config?.autoMintIntervalSeconds || 1800;
  const queueIntervalMinutes = Math.max(1, Math.round(autoMintIntervalSeconds / 60));

  if (force) {
    state.scheduler = {
      enabled: Boolean(device.config?.autoMintEnabled),
      intervalMinutes: queueIntervalMinutes
    };
    persistScheduler();
    refs.profileQueueEnabledInput.checked = state.scheduler.enabled;
    refs.profileQueueIntervalInput.value = String(state.scheduler.intervalMinutes);
    syncConfigFormFromScheduler();

    refs.mintTickInput.value = device.config?.defaultTick || refs.mintTickInput.value;
    refs.mintAmountInput.value = String(device.config?.defaultMintAmount || refs.mintAmountInput.value);
    refs.deployTickInput.value = device.config?.defaultTick || refs.deployTickInput.value;
    refs.transferTickInput.value = device.config?.defaultTick || refs.transferTickInput.value;
    refs.balanceDeviceIdInput.value = device.deviceId || refs.balanceDeviceIdInput.value;
    refs.transactionsDeviceIdInput.value = device.deviceId || refs.transactionsDeviceIdInput.value;

    reconcileProfilesWithDevice(device.config?.profiles);
  }
}

function hydrateFromLoRaWan(force = false) {
  const config = state.lorawanInfo?.config;
  if (!config) {
    return;
  }

  if (force) {
    refs.lorawanAutoDevEuiInput.checked = Boolean(config.autoDevEui);
    refs.lorawanAdrInput.checked = Boolean(config.adr);
    refs.lorawanConfirmedInput.checked = Boolean(config.confirmedUplink);
    refs.lorawanDevEuiInput.value = config.devEuiHex || refs.lorawanDevEuiInput.value;
    refs.lorawanJoinEuiInput.value = config.joinEuiHex || refs.lorawanJoinEuiInput.value;
    refs.lorawanAppPortInput.value = String(config.appPort || 1);
    refs.lorawanDataRateInput.value = String(config.defaultDataRate ?? 3);
    refs.linkDevEuiInput.value = config.devEuiHex || refs.linkDevEuiInput.value;
  }
}

function reconcileProfilesWithDevice(deviceProfiles) {
  if (!Array.isArray(deviceProfiles)) {
    return;
  }

  const localProfiles = state.profiles.map((profile, index) => normalizeProfile(profile, index));
  const usedProfileIds = new Set();
  const nextProfiles = [];

  for (const deviceProfile of deviceProfiles) {
    const normalized = normalizeProfile(
      {
        name: `${deviceProfile.tick} / ${deviceProfile.amount}`,
        tick: deviceProfile.tick,
        amount: String(deviceProfile.amount),
        intervalMinutes: state.scheduler.intervalMinutes,
        enabled: deviceProfile.enabled !== false
      },
      nextProfiles.length
    );

    const match = localProfiles.find((profile) => {
      return !usedProfileIds.has(profile.id) && profileFingerprint(profile) === profileFingerprint(normalized);
    });

    if (match) {
      usedProfileIds.add(match.id);
      nextProfiles.push({
        ...match,
        enabled: true
      });
      continue;
    }

    nextProfiles.push({
      ...normalized,
      id: `device-${Date.now()}-${nextProfiles.length}`
    });
  }

  for (const profile of localProfiles) {
    if (usedProfileIds.has(profile.id)) {
      continue;
    }
    nextProfiles.push({
      ...profile,
      enabled: false
    });
  }

  state.profiles = nextProfiles;
  persistProfiles();
}

function renderDeviceSummary() {
  const device = state.deviceInfo?.device;
  if (!device) {
    refs.deviceIdValue.textContent = "-";
    refs.nextNonceValue.textContent = "-";
    refs.autoMintValue.textContent = "-";
    refs.defaultMintValue.textContent = "-";
    refs.deviceSummaryOutput.textContent = localeText("Brak danych urządzenia.", "No device data yet.");
    renderDeviceReadiness();
    return;
  }

  const profileCount = Array.isArray(device.config?.profiles) ? device.config.profiles.length : 0;
  refs.deviceIdValue.textContent = device.deviceId || "-";
  refs.nextNonceValue.textContent = String(device.nextNonce ?? "-");
  refs.autoMintValue.textContent = device.config.autoMintEnabled
    ? `${state.language === "pl" ? "Włączony" : "Enabled"} / ${device.config.autoMintIntervalSeconds}s / ${profileCount} ${state.language === "pl" ? "profil(i)" : "profile(s)"}`
    : `${state.language === "pl" ? "Wyłączony" : "Disabled"} / ${profileCount} ${state.language === "pl" ? "profil(i)" : "profile(s)"} ${state.language === "pl" ? "wczytanych" : "loaded"}`;
  refs.autoMintValue.textContent = device.config.autoMintEnabled
    ? `${localeText("Włączony", "Enabled")} / ${device.config.autoMintIntervalSeconds}s / ${profileCount} ${localeText("profil(i)", "profile(s)")}`
    : `${localeText("Wyłączony", "Disabled")} / ${profileCount} ${localeText("profil(i) wczytanych", "profile(s) loaded")}`;
  refs.defaultMintValue.textContent = `${device.config.defaultTick} / ${device.config.defaultMintAmount}`;
  refs.deviceSummaryOutput.textContent = formatJson(device);
  renderDeviceReadiness();
}

function renderLorawanSummary() {
  const config = state.lorawanInfo?.config;
  const runtime = state.lorawanInfo?.runtime;
  const heltec = state.lorawanInfo?.heltec;
  if (!config || !runtime) {
    refs.lorawanJoinedValue.textContent = "-";
    refs.lorawanPortValue.textContent = "-";
    refs.lorawanEventValue.textContent = "-";
    refs.lorawanDevEuiValue.textContent = "-";
    refs.lorawanSummaryOutput.textContent = localeText("Brak danych LoRaWAN.", "No LoRaWAN status yet.");
    renderRadioHint();
    return;
  }

  refs.lorawanJoinedValue.textContent = runtime.joined
    ? (state.language === "pl" ? "Tak" : "Yes")
    : runtime.joining
      ? (state.language === "pl" ? "Dołączanie..." : "Joining...")
      : (state.language === "pl" ? "Nie" : "No");
  refs.lorawanPortValue.textContent = String(config.appPort ?? "-");
  refs.lorawanEventValue.textContent = runtime.lastEvent || "-";
  refs.lorawanDevEuiValue.textContent = config.devEuiHex || runtime.chipIdHex || "-";
  refs.lorawanSummaryOutput.textContent = formatJson(sanitizeForLog({ config, runtime, heltec }));
  renderRadioHint();
}

function renderPreparedOutput() {
  refs.preparedOutput.textContent = state.lastPrepared
    ? formatJson(state.lastPrepared)
    : localeText("Brak przygotowanego payloadu.", "No prepared payload yet.");
}

async function handleGenerateKey() {
  const alreadyHasKey = Boolean(state.deviceInfo?.device?.hasKey);
  const force = alreadyHasKey
    ? window.confirm("Generate a new device key? This resets the active signing identity on the device.")
    : true;
  if (alreadyHasKey && !force) {
    appendLog("device", "Key generation cancelled.");
    return;
  }
  const result = await sendCommand("generate_key", { force });
  appendLog("device", "Key material updated", sanitizeForLog(result));
  await refreshDeviceState();
}

async function handleJoin() {
  const result = await sendCommand("join_lorawan");
  state.lorawanInfo = {
    ...(state.lorawanInfo || {}),
    runtime: result
  };
  renderLorawanSummary();
  scheduleJoinPolling();
}

function clearJoinPolling() {
  if (state.joinPollTimer) {
    window.clearTimeout(state.joinPollTimer);
    state.joinPollTimer = null;
  }
}

function scheduleJoinPolling() {
  clearJoinPolling();
  const startedAt = Date.now();

  const tick = async () => {
    if (!state.port) {
      return;
    }

    try {
      const lorawan = await sendCommand("get_lorawan");
      state.lorawanInfo = lorawan;
      renderLorawanSummary();
      if (lorawan.runtime?.joined || Date.now() - startedAt > 30000) {
        return;
      }
    } catch (error) {
      appendLog("warn", "Could not poll join status.", error instanceof Error ? error.message : String(error));
      return;
    }

    state.joinPollTimer = window.setTimeout(tick, 3000);
  };

  state.joinPollTimer = window.setTimeout(tick, 2000);
}

async function handleSetLicense() {
  const licenseHex = refs.heltecLicenseInput.value.trim();
  const result = await sendCommand("set_heltec_license", { licenseHex });
  appendLog("radio", "Heltec license updated", sanitizeForLog(result));
  await refreshDeviceState();
}

async function handleSetLorawan() {
  const params = {
    autoDevEui: refs.lorawanAutoDevEuiInput.checked,
    adr: refs.lorawanAdrInput.checked,
    confirmedUplink: refs.lorawanConfirmedInput.checked,
    appPort: Number(refs.lorawanAppPortInput.value),
    defaultDataRate: Number(refs.lorawanDataRateInput.value)
  };

  if (refs.lorawanDevEuiInput.value.trim()) {
    params.devEuiHex = refs.lorawanDevEuiInput.value.trim();
  }
  if (refs.lorawanJoinEuiInput.value.trim()) {
    params.joinEuiHex = refs.lorawanJoinEuiInput.value.trim();
  }
  if (refs.lorawanAppKeyInput.value.trim()) {
    params.appKeyHex = refs.lorawanAppKeyInput.value.trim();
  }

  const result = await sendCommand("set_lorawan", params);
  appendLog("radio", "LoRaWAN config saved", sanitizeForLog(result));
  state.lorawanInfo = result;
  await refreshDeviceState();
}

async function handleExportBackup() {
  const passphrase = refs.backupPassphraseInput.value;
  if (!passphrase) {
    throw new Error("Provide an export passphrase first.");
  }

  const result = await sendCommand("export_backup", { passphrase });
  refs.backupJsonTextarea.value = JSON.stringify(result, null, 2);
}

async function handleImportBackup() {
  const passphrase = refs.backupImportPassphraseInput.value;
  if (!passphrase) {
    throw new Error("Provide the import passphrase first.");
  }

  let backup;
  try {
    backup = JSON.parse(refs.backupJsonTextarea.value);
  } catch {
    throw new Error("Backup JSON is invalid.");
  }

  await sendCommand("import_backup", {
    passphrase,
    overwrite: true,
    backup
  });
  await refreshDeviceState();
}

async function handleRegisterDevice() {
  const publicKey = await sendCommand("get_public_key");
  const maybeDevEui = refs.linkDevEuiInput.value.trim();
  const result = await indexerRequest("/devices/register", {
    method: "POST",
    body: {
      publicKeyRaw: publicKey.publicKeyHex,
      lorawanDevEui: maybeDevEui || undefined
    }
  });
  appendLog("indexer", "Device registered in indexer", sanitizeForLog(result));
}

async function handleLinkDevEui() {
  const deviceId = state.deviceInfo?.device?.deviceId;
  const devEui = refs.linkDevEuiInput.value.trim();

  if (!deviceId) {
    throw new Error("Load device info first so the dashboard knows the deviceId.");
  }
  if (!devEui) {
    throw new Error("Provide a DevEUI to link.");
  }

  const result = await indexerRequest(`/devices/${deviceId}/lorawan`, {
    method: "PUT",
    body: { devEui }
  });
  appendLog("indexer", "DevEUI linked to deviceId", sanitizeForLog(result));
}

async function handleDeploy(sendNow) {
  await prepareAndMaybeSend("Deploy", "prepare_deploy", {
    tick: refs.deployTickInput.value.trim().toUpperCase(),
    maxSupply: refs.deployMaxSupplyInput.value.trim(),
    limitPerMint: refs.deployLimitPerMintInput.value.trim(),
    commit: false
  }, sendNow);
}

async function handleMint(sendNow) {
  await prepareAndMaybeSend("Mint", "prepare_mint", {
    tick: refs.mintTickInput.value.trim().toUpperCase(),
    amount: refs.mintAmountInput.value.trim(),
    commit: false
  }, sendNow);
}

async function handleTransfer(sendNow) {
  await prepareAndMaybeSend("Transfer", "prepare_transfer", {
    tick: refs.transferTickInput.value.trim().toUpperCase(),
    amount: refs.transferAmountInput.value.trim(),
    toDeviceId: refs.transferRecipientInput.value.trim().toLowerCase(),
    commit: false
  }, sendNow);
}

async function handleConfigInscription(sendNow) {
  await prepareAndMaybeSend("Config", "prepare_config", {
    autoMintEnabled: refs.configAutoMintEnabledInput.checked,
    autoMintIntervalSeconds: Number(refs.configAutoMintIntervalInput.value),
    commit: false
  }, sendNow);
}

async function prepareAndMaybeSend(label, prepareCommand, params, sendNow) {
  enforcePreflightOrThrow(prepareCommand);

  const prepared = await sendCommand(prepareCommand, params);
  state.lastPrepared = {
    label,
    preparedAt: new Date().toISOString(),
    result: prepared
  };
  renderPreparedOutput();

  if (!sendNow) {
    renderOperationWarnings();
    return prepared;
  }

  await ensureLoRaWanReadyForSend();
  const config = state.lorawanInfo?.config || {};
  const sendResult = await sendCommand("lorawan_send", {
    payloadHex: prepared.payloadHex,
    port: config.appPort || 1,
    confirmed: Boolean(config.confirmedUplink),
    commitNonce: true,
    nonceToCommit: prepared.nonce
  });

  state.lastPrepared.sendResult = sendResult;
  await waitForSendAcceptance();
  renderPreparedOutput();
  await refreshDeviceState();
  return { prepared, sendResult };
}

function enforcePreflightOrThrow(command) {
  const allowRisk = refs.allowRiskySendInput?.checked;
  const token = currentMintToken();
  const amount = parseBigIntOrNull(refs.mintAmountInput.value);

  if (command === "prepare_mint" && token && amount !== null) {
    if (amount > BigInt(token.limitPerMint) && !allowRisk) {
      throw new Error(`Mint ${amount.toString()} exceeds limitPerMint ${token.limitPerMint}. Enable risky send to force it.`);
    }
    if (BigInt(token.totalSupply) + amount > BigInt(token.maxSupply) && !allowRisk) {
      throw new Error(`Mint would exceed maxSupply ${token.maxSupply}. Enable risky send to force it.`);
    }
  }

  if (command === "prepare_mint" && !token && !allowRisk) {
    throw new Error("This token is not known in the indexer token list. Deploy it first or enable risky send to continue.");
  }

  if (command === "prepare_deploy") {
    const deployTick = refs.deployTickInput.value.trim().toUpperCase();
    const maxSupply = parseBigIntOrNull(refs.deployMaxSupplyInput.value);
    const limitPerMint = parseBigIntOrNull(refs.deployLimitPerMintInput.value);
    if (state.tokenCatalog.some((entry) => entry.tick === deployTick) && !allowRisk) {
      throw new Error(`Token ${deployTick} already exists. Deploy duplicates are rejected unless you explicitly override.`);
    }
    if (maxSupply !== null && limitPerMint !== null && limitPerMint > maxSupply && !allowRisk) {
      throw new Error("limitPerMint cannot be greater than maxSupply.");
    }
  }

  if (command === "prepare_transfer") {
    const transferTick = refs.transferTickInput.value.trim().toUpperCase();
    const transferAmount = parseBigIntOrNull(refs.transferAmountInput.value);
    const portfolioEntry = state.portfolio.find((entry) => entry.tick === transferTick);
    if (portfolioEntry && transferAmount !== null && transferAmount > BigInt(portfolioEntry.balance) && !allowRisk) {
      throw new Error(`Transfer ${transferAmount.toString()} exceeds indexed balance ${portfolioEntry.balance}.`);
    }
  }
}

async function ensureLoRaWanReadyForSend() {
  if (isRecentBoot(5000)) {
    appendLog(
      "radio",
      localeText(
        "Wykryto świeży restart urządzenia. Czekam chwilę na ponowną inicjalizację portu i radia.",
        "A recent device reboot was detected. Waiting briefly for serial and radio reinitialization."
      )
    );
    await delay(5000 - (Date.now() - state.lastBootAt));
  }

  const lorawan = await sendCommand("get_lorawan");
  state.lorawanInfo = lorawan;
  renderLorawanSummary();

  if (!lorawan.config?.hasJoinEui || !lorawan.config?.hasAppKey) {
    throw new Error("LoRaWAN config is incomplete. Set JoinEUI and AppKey first.");
  }

  if (!lorawan.heltec?.hasLicense) {
    throw new Error("Heltec vendor license is missing.");
  }

  if (lorawan.runtime?.queuePending) {
    throw new Error(
      localeText(
        "Urządzenie ma już uplink w kolejce. Poczekaj na zakończenie join lub enqueue poprzedniej wiadomości.",
        "The device already has an uplink queued. Wait for join or previous enqueue to finish first."
      )
    );
  }

  if (lorawan.runtime?.joined) {
    return;
  }

  appendLog(
    "radio",
    localeText(
      lorawan.runtime?.initialized
        ? "Radio nie jest joined. Uruchamiam join przed wysyłką."
        : "Radio po restarcie nie jest jeszcze zainicjalizowane. Join uruchomi też stos LoRaWAN przed wysyłką.",
      lorawan.runtime?.initialized
        ? "Radio is not joined. Starting join before send."
        : "Radio is not initialized after reboot yet. Join will also initialize the LoRaWAN stack before send."
    )
  );
  const joined = await sendCommand("join_lorawan");
  state.lorawanInfo = {
    ...(state.lorawanInfo || {}),
    runtime: joined
  };
  renderLorawanSummary();
  await waitForJoinReady();
}

async function waitForJoinReady() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 45000) {
    await delay(2500);
    const lorawan = await sendCommand("get_lorawan");
    state.lorawanInfo = lorawan;
    renderLorawanSummary();

    if (lorawan.runtime?.joined) {
      appendLog("radio", localeText("Join zakończony.", "Join completed."));
      return;
    }

    if (lorawan.runtime?.lastError) {
      throw new Error(lorawan.runtime.lastError);
    }
  }

  throw new Error(localeText("Join nie zakończył się w oczekiwanym czasie.", "Join did not complete in time."));
}

async function waitForSendAcceptance() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 12000) {
    await delay(1500);
    const lorawan = await sendCommand("get_lorawan");
    state.lorawanInfo = lorawan;
    renderLorawanSummary();

    if (lorawan.runtime?.lastSendAccepted || lorawan.runtime?.lastEvent === "uplink_enqueued") {
      appendLog(
        "radio",
        localeText("Uplink został przyjęty do kolejki radiowej urządzenia.", "Uplink was accepted by the device radio queue."),
        sanitizeForLog(lorawan.runtime)
      );
      return;
    }
  }

  const runtime = state.lorawanInfo?.runtime || {};
  throw new Error(
    localeText(
      `Urządzenie nie potwierdziło enqueue uplinku. lastEvent=${runtime.lastEvent || "-"}${runtime.lastError ? `, lastError=${runtime.lastError}` : ""}`,
      `The device did not confirm uplink enqueue. lastEvent=${runtime.lastEvent || "-"}${runtime.lastError ? `, lastError=${runtime.lastError}` : ""}`
    )
  );
}

function saveProfileFromEditor() {
  const profile = normalizeProfile({
    id: state.editingProfileId || `profile-${Date.now()}`,
    name: refs.profileNameInput.value.trim(),
    tick: refs.profileTickInput.value.trim(),
    amount: refs.profileAmountInput.value.trim(),
    intervalMinutes: Number(refs.profileIntervalInput.value),
    enabled: refs.profileEnabledInput.checked
  });

  if (!profile.tick || profile.tick.length !== 4) {
    throw new Error("Profile tick must be exactly 4 characters.");
  }
  if (!profile.amount || Number(profile.amount) <= 0) {
    throw new Error("Profile mint amount must be positive.");
  }
  if (!Number.isFinite(profile.intervalMinutes) || profile.intervalMinutes <= 0) {
    throw new Error("Profile interval must be a positive number of minutes.");
  }

  const existingIndex = state.profiles.findIndex((entry) => entry.id === profile.id);
  if (existingIndex >= 0) {
    state.profiles.splice(existingIndex, 1, profile);
  } else if (profile.enabled) {
    state.profiles.unshift(profile);
  } else {
    state.profiles.push(profile);
  }

  persistProfiles();
  renderProfiles();
  renderQueuePreview();
  clearProfileEditor();
}

function clearProfileEditor() {
  state.editingProfileId = null;
  refs.profileNameInput.value = "";
  refs.profileTickInput.value = "LORA";
  refs.profileAmountInput.value = "100";
  refs.profileIntervalInput.value = String(state.scheduler.intervalMinutes);
  refs.profileEnabledInput.checked = true;
}

function renderProfiles() {
  refs.profileList.innerHTML = "";

  if (!state.profiles.length) {
    refs.profileList.innerHTML = `<article class="profile-card"><strong>${escapeHtml(state.language === "pl" ? "Brak zapisanych profili." : "No profiles saved.")}</strong></article>`;
    return;
  }

  let queuePosition = 0;
  for (const [index, profile] of state.profiles.entries()) {
    const article = document.createElement("article");
    article.className = `profile-card${profile.enabled ? " profile-card--active" : ""}`;

    if (profile.enabled) {
      queuePosition += 1;
    }
    const queueBadge = profile.enabled
      ? `<span class="profile-chip profile-chip--teal">${escapeHtml(state.language === "pl" ? `kolejka #${queuePosition}` : `queue #${queuePosition}`)}</span>`
      : `<span class="profile-chip">${escapeHtml(state.language === "pl" ? "tylko biblioteka" : "library only")}</span>`;
    const toggleLabel = profile.enabled
      ? (state.language === "pl" ? "Usuń z kolejki" : "Remove from queue")
      : (state.language === "pl" ? "Dodaj do kolejki" : "Add to queue");

    article.innerHTML = `
      <div>
        <div class="profile-card__meta">
          <span class="profile-chip">${escapeHtml(profile.tick)}</span>
          <span class="profile-chip profile-chip--teal">${escapeHtml(String(profile.amount))}</span>
          <span class="profile-chip">${escapeHtml(String(profile.intervalMinutes))} ${escapeHtml(state.language === "pl" ? "min" : "min")}</span>
          ${queueBadge}
        </div>
        <h3>${escapeHtml(profile.name)}</h3>
      </div>
      <div class="button-row">
        <button class="button button--ghost" type="button" data-profile-action="edit" data-profile-id="${profile.id}">${escapeHtml(state.language === "pl" ? "Edytuj" : "Edit")}</button>
        <button class="button button--ghost" type="button" data-profile-action="toggle" data-profile-id="${profile.id}">${toggleLabel}</button>
        <button class="button button--ghost" type="button" data-profile-action="up" data-profile-id="${profile.id}">${escapeHtml(state.language === "pl" ? "Wyżej" : "Up")}</button>
        <button class="button button--ghost" type="button" data-profile-action="down" data-profile-id="${profile.id}">${escapeHtml(state.language === "pl" ? "Niżej" : "Down")}</button>
        <button class="button button--secondary" type="button" data-profile-action="solo" data-profile-id="${profile.id}">${escapeHtml(state.language === "pl" ? "Solo loop" : "Solo loop")}</button>
        <button class="button button--primary" type="button" data-profile-action="mint" data-profile-id="${profile.id}">${escapeHtml(state.language === "pl" ? "Mint teraz" : "Mint now")}</button>
        <button class="button button--ghost" type="button" data-profile-action="delete" data-profile-id="${profile.id}">${escapeHtml(state.language === "pl" ? "Usuń" : "Delete")}</button>
      </div>
    `;
    refs.profileList.append(article);
  }
}

function renderQueuePreview() {
  const queueProfiles = getQueueProfiles();
  if (!queueProfiles.length) {
    refs.profileQueuePreview.textContent = state.language === "pl"
      ? "Brak aktywnej kolejki. Zapisz profil i zostaw go włączonego w kolejce."
      : "No active queue yet. Save a profile and leave it enabled in the queue.";
    return;
  }

  refs.profileQueuePreview.textContent = formatJson({
    loopEnabled: refs.profileQueueEnabledInput.checked,
    intervalMinutes: Number(refs.profileQueueIntervalInput.value || state.scheduler.intervalMinutes),
    order: queueProfiles.map((profile, index) => ({
      position: index + 1,
      name: profile.name,
      tick: profile.tick,
      amount: profile.amount
    }))
  });
}

async function handleProfileAction(event) {
  const button = event.target.closest("[data-profile-action]");
  if (!button) {
    return;
  }

  const profile = state.profiles.find((entry) => entry.id === button.dataset.profileId);
  if (!profile) {
    return;
  }

  const action = button.dataset.profileAction;
  if (action === "edit") {
    state.editingProfileId = profile.id;
    refs.profileNameInput.value = profile.name;
    refs.profileTickInput.value = profile.tick;
    refs.profileAmountInput.value = profile.amount;
    refs.profileIntervalInput.value = String(profile.intervalMinutes);
    refs.profileEnabledInput.checked = Boolean(profile.enabled);
    return;
  }

  if (action === "delete") {
    state.profiles = state.profiles.filter((entry) => entry.id !== profile.id);
    persistProfiles();
    renderProfiles();
    renderQueuePreview();
    return;
  }

  if (action === "toggle") {
    const nextEnabled = !profile.enabled;
    state.profiles = state.profiles.filter((entry) => entry.id !== profile.id);
    profile.enabled = nextEnabled;
    if (nextEnabled) {
      const enabledCount = state.profiles.filter((entry) => entry.enabled).length;
      state.profiles.splice(enabledCount, 0, profile);
    } else {
      state.profiles.push(profile);
    }
    persistProfiles();
    renderProfiles();
    renderQueuePreview();
    return;
  }

  if (action === "up" || action === "down") {
    const direction = action === "up" ? -1 : 1;
    moveProfile(profile.id, direction);
    return;
  }

  if (action === "solo") {
    state.scheduler.enabled = true;
    state.scheduler.intervalMinutes = profile.intervalMinutes;
    persistScheduler();
    refs.profileQueueEnabledInput.checked = true;
    refs.profileQueueIntervalInput.value = String(profile.intervalMinutes);
    syncConfigFormFromScheduler();
    await syncProfilesToDevice({
      broadcastConfig: false,
      profiles: [
        {
          tick: profile.tick,
          amount: profile.amount,
          enabled: true
        }
      ]
    });
    appendLog("profile", `Device loop narrowed to solo profile ${profile.name}.`);
    return;
  }

  if (action === "mint") {
    await prepareAndMaybeSend("Profile mint", "prepare_mint", {
      tick: profile.tick,
      amount: profile.amount,
      commit: false
    }, true);
  }
}

function moveProfile(profileId, direction) {
  const currentIndex = state.profiles.findIndex((entry) => entry.id === profileId);
  if (currentIndex < 0) {
    return;
  }

  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= state.profiles.length) {
    return;
  }

  const swap = state.profiles[nextIndex];
  state.profiles[nextIndex] = state.profiles[currentIndex];
  state.profiles[currentIndex] = swap;
  persistProfiles();
  renderProfiles();
  renderQueuePreview();
}

function handleSchedulerInputChange() {
  updateSchedulerFromInputs();
  syncConfigFormFromScheduler();
  renderQueuePreview();
}

function updateSchedulerFromInputs() {
  state.scheduler = {
    enabled: refs.profileQueueEnabledInput.checked,
    intervalMinutes: normalizeScheduler({
      intervalMinutes: Number(refs.profileQueueIntervalInput.value)
    }).intervalMinutes
  };
  refs.profileQueueIntervalInput.value = String(state.scheduler.intervalMinutes);
  persistScheduler();
}

function syncConfigFormFromScheduler() {
  refs.configAutoMintEnabledInput.checked = state.scheduler.enabled;
  refs.configAutoMintIntervalInput.value = String(state.scheduler.intervalMinutes * 60);
}

function getQueueProfiles() {
  return state.profiles
    .filter((profile) => profile.enabled)
    .map((profile) => ({
      tick: profile.tick,
      amount: profile.amount,
      enabled: true,
      name: profile.name,
      intervalMinutes: profile.intervalMinutes
    }));
}

async function syncProfilesToDevice({ broadcastConfig, profiles } = {}) {
  updateSchedulerFromInputs();
  const queueProfiles = Array.isArray(profiles) ? profiles : getQueueProfiles();
  const queueEnabled = state.scheduler.enabled && queueProfiles.length > 0;

  if (state.scheduler.enabled && queueProfiles.length === 0) {
    throw new Error("Queue loop is enabled, but no profiles are selected.");
  }

  const intervalSeconds = state.scheduler.intervalMinutes * 60;
  await sendCommand("set_config", {
    autoMintEnabled: queueEnabled,
    autoMintIntervalSeconds: intervalSeconds,
    profiles: queueProfiles.map((profile) => ({
      tick: profile.tick,
      amount: profile.amount,
      enabled: true
    }))
  });

  refs.configAutoMintEnabledInput.checked = queueEnabled;
  refs.configAutoMintIntervalInput.value = String(intervalSeconds);
  appendLog(
    "profile",
    `Synced ${queueProfiles.length} profile(s) to the device queue.`,
    queueProfiles.map((profile, index) => ({
      position: index + 1,
      tick: profile.tick,
      amount: profile.amount
    }))
  );

  if (broadcastConfig) {
    await prepareAndMaybeSend("Queue config", "prepare_config", {
      autoMintEnabled: queueEnabled,
      autoMintIntervalSeconds: intervalSeconds,
      commit: false
    }, true);
  } else {
    await refreshDeviceState();
  }
}

async function stopProfileLoop() {
  updateSchedulerFromInputs();
  state.scheduler.enabled = false;
  persistScheduler();
  refs.profileQueueEnabledInput.checked = false;
  syncConfigFormFromScheduler();
  await syncProfilesToDevice({ broadcastConfig: false, profiles: getQueueProfiles() });
  appendLog("profile", "Auto-mint loop stopped. Queue remains stored on the device.");
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function renderOverview() {
  if (!refs.overviewTokensValue) {
    return;
  }

  refs.overviewTokensValue.textContent = String(state.tokenCatalog.length);
  refs.overviewBalancesValue.textContent = String(state.portfolio.length);
  refs.overviewEventsValue.textContent = String(state.recentTransactions.length);
  refs.overviewProfilesValue.textContent = String(state.profiles.filter((profile) => profile.enabled).length);

  const runtime = state.lorawanInfo?.runtime;
  const device = state.deviceInfo?.device;
  let variant = "neutral";
  let title = localeText("Podłącz urządzenie", "Connect a device");
  let body = localeText(
    "Pierwszy ekran ma odpowiadać na jedno pytanie: czy możesz bezpiecznie wysłać deploy, mint lub transfer.",
    "The first screen should answer one question: can you safely send deploy, mint, or transfer right now."
  );

  if (device && !runtime?.configured) {
    variant = "warn";
    title = localeText("Ustaw radio przed pierwszym mintem", "Configure radio before the first mint");
    body = localeText(
      "Masz już tożsamość urządzenia, ale LoRaWAN nie ma jeszcze pełnej konfiguracji OTAA.",
      "The device identity is ready, but LoRaWAN OTAA settings are still incomplete."
    );
  } else if (isRecentBoot()) {
    variant = "warn";
    title = localeText("Wykryto świeży restart płytki", "Recent board reboot detected");
    body = localeText(
      "Po komunikacie ESP-ROM poczekaj kilka sekund, odśwież radio i dopiero potem wysyłaj.",
      "After an ESP-ROM reboot message, wait a few seconds, refresh radio state, and only then send."
    );
  } else if (runtime?.queuePending) {
    variant = "warn";
    title = localeText("Uplink już czeka w kolejce", "An uplink is already queued");
    body = localeText(
      "Nie wysyłaj kolejnego payloadu, dopóki urządzenie nie potwierdzi enqueue albo nie skończy join.",
      "Do not send another payload until the device confirms enqueue or finishes join."
    );
  } else if (radioReadyForSend(runtime)) {
    variant = "ok";
    title = localeText("Ścieżka mintu jest gotowa", "Mint path is ready");
    body = localeText(
      "Urządzenie ma klucz, radio jest joined, a panel może wysłać podpisaną inskrypcję.",
      "The device key exists, radio is joined, and the panel can send a signed inscription."
    );
  } else if (device) {
    variant = "warn";
    title = localeText("Urządzenie jest widoczne, ale radio nie jest gotowe", "The device is visible, but radio is not ready");
    body = localeText(
      "Panel wymusi refresh i join przed wysyłką, ale brak join lub restart płytki nadal może opóźnić uplink.",
      "The panel will force refresh and join before sending, but missing join or a board reboot can still delay the uplink."
    );
  }

  refs.overviewStatusNote.className = `callout callout--${variant}`;
  refs.overviewStatusNote.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(body)}</p>
  `;
}

function rememberKnownDevice() {
  const device = state.deviceInfo?.device;
  const lorawan = state.lorawanInfo?.config;
  if (!device?.deviceId) {
    return;
  }

  const snapshot = {
    deviceId: device.deviceId,
    publicKeyHex: device.publicKeyHex || "",
    devEuiHex: lorawan?.devEuiHex || device.lorawan?.devEuiHex || "",
    defaultTick: device.config?.defaultTick || "LORA",
    defaultMintAmount: String(device.config?.defaultMintAmount || "1"),
    lastSeenAt: new Date().toISOString()
  };

  state.knownDevices = [
    snapshot,
    ...state.knownDevices.filter((entry) => entry.deviceId !== snapshot.deviceId)
  ].slice(0, 12);
  persistKnownDevices();
}

function renderDeviceReadiness() {
  if (!refs.deviceReadinessBanner) {
    return;
  }

  const device = state.deviceInfo?.device;
  if (!device) {
    refs.deviceReadinessBanner.className = "callout callout--neutral";
    refs.deviceReadinessBanner.innerHTML = `
      <strong>${escapeHtml(t("device.waitingTitle"))}</strong>
      <p>${escapeHtml(t("device.waitingBody"))}</p>
    `;
    return;
  }

  refs.deviceReadinessBanner.className = "callout callout--ok";
  refs.deviceReadinessBanner.innerHTML = `
    <strong>${escapeHtml(t("device.activeTitle"))}</strong>
    <p>${escapeHtml(t("device.activeBody"))}</p>
  `;

  const runtime = state.lorawanInfo?.runtime;
  if (isRecentBoot() || (runtime && !radioReadyForSend(runtime))) {
    const body = isRecentBoot()
      ? localeText(
          "Płytka właśnie się zresetowała. Daj jej kilka sekund, odśwież radio i dopiero wtedy wysyłaj inskrypcję.",
          "The board has just rebooted. Give it a few seconds, refresh radio state, and only then send an inscription."
        )
      : localeText(
          "Tożsamość urządzenia jest gotowa, ale tor radiowy nadal wymaga join lub ponownej inicjalizacji po resecie.",
          "The device identity is ready, but the radio path still needs join or post-reboot initialization."
        );

    refs.deviceReadinessBanner.className = "callout callout--warn";
    refs.deviceReadinessBanner.innerHTML = `
      <strong>${escapeHtml(t("device.activeTitle"))}</strong>
      <p>${escapeHtml(body)}</p>
    `;
  }
}

function renderRadioHint() {
  if (!refs.radioActionHint) {
    return;
  }

  const runtime = state.lorawanInfo?.runtime;
  const config = state.lorawanInfo?.config;
  const heltec = state.lorawanInfo?.heltec;

  let variant = "neutral";
  let title = t("radio.waitingTitle");
  let body = t("radio.waitingBody");

  if (config && !config.hasJoinEui) {
    variant = "danger";
    title = localeText("Brak JoinEUI", "JoinEUI missing");
    body = localeText("Ustaw JoinEUI i AppKey przed join lub wysyłką.", "Set JoinEUI and AppKey before join or send.");
  } else if (heltec && !heltec.hasLicense) {
    variant = "danger";
    title = localeText("Brak licencji Heltec", "Heltec license missing");
    body = localeText(
      "Ta płytka wymaga licencji vendorowej do inicjalizacji stosu radiowego.",
      "This board requires the vendor license before the radio stack can initialize."
    );
  } else if (runtime?.queuePending) {
    variant = "warn";
    title = localeText("Uplink oczekuje w kolejce", "Uplink waiting in queue");
    body = localeText(
      "Nie wysyłaj kolejnej wiadomości, dopóki poprzednia nie zostanie przyjęta albo dopóki nie skończy się join.",
      "Do not send another message until the previous one is accepted or until join finishes."
    );
  } else if (runtime && (!runtime.hardwareReady || !runtime.initialized)) {
    variant = "warn";
    title = localeText("Radio po restarcie jeszcze się podnosi", "Radio is still coming back after reboot");
    body = localeText(
      "To jest normalne po restarcie Helteca. Odśwież radio albo wykonaj join, żeby ponownie zainicjalizować stos.",
      "This is normal after a Heltec reboot. Refresh radio state or run join to initialize the stack again."
    );
  } else if (runtime?.joined) {
    variant = "ok";
    title = t("radio.okTitle");
    body = t("radio.okBody");
  } else if (runtime?.joining) {
    variant = "warn";
    title = localeText("Join w toku", "Join in progress");
    body = localeText(
      "Poczekaj na joined=true. Panel nie powinien nadawać, dopóki join się nie zakończy.",
      "Wait for joined=true. The panel should not transmit until join completes."
    );
  } else if (runtime?.configured) {
    variant = "warn";
    title = localeText("Radio skonfigurowane, ale niejoined", "Radio configured, not joined");
    body = localeText(
      "To jest normalne po resecie albo świeżym starcie. Kliknij Join lub pozwól panelowi zrobić auto-join przed send.",
      "This is normal after reset or a fresh start. Click Join or let the panel auto-join before send."
    );
  }

  refs.radioActionHint.className = `callout callout--${variant}`;
  refs.radioActionHint.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(body)}</p>
  `;
}

function renderKnownDevices() {
  if (!refs.knownDevicesList) {
    return;
  }

  refs.knownDevicesList.innerHTML = "";
  if (!state.knownDevices.length) {
    refs.knownDevicesList.innerHTML = `<article class="known-device"><strong>${escapeHtml(localeText("Brak zapisanych urządzeń.", "No saved devices yet."))}</strong></article>`;
    return;
  }

  for (const device of state.knownDevices) {
    const article = document.createElement("article");
    article.className = "known-device";
    article.innerHTML = `
      <div class="known-device__head">
        <div>
          <h3 class="mono">${escapeHtml(device.deviceId)}</h3>
          <p class="helper">${escapeHtml(device.devEuiHex || localeText("DevEUI jeszcze niepowiązane", "DevEUI pending"))}</p>
        </div>
        <span class="token-pill">${escapeHtml(device.defaultTick)} / ${escapeHtml(device.defaultMintAmount)}</span>
      </div>
      <div class="button-row">
        <button class="button button--ghost" type="button" data-known-device="${device.deviceId}">${escapeHtml(localeText("Użyj", "Use"))}</button>
      </div>
    `;
    refs.knownDevicesList.append(article);
  }
}

async function handleKnownDeviceAction(event) {
  const button = event.target.closest("[data-known-device]");
  if (!button) {
    return;
  }

  const deviceId = button.dataset.knownDevice;
  refs.balanceDeviceIdInput.value = deviceId;
  refs.transactionsDeviceIdInput.value = deviceId;
  await loadPortfolioSummary(true, deviceId);
  await loadRecentTransactionsSummary(true, deviceId);
}

async function loadIndexerDashboardData({ silent = false } = {}) {
  await Promise.allSettled([
    loadTokenCatalog(silent),
    loadPortfolioSummary(silent),
    loadRecentTransactionsSummary(silent)
  ]);
}

async function loadTokenCatalog(logSuccess = false) {
  const data = await indexerRequest("/tokens?limit=100");
  state.tokenCatalog = Array.isArray(data.tokens) ? data.tokens : [];
  refs.tokenOutput.textContent = formatJson(data);
  renderTokenLibrary();
  renderOperationWarnings();
  if (logSuccess) {
    appendLog("indexer", "Token library refreshed", { count: state.tokenCatalog.length });
  }
}

async function loadPortfolioSummary(logSuccess = false, explicitDeviceId = "") {
  const deviceId = (explicitDeviceId || refs.balanceDeviceIdInput.value || state.deviceInfo?.device?.deviceId || "").trim().toLowerCase();
  if (!deviceId) {
    state.portfolio = [];
    renderPortfolio();
    return;
  }

  const data = await indexerRequest(`/devices/${deviceId}/balances?limit=50`);
  state.portfolio = Array.isArray(data.balances) ? data.balances : [];
  refs.balanceOutput.textContent = formatJson(data);
  renderPortfolio();
  if (logSuccess) {
    appendLog("indexer", "Portfolio refreshed", { deviceId, balances: state.portfolio.length });
  }
}

async function loadRecentTransactionsSummary(logSuccess = false, explicitDeviceId = "") {
  const deviceId = (explicitDeviceId || refs.transactionsDeviceIdInput.value || state.deviceInfo?.device?.deviceId || "").trim().toLowerCase();
  const params = new URLSearchParams();
  if (deviceId) {
    params.set("deviceId", deviceId);
  }
  params.set("limit", "12");
  const data = await indexerRequest(`/transactions?${params.toString()}`);
  state.recentTransactions = Array.isArray(data.transactions) ? data.transactions : [];
  refs.transactionsOutput.textContent = formatJson(data);
  renderRecentTransactions();
  if (logSuccess) {
    appendLog("indexer", "Recent transactions refreshed", { deviceId, count: state.recentTransactions.length });
  }
}

function renderPortfolio() {
  if (!refs.portfolioList) {
    return;
  }

  refs.portfolioList.innerHTML = "";
  if (!state.portfolio.length) {
    refs.portfolioList.innerHTML = `<article class="token-card"><strong>${escapeHtml(localeText("Brak zindeksowanych balansów.", "No indexed balances yet."))}</strong></article>`;
    return;
  }

  for (const entry of state.portfolio) {
    const token = entry.token ?? {};
    const article = document.createElement("article");
    article.className = "token-card";
    article.innerHTML = `
      <div class="token-card__head">
        <div>
          <h3>${escapeHtml(entry.tick)}</h3>
          <p class="helper">${escapeHtml(entry.balance)} ${escapeHtml(localeText("jednostek", "units"))}</p>
        </div>
        <span class="token-pill">${escapeHtml(localeText("max mint", "max mint"))} ${escapeHtml(token.limitPerMint || "?")}</span>
      </div>
      <div class="token-meta">
        <span class="token-pill">${escapeHtml(localeText("supply", "supply"))} ${escapeHtml(token.totalSupply || "0")} / ${escapeHtml(token.maxSupply || "?")}</span>
      </div>
      <div class="button-row">
        <button class="button button--ghost" type="button" data-token-select="${escapeHtml(entry.tick)}">${escapeHtml(localeText("Użyj", "Use"))}</button>
      </div>
    `;
    refs.portfolioList.append(article);
  }
}

function renderRecentTransactions() {
  if (!refs.recentTransactionsList) {
    return;
  }

  refs.recentTransactionsList.innerHTML = "";
  if (!state.recentTransactions.length) {
    refs.recentTransactionsList.innerHTML = `<article class="timeline-card"><strong>${escapeHtml(localeText("Brak zindeksowanych zdarzeń.", "No indexed events yet."))}</strong></article>`;
    return;
  }

  for (const event of state.recentTransactions.slice(0, 8)) {
    const article = document.createElement("article");
    article.className = "timeline-card";
    article.innerHTML = `
      <div class="timeline-card__head">
        <div>
          <h3>${escapeHtml(event.opName || "EVENT")} ${event.tick ? `/${escapeHtml(event.tick)}` : ""}</h3>
          <p class="helper">${escapeHtml(event.status)}${event.rejectionReason ? ` • ${escapeHtml(event.rejectionReason)}` : ""}</p>
        </div>
        <span class="token-pill">${escapeHtml(formatClock(event.receivedAt || event.createdAt))}</span>
      </div>
      <div class="token-meta">
        <span class="token-pill">${escapeHtml(localeText("nonce", "nonce"))} ${escapeHtml(String(event.nonce ?? "-"))}</span>
        ${event.amount ? `<span class="token-pill">${escapeHtml(localeText("amount", "amount"))} ${escapeHtml(event.amount)}</span>` : ""}
      </div>
    `;
    refs.recentTransactionsList.append(article);
  }
}

function renderTokenLibrary() {
  if (!refs.tokenLibraryList || !refs.tokenQuickPick) {
    return;
  }

  const query = refs.tokenSearchInput?.value.trim().toUpperCase() || "";
  const tokens = state.tokenCatalog.filter((token) => !query || token.tick.includes(query));

  refs.tokenLibraryList.innerHTML = "";
  refs.tokenQuickPick.innerHTML = `<option value="">-</option>`;
  for (const token of state.tokenCatalog) {
    const option = document.createElement("option");
    option.value = token.tick;
    option.textContent = `${token.tick} • ${localeText("limit", "limit")} ${token.limitPerMint}`;
    refs.tokenQuickPick.append(option);
  }

  if (!tokens.length) {
    refs.tokenLibraryList.innerHTML = `<article class="token-card"><strong>${escapeHtml(localeText("Brak wdrożonych tokenów.", "No deployed tokens found."))}</strong></article>`;
    return;
  }

  for (const token of tokens) {
    const article = document.createElement("article");
    article.className = "token-card";
    article.innerHTML = `
      <div class="token-card__head">
        <div>
          <h3>${escapeHtml(token.tick)}</h3>
          <p class="helper">${escapeHtml(token.totalSupply)} / ${escapeHtml(token.maxSupply)}</p>
        </div>
        <span class="token-pill">${escapeHtml(localeText("max mint", "max mint"))} ${escapeHtml(token.limitPerMint)}</span>
      </div>
      <div class="button-row">
        <button class="button button--ghost" type="button" data-token-select="${escapeHtml(token.tick)}">${escapeHtml(localeText("Użyj", "Use"))}</button>
      </div>
    `;
    refs.tokenLibraryList.append(article);
  }
}

function fillOperationFormsFromToken(tick) {
  const token = state.tokenCatalog.find((entry) => entry.tick === tick);
  if (!token) {
    return;
  }

  refs.tokenQuickPick.value = token.tick;
  refs.mintTickInput.value = token.tick;
  refs.deployTickInput.value = token.tick;
  refs.transferTickInput.value = token.tick;
  refs.tokenTickInput.value = token.tick;
  refs.balanceTickInput.value = token.tick;
  refs.transactionsTickInput.value = token.tick;
  refs.deployLimitPerMintInput.value = token.limitPerMint;
  refs.deployMaxSupplyInput.value = token.maxSupply;
  renderOperationWarnings();
}

function currentMintToken() {
  const tick = refs.mintTickInput.value.trim().toUpperCase();
  return state.tokenCatalog.find((entry) => entry.tick === tick) ?? null;
}

function renderOperationWarnings() {
  if (!refs.operationWarnings || !refs.selectedTokenSummary) {
    return;
  }

  const token = currentMintToken();
  const mintAmount = parseBigIntOrNull(refs.mintAmountInput.value);
  const warnings = [];
  const deployTick = refs.deployTickInput.value.trim().toUpperCase();
  const deployMaxSupply = parseBigIntOrNull(refs.deployMaxSupplyInput.value);
  const deployLimitPerMint = parseBigIntOrNull(refs.deployLimitPerMintInput.value);
  const transferTick = refs.transferTickInput.value.trim().toUpperCase();
  const transferAmount = parseBigIntOrNull(refs.transferAmountInput.value);
  const portfolioEntry = state.portfolio.find((entry) => entry.tick === transferTick);
  const mintTick = refs.mintTickInput.value.trim().toUpperCase();

  if (token) {
    refs.selectedTokenSummary.className = "callout callout--ok";
    refs.selectedTokenSummary.innerHTML = `
      <strong>${escapeHtml(token.tick)}</strong>
      <p>${escapeHtml(token.totalSupply)} / ${escapeHtml(token.maxSupply)} minted • max ${escapeHtml(token.limitPerMint)} per mint</p>
    `;

    if (mintAmount !== null && mintAmount > BigInt(token.limitPerMint)) {
      warnings.push({ level: "danger", text: `Mint ${mintAmount.toString()} exceeds limitPerMint ${token.limitPerMint}.` });
    }

    if (mintAmount !== null && BigInt(token.totalSupply) + mintAmount > BigInt(token.maxSupply)) {
      warnings.push({ level: "danger", text: `Mint would exceed maxSupply ${token.maxSupply}.` });
    }
  } else {
    refs.selectedTokenSummary.className = "callout callout--neutral";
    refs.selectedTokenSummary.innerHTML = `
      <strong>${escapeHtml(t("operations.noTokenSelectedTitle"))}</strong>
      <p>${escapeHtml(t("operations.noTokenSelectedBody"))}</p>
    `;
    if (mintTick) {
      warnings.push({ level: "warn", text: `Token ${mintTick} is not in the deployed token list yet.` });
    }
  }

  if (!state.lorawanInfo?.config?.hasAppKey || !state.lorawanInfo?.config?.hasJoinEui) {
    warnings.push({ level: "danger", text: "LoRaWAN config is incomplete. Set JoinEUI and AppKey first." });
  } else if (state.lorawanInfo?.runtime?.joined === false) {
    warnings.push({ level: "warn", text: "Radio is not joined right now. The panel will run join before sending." });
  }

  if (deployTick && state.tokenCatalog.some((entry) => entry.tick === deployTick)) {
    warnings.push({ level: "warn", text: `Deploy ${deployTick} already exists and will be rejected by the indexer.` });
  }

  if (deployMaxSupply !== null && deployLimitPerMint !== null && deployLimitPerMint > deployMaxSupply) {
    warnings.push({ level: "danger", text: "Deploy limitPerMint is greater than maxSupply." });
  }

  if (portfolioEntry && transferAmount !== null && transferAmount > BigInt(portfolioEntry.balance)) {
    warnings.push({
      level: "danger",
      text: `Transfer ${transferAmount.toString()} exceeds indexed balance ${portfolioEntry.balance} for ${transferTick}.`
    });
  }

  const estimatedBytes = estimatePayloadSize("prepare_mint");
  const estimatedDc = estimateDataCredits(estimatedBytes);
  refs.estimatedPayloadValue.textContent = `${estimatedBytes} B`;
  refs.estimatedDcValue.textContent = `~${estimatedDc} DC`;
  refs.protocolVersionValue.textContent = "v1 / Ed25519";

  const top = warnings[0];
  const variant = top?.level === "danger" ? "danger" : top?.level === "warn" ? "warn" : "ok";
  const text = warnings.length
    ? warnings.map((entry) => `• ${entry.text}`).join("\n")
    : "No logical blockers detected for the current mint draft.";

  refs.operationWarnings.className = `callout callout--${variant}`;
  refs.operationWarnings.innerHTML = `
    <strong>${escapeHtml(t("operations.preflightTitle"))}</strong>
    <p>${escapeHtml(text)}</p>
  `;
}

function estimatePayloadSize(command) {
  return OPERATION_SIZES[command] ?? 0;
}

function estimateDataCredits(payloadBytes) {
  return Math.max(1, Math.ceil(Number(payloadBytes || 0) / 24));
}

function parseBigIntOrNull(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) {
    return null;
  }

  try {
    return BigInt(trimmed);
  } catch {
    return null;
  }
}

function renderOnboarding() {
  if (!refs.onboardingChecklist) {
    return;
  }

  const steps = state.language === "pl"
    ? [
        "Użyj Chrome albo Edge na HTTPS, kabla USB-C do danych i zamknij VS Code Serial Monitor, PlatformIO, MobaXterm, PuTTY lub inne blokery COM.",
        "Połącz płytkę, poczekaj aż skończą się logi po restarcie i dopiero wtedy odśwież info urządzenia oraz stan radia.",
        "Wygeneruj klucz tylko raz, zrób zaszyfrowany backup i nie rotuj tożsamości podpisującej bez wyraźnej potrzeby.",
        "Zapisz licencję Heltec, DevEUI, JoinEUI i AppKey, a potem wykonaj Join LoRaWAN.",
        "Zarejestruj urządzenie w indexerze i powiąż DevEUI, żeby ChirpStack kierował uplinki do właściwego deviceId.",
        "Przed mintem zawsze czytaj limit tokena. Panel blokuje oczywiste błędy, ale pozwala na świadome obejście."
      ]
    : [
        "Use Chrome or Edge over HTTPS, a data USB-C cable, and close VS Code Serial Monitor, PlatformIO, MobaXterm, PuTTY, or other COM blockers.",
        "Connect the board, wait for reboot noise to settle, then refresh device info and radio state.",
        "Generate the device key once, export an encrypted backup, and avoid rotating the signing key unless you really mean to reset identity.",
        "Store the Heltec license, DevEUI, JoinEUI, and AppKey, then run Join LoRaWAN.",
        "Register the device in the indexer and link the DevEUI so ChirpStack routes uplinks to the correct deviceId.",
        "Read token limits before mint. The panel blocks obvious mistakes by default but still allows an expert override."
      ];

  refs.onboardingChecklist.innerHTML = steps
    .map(
      (step, index) => `
        <article class="guide-card">
          <strong>${escapeHtml(`${index + 1}.`)} </strong>
          <p class="helper">${escapeHtml(step)}</p>
        </article>
      `
    )
    .join("");
}

function renderEducation() {
  if (!refs.educationContent) {
    return;
  }

  refs.educationContent.innerHTML = state.language === "pl"
    ? `
      <p><strong>Podpis i anti-replay.</strong> Każda inskrypcja jest podpisana kluczem urządzenia przez Ed25519 i ma nonce. Indexer weryfikuje podpis i odrzuca stare lub powtórzone nonce.</p>
      <p><strong>Co jest gwarantowane.</strong> Jeśli payload dotrze do indexera i przejdzie weryfikację, pochodzi od zarejestrowanej tożsamości urządzenia i nie jest replayem. Sam protokół nie gwarantuje, że każdy uplink LoRa zawsze dotrze do sieci.</p>
      <p><strong>Dlaczego payload jest duży.</strong> W v1 wewnątrz wiadomości jest pełny podpis Ed25519 o długości 64 bajtów. Dlatego mint ma około 81 bajtów, a deploy i transfer jeszcze więcej.</p>
      <ul>
        <li>Deploy wykonuje się raz na token.</li>
        <li>Mint jest ograniczony przez <code>limitPerMint</code> i <code>maxSupply</code>.</li>
        <li>Transfer zależy też od zindeksowanego balansu nadawcy.</li>
        <li>Wskaźnik DC w panelu jest heurystyką opartą o wiadra 24-bajtowe.</li>
      </ul>
    `
    : `
      <p><strong>Signature and anti-replay.</strong> Every inscription is signed by the device key with Ed25519 and includes a nonce. The indexer verifies the signature and rejects stale or replayed nonces.</p>
      <p><strong>What is guaranteed.</strong> If the payload reaches the indexer and verifies successfully, it came from the registered device identity and was not replayed. The protocol does not guarantee that every LoRa uplink always reaches the network.</p>
      <p><strong>Why payloads are large.</strong> v1 keeps the full 64-byte Ed25519 signature inside the message. That is why mint is about 81 bytes and deploy or transfer are even larger.</p>
      <ul>
        <li>Deploy is one-time per token.</li>
        <li>Mint is limited by <code>limitPerMint</code> and <code>maxSupply</code>.</li>
        <li>Transfer also depends on the indexed sender balance.</li>
        <li>The DC figure in the panel is a planning heuristic based on 24-byte buckets.</li>
      </ul>
    `;
}

async function loadHealth() {
  const data = await indexerRequest("/health");
  refs.healthOutput.textContent = formatJson(data);
}

async function loadToken() {
  const tick = refs.tokenTickInput.value.trim().toUpperCase();
  const data = await indexerRequest(`/tokens/${tick}`);
  refs.tokenOutput.textContent = formatJson(data);
}

async function loadBalance() {
  const deviceId = refs.balanceDeviceIdInput.value.trim().toLowerCase();
  const tick = refs.balanceTickInput.value.trim().toUpperCase();
  const data = await indexerRequest(`/balances/${deviceId}/${tick}`);
  refs.balanceOutput.textContent = formatJson(data);
}

async function loadTransactions() {
  const params = new URLSearchParams();
  const deviceId = refs.transactionsDeviceIdInput.value.trim().toLowerCase();
  const tick = refs.transactionsTickInput.value.trim().toUpperCase();
  const limit = refs.transactionsLimitInput.value.trim();

  if (deviceId) {
    params.set("deviceId", deviceId);
  }
  if (tick) {
    params.set("tick", tick);
  }
  if (limit) {
    params.set("limit", limit);
  }

  const data = await indexerRequest(`/transactions?${params.toString()}`);
  refs.transactionsOutput.textContent = formatJson(data);
}

async function handleRawCommand() {
  let payload;
  try {
    payload = JSON.parse(refs.rawCommandTextarea.value);
  } catch {
    throw new Error("Raw JSON is invalid.");
  }

  const command = payload.command || payload.method;
  if (!command) {
    throw new Error("Raw JSON must contain command or method.");
  }

  const result = await sendCommand(command, payload.params || {});
  appendLog("raw", `Raw command ${command} completed.`, sanitizeForLog(result));
}

async function indexerRequest(path, { method = "GET", body } = {}) {
  const baseUrl = normalizeBaseUrl(refs.indexerBaseUrlInput.value || state.indexerBaseUrl || DEFAULT_INDEXER_BASE_URL);
  if (!baseUrl) {
    throw new Error("Indexer base URL is empty.");
  }

  saveIndexerBaseUrl({ silent: true });

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "content-type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  }).catch((error) => {
    throw new Error(
      `${error.message}. If this dashboard runs on GitHub Pages, set CORS_ALLOWED_ORIGINS on the indexer.`
    );
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || `Indexer request failed with ${response.status}`);
  }
  return payload;
}

function appendLog(kind, message, detail = null) {
  const entry = document.createElement("article");
  entry.className = "log-entry";

  const head = document.createElement("div");
  head.className = "log-entry__head";
  head.innerHTML = `
    <span class="log-entry__kind">${escapeHtml(kind)}</span>
    <span class="mono">${new Date().toLocaleTimeString()}</span>
  `;

  const body = document.createElement("div");
  body.className = "log-entry__message";
  body.textContent = message;

  entry.append(head, body);

  if (detail !== null && detail !== undefined && detail !== "") {
    const pre = document.createElement("pre");
    pre.textContent = typeof detail === "string" ? detail : formatJson(detail);
    entry.append(pre);
  }

  refs.activityLog.prepend(entry);
  while (refs.activityLog.children.length > 40) {
    refs.activityLog.lastElementChild?.remove();
  }
}

function sanitizeForLog(value, parentKey = "") {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeForLog(entry, parentKey));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => {
        if (SENSITIVE_KEYS.has(key) || SENSITIVE_KEYS.has(parentKey)) {
          return [key, maskValue(entry)];
        }
        return [key, sanitizeForLog(entry, key)];
      })
    );
  }

  return value;
}

function maskValue(value) {
  if (typeof value !== "string") {
    return "[hidden]";
  }
  if (value.length <= 8) {
    return "[hidden]";
  }
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderOverview() {
  if (!refs.overviewTokensValue) {
    return;
  }

  refs.overviewTokensValue.textContent = String(state.tokenCatalog.length);
  refs.overviewBalancesValue.textContent = String(state.portfolio.length);
  refs.overviewEventsValue.textContent = String(state.recentTransactions.length);
  refs.overviewProfilesValue.textContent = String(state.profiles.filter((profile) => profile.enabled).length);

  const runtime = state.lorawanInfo?.runtime;
  const device = state.deviceInfo?.device;
  let variant = "neutral";
  let title = localeText("Podłącz urządzenie", "Connect a device");
  let body = localeText(
    "Najpierw połącz Helteca, sprawdź radio i dopiero potem przejdź do deploy, mint albo transferu.",
    "Connect the Heltec, verify radio state, and only then move to deploy, mint, or transfer."
  );

  if (device && !state.lorawanInfo?.config?.hasJoinEui) {
    variant = "danger";
    title = localeText("Brakuje konfiguracji OTAA", "OTAA configuration is incomplete");
    body = localeText(
      "Uzupełnij JoinEUI i AppKey. Bez tego panel nie powinien pozwolić na bezpieczny mint.",
      "Fill in JoinEUI and AppKey. Without them the panel should not allow a safe mint flow."
    );
  } else if (isRecentBoot()) {
    variant = "warn";
    title = localeText("Wykryto świeży restart płytki", "Recent board reboot detected");
    body = localeText(
      "Po komunikacie ESP-ROM odczekaj kilka sekund, odśwież stan i dopiero potem wysyłaj.",
      "After an ESP-ROM reboot message, wait a few seconds, refresh state, and only then send."
    );
  } else if (runtime?.queuePending) {
    variant = "warn";
    title = localeText("W kolejce jest już uplink", "An uplink is already queued");
    body = localeText(
      "Poczekaj aż urządzenie potwierdzi enqueue poprzedniej wiadomości albo zakończy join.",
      "Wait until the device confirms the previous enqueue or finishes join."
    );
  } else if (runtime && radioReadyForSend(runtime)) {
    variant = "ok";
    title = localeText("Ścieżka mintu jest gotowa", "The mint path is ready");
    body = localeText(
      "Radio jest joined, tożsamość urządzenia jest dostępna, a panel może wysłać podpisaną inskrypcję.",
      "Radio is joined, the device identity is available, and the panel can send a signed inscription."
    );
  } else if (device) {
    variant = "warn";
    title = localeText("Urządzenie jest widoczne, ale radio nie jest gotowe", "The device is visible, but radio is not ready");
    body = localeText(
      "Panel spróbuje odświeżyć stan i wykonać join przed wysyłką, ale po resecie Helteca nadal trzeba chwilę poczekać.",
      "The panel will try to refresh state and join before sending, but after a Heltec reboot you still need to wait briefly."
    );
  }

  refs.overviewStatusNote.className = `callout callout--${variant}`;
  refs.overviewStatusNote.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(body)}</p>
  `;
}

function renderDeviceSummary() {
  const device = state.deviceInfo?.device;
  if (!device) {
    refs.deviceIdValue.textContent = "-";
    refs.nextNonceValue.textContent = "-";
    refs.autoMintValue.textContent = "-";
    refs.defaultMintValue.textContent = "-";
    refs.deviceSummaryOutput.textContent = localeText("Brak danych urządzenia.", "No device data yet.");
    renderDeviceReadiness();
    return;
  }

  const profileCount = Array.isArray(device.config?.profiles) ? device.config.profiles.length : 0;
  refs.deviceIdValue.textContent = device.deviceId || "-";
  refs.nextNonceValue.textContent = String(device.nextNonce ?? "-");
  refs.autoMintValue.textContent = device.config.autoMintEnabled
    ? `${localeText("Włączony", "Enabled")} / ${device.config.autoMintIntervalSeconds}s / ${profileCount} ${localeText("profil(i)", "profile(s)")}`
    : `${localeText("Wyłączony", "Disabled")} / ${profileCount} ${localeText("profil(i) wczytanych", "profile(s) loaded")}`;
  refs.defaultMintValue.textContent = `${device.config.defaultTick} / ${device.config.defaultMintAmount}`;
  refs.deviceSummaryOutput.textContent = formatJson(device);
  renderDeviceReadiness();
}

function renderLorawanSummary() {
  const config = state.lorawanInfo?.config;
  const runtime = state.lorawanInfo?.runtime;
  const heltec = state.lorawanInfo?.heltec;

  if (!config || !runtime) {
    refs.lorawanJoinedValue.textContent = "-";
    refs.lorawanPortValue.textContent = "-";
    refs.lorawanEventValue.textContent = "-";
    refs.lorawanDevEuiValue.textContent = "-";
    refs.lorawanSummaryOutput.textContent = localeText("Brak danych LoRaWAN.", "No LoRaWAN status yet.");
    renderRadioHint();
    return;
  }

  refs.lorawanJoinedValue.textContent = runtime.joined
    ? localeText("Tak", "Yes")
    : runtime.joining
      ? localeText("Dołączanie...", "Joining...")
      : localeText("Nie", "No");
  refs.lorawanPortValue.textContent = String(config.appPort ?? "-");
  refs.lorawanEventValue.textContent = runtime.lastEvent || "-";
  refs.lorawanDevEuiValue.textContent = config.devEuiHex || runtime.chipIdHex || "-";
  refs.lorawanSummaryOutput.textContent = formatJson(sanitizeForLog({ config, runtime, heltec }));
  renderRadioHint();
}

function renderDeviceReadiness() {
  if (!refs.deviceReadinessBanner) {
    return;
  }

  const device = state.deviceInfo?.device;
  if (!device) {
    refs.deviceReadinessBanner.className = "callout callout--neutral";
    refs.deviceReadinessBanner.innerHTML = `
      <strong>${escapeHtml(t("device.waitingTitle"))}</strong>
      <p>${escapeHtml(t("device.waitingBody"))}</p>
    `;
    return;
  }

  const runtime = state.lorawanInfo?.runtime;
  const variant = isRecentBoot() || (runtime && !radioReadyForSend(runtime)) ? "warn" : "ok";
  const body = isRecentBoot()
    ? localeText(
        "Płytka właśnie się zresetowała. Daj jej kilka sekund, odśwież radio i dopiero wtedy wysyłaj inskrypcję.",
        "The board has just rebooted. Give it a few seconds, refresh radio state, and only then send an inscription."
      )
    : runtime && !radioReadyForSend(runtime)
      ? localeText(
          "Tożsamość urządzenia jest gotowa, ale tor radiowy nadal wymaga join lub ponownej inicjalizacji po resecie.",
          "The device identity is ready, but the radio path still needs join or post-reboot initialization."
        )
      : t("device.activeBody");

  refs.deviceReadinessBanner.className = `callout callout--${variant}`;
  refs.deviceReadinessBanner.innerHTML = `
    <strong>${escapeHtml(t("device.activeTitle"))}</strong>
    <p>${escapeHtml(body)}</p>
  `;
}

function renderRadioHint() {
  if (!refs.radioActionHint) {
    return;
  }

  const runtime = state.lorawanInfo?.runtime;
  const config = state.lorawanInfo?.config;
  const heltec = state.lorawanInfo?.heltec;

  let variant = "neutral";
  let title = t("radio.waitingTitle");
  let body = t("radio.waitingBody");

  if (config && !config.hasJoinEui) {
    variant = "danger";
    title = localeText("Brak JoinEUI", "JoinEUI missing");
    body = localeText("Ustaw JoinEUI i AppKey przed join lub wysyłką.", "Set JoinEUI and AppKey before join or send.");
  } else if (heltec && !heltec.hasLicense) {
    variant = "danger";
    title = localeText("Brak licencji Heltec", "Heltec license missing");
    body = localeText(
      "Ta płytka wymaga licencji vendorowej do inicjalizacji stosu radiowego.",
      "This board requires the vendor license before the radio stack can initialize."
    );
  } else if (runtime?.queuePending) {
    variant = "warn";
    title = localeText("Uplink oczekuje w kolejce", "Uplink waiting in queue");
    body = localeText(
      "Nie wysyłaj kolejnej wiadomości, dopóki poprzednia nie zostanie przyjęta albo dopóki nie skończy się join.",
      "Do not send another message until the previous one is accepted or until join finishes."
    );
  } else if (runtime && (!runtime.hardwareReady || !runtime.initialized)) {
    variant = "warn";
    title = localeText("Radio po restarcie jeszcze się podnosi", "Radio is still coming back after reboot");
    body = localeText(
      "To jest normalne po resecie Helteca. Odśwież radio albo wykonaj join, aby ponownie zainicjalizować stos.",
      "This is normal after a Heltec reboot. Refresh radio state or run join to initialize the stack again."
    );
  } else if (runtime?.joined) {
    variant = "ok";
    title = t("radio.okTitle");
    body = t("radio.okBody");
  } else if (runtime?.joining) {
    variant = "warn";
    title = localeText("Join w toku", "Join in progress");
    body = localeText(
      "Poczekaj na joined=true. Panel nie powinien nadawać, dopóki join się nie zakończy.",
      "Wait for joined=true. The panel should not transmit until join completes."
    );
  } else if (runtime?.configured) {
    variant = "warn";
    title = localeText("Radio skonfigurowane, ale niejoined", "Radio configured, not joined");
    body = localeText(
      "To jest normalne po resecie albo świeżym starcie. Kliknij Join lub pozwól panelowi zrobić auto-join przed send.",
      "This is normal after reset or a fresh start. Click Join or let the panel auto-join before send."
    );
  }

  refs.radioActionHint.className = `callout callout--${variant}`;
  refs.radioActionHint.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(body)}</p>
  `;
}

function renderKnownDevices() {
  if (!refs.knownDevicesList) {
    return;
  }

  refs.knownDevicesList.innerHTML = "";
  if (!state.knownDevices.length) {
    refs.knownDevicesList.innerHTML = `<article class="known-device"><strong>${escapeHtml(localeText("Brak zapisanych urządzeń.", "No saved devices yet."))}</strong></article>`;
    return;
  }

  for (const device of state.knownDevices) {
    const article = document.createElement("article");
    article.className = "known-device";
    article.innerHTML = `
      <div class="known-device__head">
        <div>
          <h3 class="mono">${escapeHtml(device.deviceId)}</h3>
          <p class="helper">${escapeHtml(device.devEuiHex || localeText("DevEUI jeszcze niepowiązane", "DevEUI pending"))}</p>
        </div>
        <span class="token-pill">${escapeHtml(device.defaultTick)} / ${escapeHtml(device.defaultMintAmount)}</span>
      </div>
      <div class="token-meta">
        <span class="token-pill">${escapeHtml(localeText("ostatnio", "last"))} ${escapeHtml(formatClock(device.lastSeenAt))}</span>
      </div>
      <div class="button-row">
        <button class="button button--ghost" type="button" data-known-device="${device.deviceId}">${escapeHtml(localeText("Użyj", "Use"))}</button>
      </div>
    `;
    refs.knownDevicesList.append(article);
  }
}

function renderPortfolio() {
  if (!refs.portfolioList) {
    return;
  }

  refs.portfolioList.innerHTML = "";
  if (!state.portfolio.length) {
    refs.portfolioList.innerHTML = `<article class="token-card"><strong>${escapeHtml(localeText("Brak zindeksowanych balansów.", "No indexed balances yet."))}</strong></article>`;
    return;
  }

  for (const entry of state.portfolio) {
    const token = entry.token ?? {};
    const article = document.createElement("article");
    article.className = "token-card";
    article.innerHTML = `
      <div class="token-card__head">
        <div>
          <h3>${escapeHtml(entry.tick)}</h3>
          <p class="helper">${escapeHtml(entry.balance)} ${escapeHtml(localeText("jednostek", "units"))}</p>
        </div>
        <span class="token-pill">${escapeHtml(localeText("max mint", "max mint"))} ${escapeHtml(token.limitPerMint || "?")}</span>
      </div>
      <div class="token-meta">
        <span class="token-pill">${escapeHtml(localeText("supply", "supply"))} ${escapeHtml(token.totalSupply || "0")} / ${escapeHtml(token.maxSupply || "?")}</span>
      </div>
      <div class="button-row">
        <button class="button button--ghost" type="button" data-token-select="${escapeHtml(entry.tick)}">${escapeHtml(localeText("Użyj", "Use"))}</button>
      </div>
    `;
    refs.portfolioList.append(article);
  }
}

function renderRecentTransactions() {
  if (!refs.recentTransactionsList) {
    return;
  }

  refs.recentTransactionsList.innerHTML = "";
  if (!state.recentTransactions.length) {
    refs.recentTransactionsList.innerHTML = `<article class="timeline-card"><strong>${escapeHtml(localeText("Brak zindeksowanych zdarzeń.", "No indexed events yet."))}</strong></article>`;
    return;
  }

  for (const event of state.recentTransactions.slice(0, 8)) {
    const article = document.createElement("article");
    article.className = "timeline-card";
    const statusLine = event.rejectionReason
      ? `${event.status} • ${event.rejectionReason}`
      : event.status;
    article.innerHTML = `
      <div class="timeline-card__head">
        <div>
          <h3>${escapeHtml(event.opName || "EVENT")} ${event.tick ? `/${escapeHtml(event.tick)}` : ""}</h3>
          <p class="helper">${escapeHtml(statusLine)}</p>
        </div>
        <span class="token-pill">${escapeHtml(formatClock(event.receivedAt || event.createdAt))}</span>
      </div>
      <div class="token-meta">
        <span class="token-pill">${escapeHtml(localeText("nonce", "nonce"))} ${escapeHtml(String(event.nonce ?? "-"))}</span>
        ${event.amount ? `<span class="token-pill">${escapeHtml(localeText("amount", "amount"))} ${escapeHtml(event.amount)}</span>` : ""}
      </div>
    `;
    refs.recentTransactionsList.append(article);
  }
}

function renderTokenLibrary() {
  if (!refs.tokenLibraryList || !refs.tokenQuickPick) {
    return;
  }

  const query = refs.tokenSearchInput?.value.trim().toUpperCase() || "";
  const tokens = state.tokenCatalog.filter((token) => !query || token.tick.includes(query));

  refs.tokenLibraryList.innerHTML = "";
  refs.tokenQuickPick.innerHTML = `<option value="">-</option>`;
  for (const token of state.tokenCatalog) {
    const option = document.createElement("option");
    option.value = token.tick;
    option.textContent = `${token.tick} • ${localeText("limit", "limit")} ${token.limitPerMint}`;
    refs.tokenQuickPick.append(option);
  }

  if (!tokens.length) {
    refs.tokenLibraryList.innerHTML = `<article class="token-card"><strong>${escapeHtml(localeText("Brak wdrożonych tokenów.", "No deployed tokens found."))}</strong></article>`;
    return;
  }

  for (const token of tokens) {
    const article = document.createElement("article");
    article.className = "token-card";
    article.innerHTML = `
      <div class="token-card__head">
        <div>
          <h3>${escapeHtml(token.tick)}</h3>
          <p class="helper">${escapeHtml(token.totalSupply)} / ${escapeHtml(token.maxSupply)}</p>
        </div>
        <span class="token-pill">${escapeHtml(localeText("max mint", "max mint"))} ${escapeHtml(token.limitPerMint)}</span>
      </div>
      <div class="button-row">
        <button class="button button--ghost" type="button" data-token-select="${escapeHtml(token.tick)}">${escapeHtml(localeText("Użyj", "Use"))}</button>
      </div>
    `;
    refs.tokenLibraryList.append(article);
  }
}

function renderOperationWarnings() {
  if (!refs.operationWarnings || !refs.selectedTokenSummary) {
    return;
  }

  const token = currentMintToken();
  const mintAmount = parseBigIntOrNull(refs.mintAmountInput.value);
  const warnings = [];
  const deployTick = refs.deployTickInput.value.trim().toUpperCase();
  const deployMaxSupply = parseBigIntOrNull(refs.deployMaxSupplyInput.value);
  const deployLimitPerMint = parseBigIntOrNull(refs.deployLimitPerMintInput.value);
  const transferTick = refs.transferTickInput.value.trim().toUpperCase();
  const transferAmount = parseBigIntOrNull(refs.transferAmountInput.value);
  const portfolioEntry = state.portfolio.find((entry) => entry.tick === transferTick);
  const mintTick = refs.mintTickInput.value.trim().toUpperCase();
  const runtime = state.lorawanInfo?.runtime;

  if (token) {
    refs.selectedTokenSummary.className = "callout callout--ok";
    refs.selectedTokenSummary.innerHTML = `
      <strong>${escapeHtml(token.tick)}</strong>
      <p>${escapeHtml(token.totalSupply)} / ${escapeHtml(token.maxSupply)} ${escapeHtml(localeText("zindeksowane", "indexed"))} • ${escapeHtml(localeText("max", "max"))} ${escapeHtml(token.limitPerMint)} ${escapeHtml(localeText("na jeden mint", "per mint"))}</p>
    `;

    if (mintAmount !== null && mintAmount > BigInt(token.limitPerMint)) {
      warnings.push({
        level: "danger",
        text: localeText(
          `Mint ${mintAmount.toString()} przekracza limitPerMint ${token.limitPerMint}.`,
          `Mint ${mintAmount.toString()} exceeds limitPerMint ${token.limitPerMint}.`
        )
      });
    }

    if (mintAmount !== null && BigInt(token.totalSupply) + mintAmount > BigInt(token.maxSupply)) {
      warnings.push({
        level: "danger",
        text: localeText(
          `Mint przekroczyłby maxSupply ${token.maxSupply}.`,
          `Mint would exceed maxSupply ${token.maxSupply}.`
        )
      });
    }
  } else {
    refs.selectedTokenSummary.className = "callout callout--neutral";
    refs.selectedTokenSummary.innerHTML = `
      <strong>${escapeHtml(t("operations.noTokenSelectedTitle"))}</strong>
      <p>${escapeHtml(t("operations.noTokenSelectedBody"))}</p>
    `;
    if (mintTick) {
      warnings.push({
        level: "warn",
        text: localeText(
          `Token ${mintTick} nie jest jeszcze w liście wdrożonych tickerów.`,
          `Token ${mintTick} is not in the deployed token list yet.`
        )
      });
    }
  }

  if (!state.lorawanInfo?.config?.hasAppKey || !state.lorawanInfo?.config?.hasJoinEui) {
    warnings.push({
      level: "danger",
      text: localeText(
        "Konfiguracja LoRaWAN jest niepełna. Najpierw ustaw JoinEUI i AppKey.",
        "LoRaWAN config is incomplete. Set JoinEUI and AppKey first."
      )
    });
  } else if (runtime && !radioReadyForSend(runtime)) {
    warnings.push({
      level: "warn",
      text: localeText(
        "Radio nie jest jeszcze gotowe do bezpiecznej wysyłki. Panel wymusi refresh i join przed send.",
        "Radio is not ready for a safe send yet. The panel will refresh and join before send."
      )
    });
  }

  if (deployTick && state.tokenCatalog.some((entry) => entry.tick === deployTick)) {
    warnings.push({
      level: "warn",
      text: localeText(
        `Deploy ${deployTick} już istnieje i indexer go odrzuci.`,
        `Deploy ${deployTick} already exists and will be rejected by the indexer.`
      )
    });
  }

  if (deployMaxSupply !== null && deployLimitPerMint !== null && deployLimitPerMint > deployMaxSupply) {
    warnings.push({
      level: "danger",
      text: localeText(
        "W deploy limitPerMint jest większy niż maxSupply.",
        "Deploy limitPerMint is greater than maxSupply."
      )
    });
  }

  if (portfolioEntry && transferAmount !== null && transferAmount > BigInt(portfolioEntry.balance)) {
    warnings.push({
      level: "danger",
      text: localeText(
        `Transfer ${transferAmount.toString()} przekracza zindeksowany balans ${portfolioEntry.balance} dla ${transferTick}.`,
        `Transfer ${transferAmount.toString()} exceeds indexed balance ${portfolioEntry.balance} for ${transferTick}.`
      )
    });
  }

  const estimatedBytes = estimatePayloadSize("prepare_mint");
  const estimatedDc = estimateDataCredits(estimatedBytes);
  refs.estimatedPayloadValue.textContent = `${estimatedBytes} B`;
  refs.estimatedDcValue.textContent = `~${estimatedDc} DC (${localeText("koszyk 24 B", "24 B bucket")})`;
  refs.protocolVersionValue.textContent = "v1 / Ed25519 / LoRaWAN";

  const top = warnings[0];
  const variant = top?.level === "danger" ? "danger" : top?.level === "warn" ? "warn" : "ok";
  const text = warnings.length
    ? warnings.map((entry) => `• ${entry.text}`).join("\n")
    : localeText(
        "Nie wykryto logicznych blokad dla aktualnego szkicu mintu.",
        "No logical blockers detected for the current mint draft."
      );

  refs.operationWarnings.className = `callout callout--${variant}`;
  refs.operationWarnings.innerHTML = `
    <strong>${escapeHtml(t("operations.preflightTitle"))}</strong>
    <p>${escapeHtml(text)}</p>
  `;
}

function renderOnboarding() {
  if (!refs.onboardingChecklist) {
    return;
  }

  const installGuide = "https://github.com/hattimon/lora20-firmware/blob/main/docs/install-platformio-vscode.md";
  const flashGuide = "https://github.com/hattimon/lora20-firmware/blob/main/docs/flashing-windows.md";
  const serialGuide = "https://github.com/hattimon/lora20-firmware/blob/main/docs/serial-api.md";

  const steps = state.language === "pl"
    ? [
        {
          title: "1. Przygotuj komputer hosta",
          body: `Użyj Chrome albo Edge na HTTPS. Jeśli konfigurujesz nowe urządzenie, doinstaluj PlatformIO według <a href="${installGuide}" target="_blank" rel="noreferrer">instrukcji VS Code</a>.`
        },
        {
          title: "2. Upewnij się, że COM nie jest zablokowany",
          body: "Przed połączeniem zamknij VS Code Serial Monitor, PlatformIO Monitor, MobaXterm, PuTTY i inne aplikacje, które trzymają port COM."
        },
        {
          title: "3. Wgraj firmware i podłącz Helteca",
          body: `Jeśli to nowe urządzenie, wykonaj flash zgodnie z <a href="${flashGuide}" target="_blank" rel="noreferrer">przewodnikiem Windows</a>, potem kliknij „Połącz urządzenie”.`
        },
        {
          title: "4. Odczytaj tożsamość i zrób backup",
          body: "Wygeneruj klucz tylko raz, odczytaj public key i eksportuj zaszyfrowany backup. Nie resetuj tożsamości bez wyraźnej potrzeby."
        },
        {
          title: "5. Skonfiguruj radio i join",
          body: "Wprowadź licencję Heltec, DevEUI, JoinEUI i AppKey. Po restarcie odśwież radio, a przed pierwszym mintem upewnij się, że panel widzi joined=true."
        },
        {
          title: "6. Zarejestruj urządzenie i korzystaj z tokenów",
          body: `Powiąż DevEUI z deviceId w indexerze, sprawdź limity wdrożonego tokena, a dopiero potem wykonuj deploy, mint albo transfer. Surowe komendy opisuje <a href="${serialGuide}" target="_blank" rel="noreferrer">serial API</a>.`
        }
      ]
    : [
        {
          title: "1. Prepare the host machine",
          body: `Use Chrome or Edge over HTTPS. If this is a new device, install PlatformIO by following the <a href="${installGuide}" target="_blank" rel="noreferrer">VS Code guide</a>.`
        },
        {
          title: "2. Make sure COM is not blocked",
          body: "Close VS Code Serial Monitor, PlatformIO Monitor, MobaXterm, PuTTY, and any other app that may hold the COM port."
        },
        {
          title: "3. Flash firmware and connect the Heltec",
          body: `If this is a fresh board, flash it using the <a href="${flashGuide}" target="_blank" rel="noreferrer">Windows flashing guide</a>, then click “Connect device”.`
        },
        {
          title: "4. Read identity and create a backup",
          body: "Generate the key once, read the public key, and export an encrypted backup. Do not rotate the signing identity without intent."
        },
        {
          title: "5. Configure radio and join",
          body: "Enter the Heltec license, DevEUI, JoinEUI, and AppKey. After any reboot, refresh radio state and confirm joined=true before the first mint."
        },
        {
          title: "6. Register the device and use tokens",
          body: `Link DevEUI to deviceId in the indexer, review deployed token limits, and only then use deploy, mint, or transfer. Raw commands are documented in the <a href="${serialGuide}" target="_blank" rel="noreferrer">serial API</a>.`
        }
      ];

  refs.onboardingChecklist.innerHTML = steps
    .map(
      (step) => `
        <article class="guide-card">
          <strong>${escapeHtml(step.title)}</strong>
          <p class="helper">${step.body}</p>
        </article>
      `
    )
    .join("");
}

function renderEducation() {
  if (!refs.educationContent) {
    return;
  }

  refs.educationContent.innerHTML = state.language === "pl"
    ? `
      <p><strong>Podpis i anti-replay.</strong> Każda inskrypcja ma podpis Ed25519 i nonce. Indexer weryfikuje podpis, a następnie odrzuca replay albo nonce starszy od ostatnio zaakceptowanego.</p>
      <p><strong>Co naprawdę jest gwarantowane.</strong> Jeśli payload dotrze do indexera i przejdzie weryfikację, wiadomość pochodzi od zarejestrowanego urządzenia i nie została podrobiona ani powtórzona. Sam protokół LoRaWAN nie gwarantuje, że każda transmisja radiowa zawsze dotrze do bramki.</p>
      <p><strong>Skąd bierze się koszt DC.</strong> W panelu pokazuję heurystykę <code>ceil(payloadBytes / 24)</code>. Mint v1 ma zwykle około 81 B, więc planowo wychodzi około 4 DC. Krótszy payload 24 B to około 1 DC, a 51 B to około 3 DC.</p>
      <ul>
        <li>Deploy wykonuje się raz na token i duplikat jest logicznie błędny.</li>
        <li>Mint jest ograniczony przez <code>limitPerMint</code> i <code>maxSupply</code>.</li>
        <li>Transfer wymaga zindeksowanego balansu po stronie nadawcy.</li>
        <li>Jeśli radio jest po resecie, panel powinien najpierw odświeżyć stan i wykonać join.</li>
        <li>Pełne „skompresowanie” v1 jest ograniczone przez 64-bajtowy podpis Ed25519. Większe oszczędności wymagają nowego protokołu v2.</li>
      </ul>
    `
    : `
      <p><strong>Signature and anti-replay.</strong> Every inscription carries an Ed25519 signature and a nonce. The indexer verifies the signature and rejects replays or stale nonces.</p>
      <p><strong>What is actually guaranteed.</strong> If the payload reaches the indexer and validates, it came from the registered device identity and was not forged or replayed. LoRaWAN itself does not guarantee that every radio transmission will always reach a gateway.</p>
      <p><strong>Where DC cost comes from.</strong> The panel shows the heuristic <code>ceil(payloadBytes / 24)</code>. A v1 mint is usually around 81 B, so the planning estimate is about 4 DC. A 24 B payload is about 1 DC, and 51 B is about 3 DC.</p>
      <ul>
        <li>Deploy is a one-time action per token and duplicates are logically invalid.</li>
        <li>Mint is limited by <code>limitPerMint</code> and <code>maxSupply</code>.</li>
        <li>Transfer requires indexed sender balance.</li>
        <li>If the radio has just rebooted, the panel should refresh state and join before sending.</li>
        <li>True compression of v1 is limited by the 64-byte Ed25519 signature. Bigger savings need a protocol v2 redesign.</li>
      </ul>
    `;
}

window.addEventListener("error", (event) => {
  appendLog("error", event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  appendLog("error", event.reason?.message || "Unhandled promise rejection.");
});

function t(path, locale = state.language || DEFAULT_LANGUAGE) {
  const segments = path.split(".");

  function read(source) {
    let cursor = source;
    for (const segment of segments) {
      cursor = cursor?.[segment];
    }
    return typeof cursor === "string" ? cursor : null;
  }

  return read(CONTENT[locale] ?? CONTENT[DEFAULT_LANGUAGE]) ?? read(extraContent(locale)) ?? path;
}

function extraContent(locale) {
  if (locale === "pl") {
    return {
      settings: {
        sound: "Dzwieki"
      },
      overview: {
        lastSend: "Ostatnia wysylka"
      }
    };
  }

  return {
    settings: {
      sound: "Sound"
    },
    overview: {
      lastSend: "Last send"
    }
  };
}

function ensureEnhancedRefs() {
  Object.assign(refs, {
    soundEnabledInput: refs.soundEnabledInput || document.getElementById("soundEnabledInput"),
    indexerBadge: refs.indexerBadge || document.getElementById("indexerBadge"),
    radioBadge: refs.radioBadge || document.getElementById("radioBadge"),
    overviewLastSendValue: refs.overviewLastSendValue || document.getElementById("overviewLastSendValue"),
    transportStatusNote: refs.transportStatusNote || document.getElementById("transportStatusNote"),
    profilesPersistenceNote: refs.profilesPersistenceNote || document.getElementById("profilesPersistenceNote")
  });
}

function ensureEnhancedState() {
  if (typeof state.soundEnabled !== "boolean") {
    state.soundEnabled = readStoredBoolean("lora20.dashboard.soundEnabled", true);
  }
  if (!("lastSuccessfulSendAt" in state)) {
    state.lastSuccessfulSendAt = localStorage.getItem("lora20.dashboard.lastSuccessfulSendAt") || "";
  }
  if (!state.indexerStatus) {
    state.indexerStatus = {
      online: null,
      message: localeText("Indexer nie byl jeszcze sprawdzony.", "Indexer has not been checked yet."),
      checkedAt: 0
    };
  }
  if (!("chromeEnhancementsBound" in state)) {
    state.chromeEnhancementsBound = false;
  }
  if (!("healthProbeTimer" in state)) {
    state.healthProbeTimer = null;
  }
  if (!("audioContext" in state)) {
    state.audioContext = null;
  }
}

function readStoredBoolean(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    return fallback;
  }
  return raw === "1" || raw === "true";
}

function persistSoundPreference() {
  localStorage.setItem("lora20.dashboard.soundEnabled", state.soundEnabled ? "1" : "0");
}

function rememberLastSuccessfulSend(timestamp = new Date().toISOString()) {
  state.lastSuccessfulSendAt = timestamp;
  localStorage.setItem("lora20.dashboard.lastSuccessfulSendAt", timestamp);
}

function formatDateTimeLabel(value) {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit"
  });
}

function formatRelativeCountdown(targetDate) {
  if (!(targetDate instanceof Date) || Number.isNaN(targetDate.getTime())) {
    return localeText("teraz", "now");
  }

  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) {
    return localeText("teraz", "now");
  }

  const totalSeconds = Math.ceil(diff / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return localeText(`za ${minutes} min ${seconds}s`, `in ${minutes}m ${seconds}s`);
  }
  return localeText(`za ${seconds}s`, `in ${seconds}s`);
}

function computeSuggestedNextSend() {
  if (!state.lastSuccessfulSendAt) {
    return null;
  }

  const last = new Date(state.lastSuccessfulSendAt);
  if (Number.isNaN(last.getTime())) {
    return null;
  }

  const queueProfiles = getQueueProfiles();
  if (state.scheduler?.enabled && queueProfiles.length) {
    return {
      mode: "loop",
      at: new Date(last.getTime() + state.scheduler.intervalMinutes * 60_000)
    };
  }

  return {
    mode: "manual",
    at: new Date(last.getTime() + 45_000)
  };
}

function renderBadge(element, label, variant = "idle") {
  if (!element) {
    return;
  }
  element.textContent = label;
  element.className = "badge";
  element.classList.add(`badge--${variant}`);
}

function updateConnectionBadge(label, variant = "idle") {
  ensureEnhancedRefs();
  const mappedVariant = variant === "connected" ? "ok" : variant;
  renderBadge(refs.connectionBadge, label, mappedVariant);
}

function updateIndexerStatus(online, message) {
  ensureEnhancedState();
  state.indexerStatus = {
    online,
    message,
    checkedAt: Date.now()
  };
  renderIndexerBadge();
}

function renderIndexerBadge() {
  ensureEnhancedRefs();
  ensureEnhancedState();

  let label = localeText("Indexer: probing", "Indexer: probing");
  let variant = "warn";

  if (state.indexerStatus?.online === true) {
    label = localeText("Indexer: online", "Indexer: online");
    variant = "ok";
  } else if (state.indexerStatus?.online === false) {
    label = localeText("Indexer: offline", "Indexer: offline");
    variant = "danger";
  }

  renderBadge(refs.indexerBadge, label, variant);
}

function renderRadioBadge() {
  ensureEnhancedRefs();
  const runtime = state.lorawanInfo?.runtime;
  const config = state.lorawanInfo?.config;

  let label = localeText("LoRa: idle", "LoRa: idle");
  let variant = "warn";

  if (!runtime && !config) {
    renderBadge(refs.radioBadge, label, variant);
    return;
  }

  if (runtime?.queuePending) {
    label = localeText("LoRa: queued", "LoRa: queued");
    variant = "warn";
  } else if (runtime?.joined) {
    label = localeText("LoRa: ready", "LoRa: ready");
    variant = "ok";
  } else if (runtime?.joining) {
    label = localeText("LoRa: joining", "LoRa: joining");
    variant = "warn";
  } else if (runtime && (!runtime.hardwareReady || !runtime.initialized)) {
    label = localeText("LoRa: reboot", "LoRa: reboot");
    variant = "danger";
  } else if (config?.hasJoinEui && config?.hasAppKey) {
    label = localeText("LoRa: not joined", "LoRa: not joined");
    variant = "warn";
  } else {
    label = localeText("LoRa: config", "LoRa: config");
    variant = "danger";
  }

  renderBadge(refs.radioBadge, label, variant);
}

function renderOverview() {
  ensureEnhancedRefs();
  ensureEnhancedState();
  if (!refs.overviewTokensValue) {
    return;
  }

  refs.overviewTokensValue.textContent = String(state.tokenCatalog.length);
  refs.overviewBalancesValue.textContent = String(state.portfolio.length);
  refs.overviewEventsValue.textContent = String(state.recentTransactions.length);
  refs.overviewProfilesValue.textContent = String(state.profiles.filter((profile) => profile.enabled).length);
  if (refs.overviewLastSendValue) {
    refs.overviewLastSendValue.textContent = state.lastSuccessfulSendAt
      ? formatDateTimeLabel(state.lastSuccessfulSendAt)
      : "-";
  }

  const runtime = state.lorawanInfo?.runtime;
  const device = state.deviceInfo?.device;
  const lastSend = state.lastSuccessfulSendAt
    ? localeText(`Ostatni uplink: ${formatDateTimeLabel(state.lastSuccessfulSendAt)}.`, `Last uplink: ${formatDateTimeLabel(state.lastSuccessfulSendAt)}.`)
    : localeText("Brak potwierdzonego uplinku w tej przegladarce.", "No confirmed uplink recorded in this browser yet.");
  const indexerSentence = state.indexerStatus?.online === false
    ? localeText("Indexer jest offline albo CORS blokuje odczyt, wiec balans i historia moga byc nieaktualne.", "Indexer is offline or blocked by CORS, so balances and history may be stale.")
    : state.indexerStatus?.online === true
      ? localeText("Indexer odpowiada prawidlowo.", "Indexer is responding normally.")
      : localeText("Indexer nie byl jeszcze jednoznacznie sprawdzony.", "Indexer has not been verified yet.");

  let variant = "neutral";
  let title = localeText("Podlacz Helteca", "Connect the Heltec");
  let body = `${lastSend} ${indexerSentence}`;

  if (device && !runtime?.configured) {
    variant = "warn";
    title = localeText("Tozsamosc gotowa, radio jeszcze nie", "Identity ready, radio still not ready");
    body = localeText(
      "Masz juz deviceId i klucz, ale LoRaWAN nie ma kompletnej konfiguracji. Ustaw JoinEUI, AppKey i wykonaj join. ",
      "The device already has a key and deviceId, but LoRaWAN is not fully configured yet. Set JoinEUI, AppKey, and run join. "
    ) + lastSend;
  } else if (isRecentBoot()) {
    variant = "warn";
    title = localeText("Wykryto restart plytki", "Board reboot detected");
    body = localeText(
      "Po komunikacie ESP-ROM daj radiu kilka sekund, odswiez stan i dopiero potem probuj kolejnego uplinku. ",
      "After an ESP-ROM message, give the radio a few seconds, refresh state, and only then try the next uplink. "
    ) + lastSend;
  } else if (runtime?.queuePending) {
    variant = "warn";
    title = localeText("Poprzedni uplink nadal jest w kolejce", "The previous uplink is still queued");
    body = localeText(
      "Heltec nie przyjmie nastepnej wysylki, dopoki poprzednia nie zostanie enqueued lub join sie nie zakonczy. ",
      "Heltec will not accept the next send until the previous one is enqueued or join completes. "
    ) + lastSend;
  } else if (radioReadyForSend(runtime) && state.indexerStatus?.online !== false) {
    variant = "ok";
    title = localeText("Sciezka mintu jest gotowa", "The mint path is ready");
    body = localeText(
      "Urzadzenie ma klucz, radio jest joined, a panel widzi indexer. Mozesz przygotowac deploy, mint lub transfer. ",
      "The device key exists, radio is joined, and the panel sees the indexer. You can prepare deploy, mint, or transfer. "
    ) + lastSend;
  } else if (device) {
    variant = "warn";
    title = localeText("Urzadzenie jest widoczne, ale nie wszystko jest gotowe", "The device is visible, but not everything is ready");
    body = `${indexerSentence} ${lastSend}`;
  }

  refs.overviewStatusNote.className = `callout callout--${variant}`;
  refs.overviewStatusNote.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(body)}</p>
  `;

  renderIndexerBadge();
  renderRadioBadge();
}

function renderLorawanSummary() {
  const config = state.lorawanInfo?.config;
  const runtime = state.lorawanInfo?.runtime;
  const heltec = state.lorawanInfo?.heltec;

  if (!config || !runtime) {
    refs.lorawanJoinedValue.textContent = "-";
    refs.lorawanPortValue.textContent = "-";
    refs.lorawanEventValue.textContent = "-";
    refs.lorawanDevEuiValue.textContent = "-";
    refs.lorawanSummaryOutput.textContent = localeText("Brak danych LoRaWAN.", "No LoRaWAN status yet.");
    renderRadioHint();
    renderRadioBadge();
    renderTransportStatusNote();
    return;
  }

  refs.lorawanJoinedValue.textContent = runtime.joined
    ? localeText("Tak", "Yes")
    : runtime.joining
      ? localeText("Dolaczanie...", "Joining...")
      : localeText("Nie", "No");
  refs.lorawanPortValue.textContent = String(config.appPort ?? "-");
  refs.lorawanEventValue.textContent = runtime.lastEvent || "-";
  refs.lorawanDevEuiValue.textContent = config.devEuiHex || runtime.chipIdHex || "-";
  refs.lorawanSummaryOutput.textContent = formatJson(sanitizeForLog({ config, runtime, heltec }));
  renderRadioHint();
  renderRadioBadge();
  renderTransportStatusNote();
}

function renderQueuePreview() {
  const queueProfiles = getQueueProfiles();
  if (!queueProfiles.length) {
    refs.profileQueuePreview.textContent = state.language === "pl"
      ? "Brak aktywnej kolejki. Zapisz profil i zostaw go wlaczonego w kolejce."
      : "No active queue yet. Save a profile and leave it enabled in the queue.";
    renderProfilesPersistenceNote();
    return;
  }

  refs.profileQueuePreview.textContent = formatJson({
    loopEnabled: refs.profileQueueEnabledInput.checked,
    intervalMinutes: Number(refs.profileQueueIntervalInput.value || state.scheduler.intervalMinutes),
    order: queueProfiles.map((profile, index) => ({
      position: index + 1,
      name: profile.name,
      tick: profile.tick,
      amount: profile.amount,
      route: "Heltec -> LoRaWAN -> ChirpStack -> Indexer"
    }))
  });
  renderProfilesPersistenceNote();
}

function renderTransportStatusNote() {
  ensureEnhancedRefs();
  ensureEnhancedState();
  if (!refs.transportStatusNote) {
    return;
  }

  const runtime = state.lorawanInfo?.runtime;
  const nextWindow = computeSuggestedNextSend();
  const lastWindowText = state.lastSuccessfulSendAt
    ? localeText(
        `Ostatni zaakceptowany uplink: ${formatDateTimeLabel(state.lastSuccessfulSendAt)}.`,
        `Last accepted uplink: ${formatDateTimeLabel(state.lastSuccessfulSendAt)}.`
      )
    : localeText(
        "Brak zapisanego zaakceptowanego uplinku w tej przegladarce.",
        "No accepted uplink has been recorded in this browser."
      );
  const nextWindowText = nextWindow
    ? nextWindow.mode === "loop"
      ? localeText(
          `Kolejna automatyczna proba z petli: ${formatDateTimeLabel(nextWindow.at)} (${formatRelativeCountdown(nextWindow.at)}).`,
          `Next automatic loop attempt: ${formatDateTimeLabel(nextWindow.at)} (${formatRelativeCountdown(nextWindow.at)}).`
        )
      : localeText(
          `Reczny cooldown po ostatniej wysylce konczy sie ${formatRelativeCountdown(nextWindow.at)}.`,
          `Manual cooldown after the last send ends ${formatRelativeCountdown(nextWindow.at)}.`
        )
    : localeText(
        "Po pierwszym poprawnym uplinku panel zacznie pamietac ostatni czas wysylki i zasugeruje kolejna probe.",
        "After the first successful uplink, the panel will remember the send time and suggest the next attempt."
      );

  let variant = "neutral";
  let title = localeText("Trasa wysylki", "Send route");
  let body = localeText(
    "Kazdy deploy, mint, transfer i config idzie przez Heltec, LoRaWAN, ChirpStack i dopiero potem do indexera. ",
    "Every deploy, mint, transfer, and config flows through Heltec, LoRaWAN, ChirpStack, and only then into the indexer. "
  );

  if (state.indexerStatus?.online === false) {
    variant = "warn";
    title = localeText("Indexer chwilowo poza zasiegiem", "Indexer temporarily unreachable");
    body = localeText(
      "Wysylka radiowa moze sie udac, ale dashboard nie potwierdzi balansu ani historii, dopoki indexer znowu nie odpowie. ",
      "The radio send may still work, but the dashboard cannot confirm balances or history until the indexer responds again. "
    );
  } else if (runtime?.queuePending) {
    variant = "warn";
    title = localeText("Radio nadal obrabia poprzednia wiadomosc", "Radio is still handling the previous message");
    body = localeText(
      "Poczekaj na enqueue poprzedniego uplinku albo na zakonczenie join. Kolejna proba teraz najpewniej skonczy sie timeoutem. ",
      "Wait for the previous uplink to enqueue or for join to complete. Another attempt right now will likely time out. "
    );
  } else if (runtime && (!runtime.hardwareReady || !runtime.initialized || !runtime.joined)) {
    variant = "warn";
    title = localeText("Radio nie jest gotowe do wysylki", "Radio is not ready to send");
    body = localeText(
      "Po resecie albo rozlaczeniu odswiez radio i doprowadz do joined=true zanim uruchomisz nastepny mint. ",
      "After a reboot or disconnect, refresh radio state and get back to joined=true before sending the next mint. "
    );
  } else if (state.lastSuccessfulSendAt) {
    variant = "ok";
    title = localeText("Tor wysylki jest stabilny", "The send path is stable");
    body = localeText(
      "Ostatni uplink zostal przyjety przez radio. Panel zapamietal ten moment i wylicza sensowne okno kolejnej proby. ",
      "The last uplink was accepted by the radio. The panel remembered that moment and computes a reasonable next-attempt window. "
    );
  }

  const dcHeuristic = localeText(
    "Heurystyka DC: 24 B ~= 1 DC, 51 B ~= 3 DC, mint v1 81 B ~= 4 DC.",
    "DC heuristic: 24 B ~= 1 DC, 51 B ~= 3 DC, a v1 mint at 81 B ~= 4 DC."
  );

  refs.transportStatusNote.className = `callout callout--${variant}`;
  refs.transportStatusNote.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(`${body}${lastWindowText} ${nextWindowText} ${dcHeuristic}`)}</p>
  `;
}

function renderProfilesPersistenceNote() {
  ensureEnhancedRefs();
  if (!refs.profilesPersistenceNote) {
    return;
  }

  const queueProfiles = getQueueProfiles();
  const variant = queueProfiles.length ? "ok" : "neutral";
  const title = queueProfiles.length
    ? localeText("Petla moze dzialac bez panelu", "The loop can run without the panel")
    : localeText("Biblioteka profili jest gotowa", "The profile library is ready");
  const body = queueProfiles.length
    ? localeText(
        `Po Sync queue kolejka jest zapisywana w urzadzeniu. Heltec V4 moze dalej realizowac petle ${queueProfiles.length} profil(i) co ${state.scheduler.intervalMinutes} min nawet po zamknieciu panelu. Po resecie odswiez radio i sprawdz join.`,
        `After Sync queue the queue is stored in the device. Heltec V4 can keep running the ${queueProfiles.length} profile loop every ${state.scheduler.intervalMinutes} min even after the panel is closed. After a reboot, refresh radio state and verify join.`
      )
    : localeText(
        "Zapisz profile i zsynchronizuj kolejke do urzadzenia, aby pominac panel podczas przyszlych automatycznych mintow.",
        "Save profiles and sync the queue to the device to let future automatic mints run without the panel."
      );

  refs.profilesPersistenceNote.className = `callout callout--${variant}`;
  refs.profilesPersistenceNote.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(body)}</p>
  `;
}

async function prepareAndMaybeSend(label, prepareCommand, params, sendNow) {
  enforcePreflightOrThrow(prepareCommand);

  const prepared = await sendCommand(prepareCommand, params);
  state.lastPrepared = {
    label,
    preparedAt: new Date().toISOString(),
    result: prepared
  };
  renderPreparedOutput();

  if (!sendNow) {
    renderOperationWarnings();
    renderTransportStatusNote();
    return prepared;
  }

  await ensureLoRaWanReadyForSend();
  const config = state.lorawanInfo?.config || {};
  void playUiCue("dispatch");
  const sendResult = await sendCommand("lorawan_send", {
    payloadHex: prepared.payloadHex,
    port: config.appPort || 1,
    confirmed: Boolean(config.confirmedUplink),
    commitNonce: true,
    nonceToCommit: prepared.nonce
  });

  state.lastPrepared.sendResult = sendResult;
  await waitForSendAcceptance();
  renderPreparedOutput();
  await refreshDeviceState();
  return { prepared, sendResult };
}

async function waitForSendAcceptance() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 12_000) {
    await delay(1500);
    const lorawan = await sendCommand("get_lorawan");
    state.lorawanInfo = lorawan;
    renderLorawanSummary();

    if (lorawan.runtime?.lastSendAccepted || lorawan.runtime?.lastEvent === "uplink_enqueued") {
      rememberLastSuccessfulSend();
      appendLog(
        "radio",
        localeText(
          "Uplink zostal przyjety do kolejki radiowej urzadzenia.",
          "Uplink was accepted by the device radio queue."
        ),
        sanitizeForLog(lorawan.runtime)
      );
      void playUiCue("accepted");
      renderOverview();
      renderTransportStatusNote();
      return;
    }
  }

  const runtime = state.lorawanInfo?.runtime || {};
  throw new Error(
    localeText(
      `Urzadzenie nie potwierdzilo enqueue uplinku. lastEvent=${runtime.lastEvent || "-"}${runtime.lastError ? `, lastError=${runtime.lastError}` : ""}`,
      `The device did not confirm uplink enqueue. lastEvent=${runtime.lastEvent || "-"}${runtime.lastError ? `, lastError=${runtime.lastError}` : ""}`
    )
  );
}

async function loadIndexerDashboardData({ silent = false } = {}) {
  const results = await Promise.allSettled([
    loadTokenCatalog(silent),
    loadPortfolioSummary(silent),
    loadRecentTransactionsSummary(silent)
  ]);

  if (results.every((entry) => entry.status === "rejected")) {
    updateIndexerStatus(false, localeText("Indexer nie odpowiedzial na zestaw odczytow dashboardu.", "Indexer did not answer the dashboard reads."));
  }

  renderOverview();
  renderTransportStatusNote();
  renderProfilesPersistenceNote();
}

async function loadTokenCatalog(logSuccess = false) {
  const data = await indexerRequest("/tokens?limit=100");
  state.tokenCatalog = Array.isArray(data.tokens) ? data.tokens : [];
  refs.tokenOutput.textContent = formatJson(data);
  renderTokenLibrary();
  renderOperationWarnings();
  renderOverview();
  if (logSuccess) {
    appendLog("indexer", "Token library refreshed", { count: state.tokenCatalog.length });
  }
}

async function loadPortfolioSummary(logSuccess = false, explicitDeviceId = "") {
  const deviceId = (explicitDeviceId || refs.balanceDeviceIdInput.value || state.deviceInfo?.device?.deviceId || "").trim().toLowerCase();
  if (!deviceId) {
    state.portfolio = [];
    renderPortfolio();
    renderOverview();
    return;
  }

  const data = await indexerRequest(`/devices/${deviceId}/balances?limit=50`);
  state.portfolio = Array.isArray(data.balances) ? data.balances : [];
  refs.balanceOutput.textContent = formatJson(data);
  renderPortfolio();
  renderOverview();
  renderOperationWarnings();
  if (logSuccess) {
    appendLog("indexer", "Portfolio refreshed", { deviceId, balances: state.portfolio.length });
  }
}

async function loadRecentTransactionsSummary(logSuccess = false, explicitDeviceId = "") {
  const deviceId = (explicitDeviceId || refs.transactionsDeviceIdInput.value || state.deviceInfo?.device?.deviceId || "").trim().toLowerCase();
  const params = new URLSearchParams();
  if (deviceId) {
    params.set("deviceId", deviceId);
  }
  params.set("limit", "12");
  const data = await indexerRequest(`/transactions?${params.toString()}`);
  state.recentTransactions = Array.isArray(data.transactions) ? data.transactions : [];
  refs.transactionsOutput.textContent = formatJson(data);
  renderRecentTransactions();
  renderOverview();
  if (logSuccess) {
    appendLog("indexer", "Recent transactions refreshed", { deviceId, count: state.recentTransactions.length });
  }
}

async function loadHealth() {
  const data = await probeIndexerHealth({ silent: false });
  refs.healthOutput.textContent = formatJson(data || { status: "offline" });
}

async function probeIndexerHealth({ silent = true } = {}) {
  ensureEnhancedState();
  const baseUrl = normalizeBaseUrl(refs.indexerBaseUrlInput?.value || state.indexerBaseUrl || DEFAULT_INDEXER_BASE_URL);
  if (!baseUrl) {
    updateIndexerStatus(false, localeText("Brak URL indexera.", "Indexer URL is empty."));
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error?.message || `health ${response.status}`);
    }
    updateIndexerStatus(true, localeText("Health check OK.", "Health check OK."));
    if (!silent) {
      appendLog("indexer", localeText("Indexer odpowiada na /health.", "Indexer responded to /health."), sanitizeForLog(payload));
    }
    renderOverview();
    return payload;
  } catch (error) {
    updateIndexerStatus(
      false,
      error instanceof Error ? error.message : String(error)
    );
    if (!silent) {
      appendLog(
        "error",
        localeText("Nie udalo sie sprawdzic /health indexera.", "Could not check the indexer /health endpoint."),
        error instanceof Error ? error.message : String(error)
      );
    }
    renderOverview();
    return null;
  }
}

async function indexerRequest(path, { method = "GET", body } = {}) {
  const baseUrl = normalizeBaseUrl(refs.indexerBaseUrlInput.value || state.indexerBaseUrl || DEFAULT_INDEXER_BASE_URL);
  if (!baseUrl) {
    updateIndexerStatus(false, localeText("Brak URL indexera.", "Indexer URL is empty."));
    throw new Error("Indexer base URL is empty.");
  }

  saveIndexerBaseUrl({ silent: true });

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "content-type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (error) {
    updateIndexerStatus(
      false,
      error instanceof Error ? error.message : String(error)
    );
    renderOverview();
    throw new Error(
      `${error.message}. If this dashboard runs on GitHub Pages, set CORS_ALLOWED_ORIGINS on the indexer.`
    );
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    updateIndexerStatus(false, payload?.error?.message || `HTTP ${response.status}`);
    renderOverview();
    throw new Error(payload?.error?.message || `Indexer request failed with ${response.status}`);
  }

  updateIndexerStatus(true, localeText("Indexer online.", "Indexer online."));
  renderOverview();
  return payload;
}

function renderOperationWarnings() {
  if (!refs.operationWarnings || !refs.selectedTokenSummary) {
    return;
  }

  const token = currentMintToken();
  const mintAmount = parseBigIntOrNull(refs.mintAmountInput.value);
  const warnings = [];
  const deployTick = refs.deployTickInput.value.trim().toUpperCase();
  const deployMaxSupply = parseBigIntOrNull(refs.deployMaxSupplyInput.value);
  const deployLimitPerMint = parseBigIntOrNull(refs.deployLimitPerMintInput.value);
  const transferTick = refs.transferTickInput.value.trim().toUpperCase();
  const transferAmount = parseBigIntOrNull(refs.transferAmountInput.value);
  const portfolioEntry = state.portfolio.find((entry) => entry.tick === transferTick);
  const mintTick = refs.mintTickInput.value.trim().toUpperCase();
  const runtime = state.lorawanInfo?.runtime;

  if (token) {
    refs.selectedTokenSummary.className = "callout callout--ok";
    refs.selectedTokenSummary.innerHTML = `
      <strong>${escapeHtml(token.tick)}</strong>
      <p>${escapeHtml(token.totalSupply)} / ${escapeHtml(token.maxSupply)} ${escapeHtml(localeText("zindeksowane", "indexed"))} • ${escapeHtml(localeText("max", "max"))} ${escapeHtml(token.limitPerMint)} ${escapeHtml(localeText("na mint", "per mint"))}</p>
    `;

    if (mintAmount !== null && mintAmount > BigInt(token.limitPerMint)) {
      warnings.push({
        level: "danger",
        text: localeText(
          `Mint ${mintAmount.toString()} przekracza limitPerMint ${token.limitPerMint}.`,
          `Mint ${mintAmount.toString()} exceeds limitPerMint ${token.limitPerMint}.`
        )
      });
    }

    if (mintAmount !== null && BigInt(token.totalSupply) + mintAmount > BigInt(token.maxSupply)) {
      warnings.push({
        level: "danger",
        text: localeText(
          `Mint przekroczylby maxSupply ${token.maxSupply}.`,
          `Mint would exceed maxSupply ${token.maxSupply}.`
        )
      });
    }
  } else {
    refs.selectedTokenSummary.className = "callout callout--neutral";
    refs.selectedTokenSummary.innerHTML = `
      <strong>${escapeHtml(t("operations.noTokenSelectedTitle"))}</strong>
      <p>${escapeHtml(t("operations.noTokenSelectedBody"))}</p>
    `;
    if (mintTick) {
      warnings.push({
        level: "warn",
        text: localeText(
          `Token ${mintTick} nie jest jeszcze na liscie wdrozonych tickerow.`,
          `Token ${mintTick} is not in the deployed token list yet.`
        )
      });
    }
  }

  if (state.indexerStatus?.online === false) {
    warnings.push({
      level: "warn",
      text: localeText(
        "Indexer jest offline albo CORS blokuje odczyt. Wysylka radiowa moze przejsc, ale panel nie odswiezy balansu.",
        "Indexer is offline or blocked by CORS. Radio send may work, but the panel will not refresh balances."
      )
    });
  }

  if (!state.lorawanInfo?.config?.hasAppKey || !state.lorawanInfo?.config?.hasJoinEui) {
    warnings.push({
      level: "danger",
      text: localeText(
        "Konfiguracja LoRaWAN jest niepelna. Najpierw ustaw JoinEUI i AppKey.",
        "LoRaWAN config is incomplete. Set JoinEUI and AppKey first."
      )
    });
  } else if (runtime && !radioReadyForSend(runtime)) {
    warnings.push({
      level: "warn",
      text: localeText(
        "Radio nie jest gotowe do bezpiecznej wysylki. Panel sprobuje odswiezyc stan i wykonac join przed send.",
        "Radio is not ready for a safe send. The panel will refresh state and try to join before send."
      )
    });
  }

  if (deployTick && state.tokenCatalog.some((entry) => entry.tick === deployTick)) {
    warnings.push({
      level: "warn",
      text: localeText(
        `Deploy ${deployTick} juz istnieje i indexer go odrzuci.`,
        `Deploy ${deployTick} already exists and will be rejected by the indexer.`
      )
    });
  }

  if (deployMaxSupply !== null && deployLimitPerMint !== null && deployLimitPerMint > deployMaxSupply) {
    warnings.push({
      level: "danger",
      text: localeText(
        "W deploy limitPerMint jest wiekszy niz maxSupply.",
        "In deploy, limitPerMint is greater than maxSupply."
      )
    });
  }

  if (portfolioEntry && transferAmount !== null && transferAmount > BigInt(portfolioEntry.balance)) {
    warnings.push({
      level: "danger",
      text: localeText(
        `Transfer ${transferAmount.toString()} przekracza zindeksowany balans ${portfolioEntry.balance} dla ${transferTick}.`,
        `Transfer ${transferAmount.toString()} exceeds indexed balance ${portfolioEntry.balance} for ${transferTick}.`
      )
    });
  }

  const estimatedBytes = estimatePayloadSize("prepare_mint");
  const estimatedDc = estimateDataCredits(estimatedBytes);
  refs.estimatedPayloadValue.textContent = `${estimatedBytes} B`;
  refs.estimatedDcValue.textContent = `~${estimatedDc} DC (${localeText("koszyk 24 B", "24 B bucket")})`;
  refs.protocolVersionValue.textContent = "v1 / Ed25519 / LoRaWAN";

  const top = warnings[0];
  const variant = top?.level === "danger" ? "danger" : top?.level === "warn" ? "warn" : "ok";
  const text = warnings.length
    ? warnings.map((entry) => `• ${entry.text}`).join("\n")
    : localeText(
        "Nie wykryto logicznych blokad dla aktualnego szkicu mintu.",
        "No logical blockers were detected for the current mint draft."
      );

  refs.operationWarnings.className = `callout callout--${variant}`;
  refs.operationWarnings.innerHTML = `
    <strong>${escapeHtml(t("operations.preflightTitle"))}</strong>
    <p>${escapeHtml(text)}</p>
  `;
  renderTransportStatusNote();
}

function renderOnboarding() {
  if (!refs.onboardingChecklist) {
    return;
  }

  const installGuide = "https://github.com/hattimon/lora20-firmware/blob/main/docs/install-platformio-vscode.md";
  const flashGuide = "https://github.com/hattimon/lora20-firmware/blob/main/docs/flashing-windows.md";
  const serialGuide = "https://github.com/hattimon/lora20-firmware/blob/main/docs/serial-api.md";

  const steps = state.language === "pl"
    ? [
        {
          title: "1. Host i sterowniki",
          body: `Uzyj Chrome albo Edge na HTTPS. Dla nowych osob najpierw przejdz przez <a href="${installGuide}" target="_blank" rel="noreferrer">instalacje PlatformIO w VS Code</a>.`
        },
        {
          title: "2. Zamknij blokery COM",
          body: "Przed polaczeniem zamknij VS Code Serial Monitor, PlatformIO Monitor, MobaXterm, PuTTY i kazda aplikacje trzymajaca COM."
        },
        {
          title: "3. Backup zanim wgrasz nowe firmware",
          body: `Przed kazdym nowym flashowaniem zrob backup aktualnej wersji roboczej i dopiero potem korzystaj z <a href="${flashGuide}" target="_blank" rel="noreferrer">procedury flashowania Windows</a>.`
        },
        {
          title: "4. Tozsamosc i backup kryptograficzny",
          body: "Wygeneruj klucz tylko raz, odczytaj public key, wyeksportuj zaszyfrowany backup i nie rotuj tozsamosci bez potrzeby."
        },
        {
          title: "5. LoRaWAN i join",
          body: "Zapisz licencje Heltec, DevEUI, JoinEUI i AppKey. Po restarcie odswiez radio, sprawdz joined=true i dopiero potem wysylaj."
        },
        {
          title: "6. Rejestracja i tokeny",
          body: `Powiaz DevEUI z deviceId w indexerze, sprawdz limity wdrozonego tokena i dopiero wtedy wykonuj deploy, mint lub transfer. Surowe komendy opisuje <a href="${serialGuide}" target="_blank" rel="noreferrer">serial API</a>.`
        }
      ]
    : [
        {
          title: "1. Host and drivers",
          body: `Use Chrome or Edge over HTTPS. For new operators, start with the <a href="${installGuide}" target="_blank" rel="noreferrer">PlatformIO in VS Code guide</a>.`
        },
        {
          title: "2. Close COM blockers",
          body: "Before connecting, close VS Code Serial Monitor, PlatformIO Monitor, MobaXterm, PuTTY, and any app that may hold the COM port."
        },
        {
          title: "3. Backup before flashing new firmware",
          body: `Before any new flash, make a backup of the current working firmware and only then use the <a href="${flashGuide}" target="_blank" rel="noreferrer">Windows flashing procedure</a>.`
        },
        {
          title: "4. Identity and encrypted backup",
          body: "Generate the key once, read the public key, export an encrypted backup, and do not rotate the signing identity unless you intend to reset it."
        },
        {
          title: "5. LoRaWAN and join",
          body: "Store the Heltec license, DevEUI, JoinEUI, and AppKey. After reboot, refresh radio state, confirm joined=true, and only then send."
        },
        {
          title: "6. Registration and token actions",
          body: `Link DevEUI to deviceId in the indexer, review token limits, and only then use deploy, mint, or transfer. Raw commands are documented in the <a href="${serialGuide}" target="_blank" rel="noreferrer">serial API</a>.`
        }
      ];

  refs.onboardingChecklist.innerHTML = steps
    .map(
      (step) => `
        <article class="guide-card">
          <strong>${escapeHtml(step.title)}</strong>
          <p class="helper">${step.body}</p>
        </article>
      `
    )
    .join("");
}

function renderEducation() {
  if (!refs.educationContent) {
    return;
  }

  refs.educationContent.innerHTML = state.language === "pl"
    ? `
      <p><strong>Podpis i anti-replay.</strong> Kazda inskrypcja ma podpis Ed25519 i nonce. Indexer weryfikuje podpis, odrzuca replaye i starsze nonce.</p>
      <p><strong>Co faktycznie jest gwarantowane.</strong> Jesli payload dotrze do indexera i przejdzie walidacje, wiadomosc pochodzi od zarejestrowanego urzadzenia i nie zostala podrobiona. Sam LoRaWAN nie gwarantuje, ze kazdy uplink zawsze dojdzie.</p>
      <p><strong>Jak unikac duplikatow i bledow logicznych.</strong> Deploy robi sie raz na ticker. Mint jest ograniczony przez limitPerMint i maxSupply. Transfer wymaga zindeksowanego balansu nadawcy. Panel ostrzega przed tymi bledami, ale pozwala na swiadome obejscie.</p>
      <p><strong>Koszt transmisji.</strong> Panel pokazuje heurystyke ceil(payloadBytes / 24). W praktyce 24 B to okolo 1 DC, 51 B to okolo 3 DC, a mint v1 o rozmiarze 81 B to okolo 4 DC.</p>
      <p><strong>Kompresja.</strong> W v1 najwiekszy koszt daje 64-bajtowy podpis Ed25519. Prawdziwe dalsze odchudzenie wiadomosci wymaga nowego protocol v2 z krotszym kodowaniem pol i aliasami.</p>
    `
    : `
      <p><strong>Signature and anti-replay.</strong> Every inscription carries an Ed25519 signature and a nonce. The indexer verifies the signature and rejects replays and stale nonces.</p>
      <p><strong>What is actually guaranteed.</strong> If the payload reaches the indexer and validates, the message came from the registered device and was not forged. LoRaWAN itself does not guarantee that every uplink will always arrive.</p>
      <p><strong>How to avoid duplicates and logical errors.</strong> Deploy is a one-time action per ticker. Mint is bounded by limitPerMint and maxSupply. Transfer requires indexed sender balance. The panel warns about these problems but still allows an expert override.</p>
      <p><strong>Transmission cost.</strong> The panel shows the heuristic ceil(payloadBytes / 24). In practice 24 B is about 1 DC, 51 B is about 3 DC, and an 81 B v1 mint is about 4 DC.</p>
      <p><strong>Compression.</strong> In v1 the biggest cost is the 64-byte Ed25519 signature. Real further savings require a protocol v2 with shorter field encoding and aliases.</p>
    `;
}

function renderAll() {
  ensureEnhancedRefs();
  ensureEnhancedState();
  applyTheme(state.theme);
  applyLanguage(state.language);
  if (refs.languageSelect) {
    refs.languageSelect.value = state.language;
  }
  if (refs.themeSelect) {
    refs.themeSelect.value = state.theme;
  }
  if (refs.indexerBaseUrlInput) {
    refs.indexerBaseUrlInput.value = state.indexerBaseUrl || DEFAULT_INDEXER_BASE_URL;
  }
  if (refs.serialSupportNotice) {
    refs.serialSupportNotice.textContent = ("serial" in navigator)
      ? t("misc.browserHint")
      : t("misc.browserUnsupported");
  }
  renderOverview();
  renderDeviceReadiness();
  renderKnownDevices();
  renderProfiles();
  renderQueuePreview();
  renderPreparedOutput();
  renderDeviceSummary();
  renderLorawanSummary();
  renderPortfolio();
  renderRecentTransactions();
  renderTokenLibrary();
  renderOperationWarnings();
  renderOnboarding();
  renderEducation();
  renderTransportStatusNote();
  renderProfilesPersistenceNote();
  renderIndexerBadge();
  renderRadioBadge();
  if (refs.soundEnabledInput) {
    refs.soundEnabledInput.checked = state.soundEnabled;
  }
}

function appendLog(kind, message, detail = null) {
  const entry = document.createElement("article");
  entry.className = "log-entry";

  const head = document.createElement("div");
  head.className = "log-entry__head";
  head.innerHTML = `
    <span class="log-entry__kind">${escapeHtml(kind)}</span>
    <span class="mono">${new Date().toLocaleTimeString()}</span>
  `;

  const body = document.createElement("div");
  body.className = "log-entry__message";
  body.textContent = message;

  entry.append(head, body);

  if (detail !== null && detail !== undefined && detail !== "") {
    const pre = document.createElement("pre");
    pre.textContent = typeof detail === "string" ? detail : formatJson(detail);
    entry.append(pre);
  }

  refs.activityLog.prepend(entry);
  while (refs.activityLog.children.length > 40) {
    refs.activityLog.lastElementChild?.remove();
  }

  maybePlayLogCue(kind, message);
}

function maybePlayLogCue(kind, message) {
  const normalized = `${kind} ${message}`.toLowerCase();
  if (kind === "error") {
    void playUiCue("error");
    return;
  }
  if (normalized.includes("serial port connected")) {
    void playUiCue("connect");
    return;
  }
  if (normalized.includes("serial port disconnected")) {
    void playUiCue("disconnect");
    return;
  }
  if (kind === "profile" && normalized.includes("synced")) {
    void playUiCue("sync");
  }
}

async function ensureAudioContext() {
  ensureEnhancedState();
  if (!state.audioContext) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }
    state.audioContext = new AudioContextCtor();
  }
  if (state.audioContext.state === "suspended") {
    await state.audioContext.resume();
  }
  return state.audioContext;
}

async function playUiCue(name) {
  ensureEnhancedState();
  if (!state.soundEnabled) {
    return;
  }

  const ctx = await ensureAudioContext();
  if (!ctx) {
    return;
  }

  const now = ctx.currentTime;
  const patterns = {
    dispatch: [
      { f: 620, at: 0, len: 0.08, gain: 0.04, type: "triangle" },
      { f: 880, at: 0.06, len: 0.12, gain: 0.03, type: "sine" }
    ],
    accepted: [
      { f: 740, at: 0, len: 0.12, gain: 0.04, type: "sine" },
      { f: 987, at: 0.1, len: 0.18, gain: 0.035, type: "sine" },
      { f: 1318, at: 0.19, len: 0.22, gain: 0.025, type: "triangle" }
    ],
    connect: [
      { f: 660, at: 0, len: 0.08, gain: 0.03, type: "triangle" },
      { f: 990, at: 0.08, len: 0.12, gain: 0.024, type: "sine" }
    ],
    disconnect: [
      { f: 560, at: 0, len: 0.08, gain: 0.025, type: "sine" },
      { f: 390, at: 0.08, len: 0.14, gain: 0.02, type: "triangle" }
    ],
    error: [
      { f: 240, at: 0, len: 0.12, gain: 0.035, type: "sawtooth" },
      { f: 160, at: 0.08, len: 0.18, gain: 0.028, type: "triangle" }
    ],
    sync: [
      { f: 520, at: 0, len: 0.07, gain: 0.02, type: "triangle" },
      { f: 780, at: 0.06, len: 0.1, gain: 0.018, type: "sine" }
    ]
  };

  for (const note of patterns[name] || []) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = note.type;
    oscillator.frequency.setValueAtTime(note.f, now + note.at);
    gain.gain.setValueAtTime(0.0001, now + note.at);
    gain.gain.exponentialRampToValueAtTime(note.gain, now + note.at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.at + note.len);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(now + note.at);
    oscillator.stop(now + note.at + note.len + 0.03);
  }
}

function postInitDashboardChrome() {
  ensureEnhancedRefs();
  ensureEnhancedState();

  if (!state.chromeEnhancementsBound) {
    refs.soundEnabledInput?.addEventListener("change", () => {
      state.soundEnabled = Boolean(refs.soundEnabledInput.checked);
      persistSoundPreference();
      appendLog("ui", state.soundEnabled ? localeText("Dzwieki wlaczone.", "Sound enabled.") : localeText("Dzwieki wylaczone.", "Sound muted."));
    });
    state.chromeEnhancementsBound = true;
  }

  if (refs.soundEnabledInput) {
    refs.soundEnabledInput.checked = state.soundEnabled;
  }

  renderIndexerBadge();
  renderRadioBadge();
  renderTransportStatusNote();
  renderProfilesPersistenceNote();

  if (!state.healthProbeTimer) {
    state.healthProbeTimer = window.setInterval(() => {
      void probeIndexerHealth({ silent: true });
    }, 45_000);
  }

  if (!state.indexerStatus?.checkedAt) {
    void probeIndexerHealth({ silent: true });
  }
}

postInitDashboardChrome();
