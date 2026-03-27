const STORAGE_KEYS = {
  indexerBaseUrl: "lora20.dashboard.indexerBaseUrl",
  profiles: "lora20.dashboard.profiles"
};

const DEFAULT_INDEXER_BASE_URL = "https://lora20.hattimon.pl";
const DEFAULT_PROFILES = [
  {
    id: "seed-lora-30",
    name: "LORA / 100 / 30 min",
    tick: "LORA",
    amount: "100",
    intervalMinutes: 30,
    enabled: true
  }
];

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
  indexerBaseUrlInput: document.getElementById("indexerBaseUrlInput"),
  saveIndexerButton: document.getElementById("saveIndexerButton"),
  connectButton: document.getElementById("connectButton"),
  disconnectButton: document.getElementById("disconnectButton"),
  refreshButton: document.getElementById("refreshButton"),
  connectionBadge: document.getElementById("connectionBadge"),
  serialSupportNotice: document.getElementById("serialSupportNotice"),
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
  profileList: document.getElementById("profileList"),
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
  editingProfileId: null,
  indexerBaseUrl: loadIndexerBaseUrl(),
  formsHydrated: false,
  joinPollTimer: null
};

init();

function init() {
  refs.indexerBaseUrlInput.value = state.indexerBaseUrl;
  refs.serialSupportNotice.textContent = "Web Serial dziala w Chrome lub Edge z HTTPS lub localhost.";
  refs.disconnectButton.disabled = true;

  bindEvents();
  renderProfiles();
  renderPreparedOutput();
  renderDeviceSummary();
  renderLorawanSummary();

  if (!("serial" in navigator)) {
    refs.serialSupportNotice.textContent =
      "Ta przegladarka nie obsluguje Web Serial. Uzyj Chrome albo Edge na HTTPS.";
    refs.connectButton.disabled = true;
  }
}

function bindEvents() {
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
  refs.profileList.addEventListener("click", wrapUi(handleProfileAction));
  refs.healthButton.addEventListener("click", wrapUi(loadHealth));
  refs.tokenLookupButton.addEventListener("click", wrapUi(loadToken));
  refs.balanceLookupButton.addEventListener("click", wrapUi(loadBalance));
  refs.transactionsButton.addEventListener("click", wrapUi(loadTransactions));
  refs.sendRawCommandButton.addEventListener("click", wrapUi(handleRawCommand));

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

function loadIndexerBaseUrl() {
  return localStorage.getItem(STORAGE_KEYS.indexerBaseUrl) || DEFAULT_INDEXER_BASE_URL;
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
    if (!raw) {
      return [...DEFAULT_PROFILES];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : [...DEFAULT_PROFILES];
  } catch {
    return [...DEFAULT_PROFILES];
  }
}

function persistProfiles() {
  localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(state.profiles));
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
  updateConnectionBadge("Connected", "connected");
  appendLog("device", "Serial port connected.");

  await refreshDeviceState();
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
  updateConnectionBadge("Disconnected", "warn");

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
      pending.reject(new Error(`Timeout waiting for ${command}`));
      appendLog("error", `${command} timed out`);
    }
  }, 15000);

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
  renderDeviceSummary();
  renderLorawanSummary();
}

function hydrateFromDevice(force = false) {
  const device = state.deviceInfo?.device;
  if (!device) {
    return;
  }

  if (force) {
    refs.configAutoMintEnabledInput.checked = Boolean(device.config?.autoMintEnabled);
    refs.configAutoMintIntervalInput.value = String(device.config?.autoMintIntervalSeconds || 1800);
    refs.mintTickInput.value = device.config?.defaultTick || refs.mintTickInput.value;
    refs.mintAmountInput.value = String(device.config?.defaultMintAmount || refs.mintAmountInput.value);
    refs.balanceDeviceIdInput.value = device.deviceId || refs.balanceDeviceIdInput.value;
    refs.transactionsDeviceIdInput.value = device.deviceId || refs.transactionsDeviceIdInput.value;
  }
}

function hydrateFromLoRaWan(force = false) {
  const config = state.lorawanInfo?.config;
  const heltec = state.lorawanInfo?.heltec;
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

function renderDeviceSummary() {
  const device = state.deviceInfo?.device;
  if (!device) {
    refs.deviceIdValue.textContent = "-";
    refs.nextNonceValue.textContent = "-";
    refs.autoMintValue.textContent = "-";
    refs.defaultMintValue.textContent = "-";
    refs.deviceSummaryOutput.textContent = "No device data yet.";
    return;
  }

  refs.deviceIdValue.textContent = device.deviceId || "-";
  refs.nextNonceValue.textContent = String(device.nextNonce ?? "-");
  refs.autoMintValue.textContent = device.config.autoMintEnabled
    ? `Enabled / ${device.config.autoMintIntervalSeconds}s`
    : "Disabled";
  refs.defaultMintValue.textContent = `${device.config.defaultTick} / ${device.config.defaultMintAmount}`;
  refs.deviceSummaryOutput.textContent = formatJson(device);
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
    refs.lorawanSummaryOutput.textContent = "No LoRaWAN status yet.";
    return;
  }

  refs.lorawanJoinedValue.textContent = runtime.joined ? "Yes" : runtime.joining ? "Joining..." : "No";
  refs.lorawanPortValue.textContent = String(config.appPort ?? "-");
  refs.lorawanEventValue.textContent = runtime.lastEvent || "-";
  refs.lorawanDevEuiValue.textContent = config.devEuiHex || runtime.chipIdHex || "-";
  refs.lorawanSummaryOutput.textContent = formatJson(sanitizeForLog({ config, runtime, heltec }));
}

function renderPreparedOutput() {
  refs.preparedOutput.textContent = state.lastPrepared ? formatJson(state.lastPrepared) : "No prepared payload yet.";
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
  const prepared = await sendCommand(prepareCommand, params);
  state.lastPrepared = {
    label,
    preparedAt: new Date().toISOString(),
    result: prepared
  };
  renderPreparedOutput();

  if (!sendNow) {
    return prepared;
  }

  if (!state.lorawanInfo?.config) {
    const lorawan = await sendCommand("get_lorawan");
    state.lorawanInfo = lorawan;
  }

  const config = state.lorawanInfo?.config || {};
  const sendResult = await sendCommand("lorawan_send", {
    payloadHex: prepared.payloadHex,
    port: config.appPort || 1,
    confirmed: Boolean(config.confirmedUplink),
    commitNonce: true,
    nonceToCommit: prepared.nonce
  });

  state.lastPrepared.sendResult = sendResult;
  renderPreparedOutput();
  await refreshDeviceState();
  return { prepared, sendResult };
}

function saveProfileFromEditor() {
  const profile = {
    id: state.editingProfileId || `profile-${Date.now()}`,
    name: refs.profileNameInput.value.trim() || `${refs.profileTickInput.value.trim().toUpperCase()} / ${refs.profileAmountInput.value.trim()}`,
    tick: refs.profileTickInput.value.trim().toUpperCase(),
    amount: refs.profileAmountInput.value.trim(),
    intervalMinutes: Number(refs.profileIntervalInput.value),
    enabled: refs.profileEnabledInput.checked
  };

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
  } else {
    state.profiles.unshift(profile);
  }

  persistProfiles();
  renderProfiles();
  clearProfileEditor();
}

function clearProfileEditor() {
  state.editingProfileId = null;
  refs.profileNameInput.value = "";
  refs.profileTickInput.value = "LORA";
  refs.profileAmountInput.value = "100";
  refs.profileIntervalInput.value = "30";
  refs.profileEnabledInput.checked = true;
}

function renderProfiles() {
  refs.profileList.innerHTML = "";

  if (!state.profiles.length) {
    refs.profileList.innerHTML = `<article class="profile-card"><strong>No profiles saved.</strong></article>`;
    return;
  }

  for (const profile of state.profiles) {
    const article = document.createElement("article");
    article.className = "profile-card";
    article.innerHTML = `
      <div>
        <div class="profile-card__meta">
          <span class="profile-chip">${escapeHtml(profile.tick)}</span>
          <span class="profile-chip profile-chip--teal">${escapeHtml(String(profile.amount))}</span>
          <span class="profile-chip">${escapeHtml(String(profile.intervalMinutes))} min</span>
          <span class="profile-chip profile-chip--teal">${profile.enabled ? "enabled" : "disabled"}</span>
        </div>
        <h3>${escapeHtml(profile.name)}</h3>
      </div>
      <div class="button-row">
        <button class="button button--ghost" type="button" data-profile-action="edit" data-profile-id="${profile.id}">Edit</button>
        <button class="button button--secondary" type="button" data-profile-action="apply" data-profile-id="${profile.id}">Apply</button>
        <button class="button button--primary" type="button" data-profile-action="broadcast" data-profile-id="${profile.id}">Apply + broadcast</button>
        <button class="button button--ghost" type="button" data-profile-action="mint" data-profile-id="${profile.id}">Mint now</button>
        <button class="button button--ghost" type="button" data-profile-action="stop" data-profile-id="${profile.id}">Stop auto-mint</button>
        <button class="button button--ghost" type="button" data-profile-action="delete" data-profile-id="${profile.id}">Delete</button>
      </div>
    `;
    refs.profileList.append(article);
  }
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
    return;
  }

  if (action === "apply") {
    await applyProfileToDevice(profile, false);
    return;
  }

  if (action === "broadcast") {
    await applyProfileToDevice(profile, true);
    return;
  }

  if (action === "mint") {
    await prepareAndMaybeSend("Profile mint", "prepare_mint", {
      tick: profile.tick,
      amount: profile.amount,
      commit: false
    }, true);
    return;
  }

  if (action === "stop") {
    await sendCommand("set_config", {
      autoMintEnabled: false,
      autoMintIntervalSeconds: profile.intervalMinutes * 60,
      defaultTick: profile.tick,
      defaultMintAmount: profile.amount
    });
    refs.configAutoMintEnabledInput.checked = false;
    appendLog("profile", `Auto-mint disabled for ${profile.name}.`);
    await refreshDeviceState();
  }
}

async function applyProfileToDevice(profile, broadcastConfig) {
  await sendCommand("set_config", {
    autoMintEnabled: Boolean(profile.enabled),
    autoMintIntervalSeconds: profile.intervalMinutes * 60,
    defaultTick: profile.tick,
    defaultMintAmount: profile.amount
  });

  refs.configAutoMintEnabledInput.checked = Boolean(profile.enabled);
  refs.configAutoMintIntervalInput.value = String(profile.intervalMinutes * 60);
  refs.mintTickInput.value = profile.tick;
  refs.mintAmountInput.value = profile.amount;
  appendLog("profile", `Applied profile ${profile.name} to device defaults.`);

  if (broadcastConfig) {
    await prepareAndMaybeSend("Profile config", "prepare_config", {
      autoMintEnabled: Boolean(profile.enabled),
      autoMintIntervalSeconds: profile.intervalMinutes * 60,
      commit: false
    }, true);
  } else {
    await refreshDeviceState();
  }
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

window.addEventListener("error", (event) => {
  appendLog("error", event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  appendLog("error", event.reason?.message || "Unhandled promise rejection.");
});
