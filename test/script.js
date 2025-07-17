const translations = {
  en: {
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
    language: "English",
    wallet_label: "Wallet",
    disconnected: "Disconnected",
    connect: "Connect Wallet",
    wallet_contents: "Wallet Contents",
    liquidity_pool: "Liquidity Pool",
    swap: "Token Swap",
    manage_liquidity: "Manage Liquidity",
    configure_contract: "Configure Contract",
    add_network: "Add Network",
    network_config: "Network Configuration",
    contract_config: "Contract Configuration",
    select_network: "Select Network",
    select_percent: "Select %",
    interaction_info: "<b>Connect your wallet</b>, configure the contract and network to swap tokens or manage liquidity.",
    wallet_recommendation: "Recommended wallet: <a href=\"https://rabby.io/\" target=\"_blank\">Rabby.io</a> (supports permission revocation).",
    transaction_history: "Check transaction history on <a href=\"https://debank.com/\" target=\"_blank\">DeBank.com</a>.",
    chainlist_info: "Find or add network parameters at <a href=\"https://chainlist.org/\" target=\"_blank\">Chainlist.org</a>.",
    error_label: "Error",
    error_no_wallet: "Install a wallet (Rabby/MetaMask)!",
    error_wallet_conflict: "Multiple wallets detected (e.g., MetaMask, Zerion). Disable other wallet extensions and use Rabby.",
    error_switch_network: "Cannot switch network:",
    error_add_network: "Cannot add network:",
    error_connect_wallet: "Wallet connection error:",
    error_invalid_abi: "Invalid contract ABI:",
    error_invalid_address: "Invalid contract or token address:",
    error_approval_failed: "Token approval failed:",
    error_swap_failed: "Swap failed:",
    error_liquidity_failed: "Liquidity operation failed:",
    error_insufficient_balance: "Insufficient balance!",
    error_balance_fetch: "Unable to fetch balances:",
    error_invalid_percent: "Percentage must be between 1 and 100!",
    error_token_info: "Unable to fetch token info:",
    copied: "Copied!",
    copy_button: "Copy",
    chain_id: "Chain ID (e.g., 42170)",
    rpc_url: "RPC URL (e.g., https://nova.arbitrum.io/rpc)",
    chain_name: "Network Name (e.g., Arbitrum Nova)",
    native_currency: "Currency Symbol (e.g., ETH)",
    block_explorer: "Explorer URL (e.g., https://nova.arbiscan.io)",
    contract_address: "Contract Address (e.g., 0xEe01...)",
    contract_abi: "Paste Contract ABI (JSON)",
    contract_type: "Contract Type",
    token_a: "Token A Address (e.g., DAI)",
    token_b: "Token B Address (e.g., WETH)",
    enter_percent: "Enter % (1–100)",
    swap_amount_out_min: "Min. Output Amount (e.g., 0.1)",
    amount_token_a_min: "Min. Token A Amount (e.g., 0.475)",
    amount_token_b_min: "Min. Token B Amount (e.g., 0.00026369)",
    loading_swap: "Performing swap on blockchain, wait for wallet...",
    loading_liquidity: "Performing liquidity operation, wait for wallet..."
  },
  pl: {
    theme_light: "Tryb Jasny",
    theme_dark: "Tryb Ciemny",
    language: "Polski",
    wallet_label: "Portfel",
    disconnected: "Niepołączony",
    connect: "Połącz Portfel",
    wallet_contents: "Zawartość Portfela",
    liquidity_pool: "Pula Płynności",
    swap: "Zamiana Tokenów",
    manage_liquidity: "Zarządzaj Płynnością",
    configure_contract: "Skonfiguruj Kontrakt",
    add_network: "Dodaj Sieć",
    network_config: "Konfiguracja Sieci",
    contract_config: "Konfiguracja Kontraktu",
    select_network: "Wybierz Sieć",
    select_percent: "Wybierz %",
    interaction_info: "<b>Połącz portfel</b>, skonfiguruj kontrakt i sieć, aby swapować tokeny lub zarządzać płynnością.",
    wallet_recommendation: "Polecany portfel: <a href=\"https://rabby.io/\" target=\"_blank\">Rabby.io</a> (obsługuje cofanie uprawnień).",
    transaction_history: "Sprawdź historię transakcji na <a href=\"https://debank.com/\" target=\"_blank\">DeBank.com</a>.",
    chainlist_info: "Znajdź lub dodaj parametry sieci na <a href=\"https://chainlist.org/\" target=\"_blank\">Chainlist.org</a>.",
    error_label: "Błąd",
    error_no_wallet: "Zainstaluj portfel (Rabby/MetaMask)!",
    error_wallet_conflict: "Wykryto wiele portfeli (np. MetaMask, Zerion). Wyłącz inne rozszerzenia portfeli i użyj Rabby.",
    error_switch_network: "Nie można przełączyć sieci:",
    error_add_network: "Nie można dodać sieci:",
    error_connect_wallet: "Błąd połączenia z portfelem:",
    error_invalid_abi: "Nieprawidłowe ABI kontraktu:",
    error_invalid_address: "Nieprawidłowy adres kontraktu lub tokena:",
    error_approval_failed: "Zatwierdzenie tokena nie powiodło się:",
    error_swap_failed: "Zamiana nie powiodła się:",
    error_liquidity_failed: "Operacja płynności nie powiodła się:",
    error_insufficient_balance: "Niewystarczające saldo!",
    error_balance_fetch: "Nie można pobrać sald:",
    error_invalid_percent: "Procent musi być między 1 a 100!",
    error_token_info: "Nie można pobrać informacji o tokenie:",
    copied: "Skopiowano!",
    copy_button: "Kopiuj",
    chain_id: "Chain ID (np. 42170)",
    rpc_url: "RPC URL (np. https://nova.arbitrum.io/rpc)",
    chain_name: "Nazwa sieci (np. Arbitrum Nova)",
    native_currency: "Symbol waluty (np. ETH)",
    block_explorer: "Explorer URL (np. https://nova.arbiscan.io)",
    contract_address: "Adres kontraktu (np. 0xEe01...)",
    contract_abi: "Wklej ABI kontraktu (JSON)",
    contract_type: "Typ kontraktu",
    token_a: "Adres Token A (np. DAI)",
    token_b: "Adres Token B (np. WETH)",
    enter_percent: "Wprowadź % (1–100)",
    swap_amount_out_min: "Min. ilość wyjściowa (np. 0.1)",
    amount_token_a_min: "Min. ilość Token A (np. 0.475)",
    amount_token_b_min: "Min. ilość Token B (np. 0.00026369)",
    loading_swap: "Trwa zamiana na blockchain, poczekaj na portfel...",
    loading_liquidity: "Trwa operacja płynności, poczekaj na portfel..."
  }
};

const networks = {
  "1": {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.infura.io/v3/YOUR-PROJECT-ID"],
    blockExplorerUrls: ["https://etherscan.io"]
  },
  "42170": {
    chainId: "0x66eea",
    chainName: "Arbitrum Nova",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://nova.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://nova.arbiscan.io"]
  },
  "204": {
    chainId: "0xcc",
    chainName: "opBNB",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org"],
    blockExplorerUrls: ["https://mainnet.opbnbscan.com"]
  },
  "137": {
    chainId: "0x89",
    chainName: "Polygon",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"]
  }
  // Możesz dodać więcej sieci z Chainlist.org
};

let provider, signer, account, routerContract, lpContract, tokenAContract, tokenBContract;
let tokenAAddress, tokenBAddress;

async function connectWallet() {
  let ethereumProvider = window.ethereum;
  if (window.ethereum && window.ethereum.providers) {
    console.log("Multiple wallet providers detected:", window.ethereum.providers);
    const rabbyProvider = window.ethereum.providers.find(p => p.isRabby);
    const metaMaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
    if (rabbyProvider) {
      console.log("Selecting Rabby as provider");
      ethereumProvider = rabbyProvider;
    } else if (metaMaskProvider) {
      console.log("Falling back to MetaMask");
      ethereumProvider = metaMaskProvider;
    } else {
      showError(translations[localStorage.language || "en"].error_wallet_conflict);
      return;
    }
  }

  if (!ethereumProvider) {
    showError(translations[localStorage.language || "en"].error_no_wallet);
    return;
  }

  try {
    console.log("Attempting wallet connection...");
    provider = new ethers.BrowserProvider(ethereumProvider);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();
    console.log("Connected to address:", account);
    document.getElementById("wallet-address").innerHTML = 
      `<span class="copy-container" title="Click to copy" style="cursor:pointer; background:#1b263b; padding:6px 10px; border-radius:6px; display:inline-block; font-family:monospace;">${account.slice(0, 6)}...${account.slice(-4)}</span>`;
    document.querySelector(".copy-container").addEventListener('click', () => {
      copyToClipboard(account);
      showToast(translations[localStorage.language || "en"].copied);
    });
    await updateBalances();
    document.getElementById("swapButton").disabled = !routerContract || !tokenAContract || !tokenBContract;
    document.getElementById("liquidityButton").disabled = !routerContract || !lpContract;
  } catch (error) {
    console.error("Wallet connection error:", error);
    showError(translations[localStorage.language || "en"].error_connect_wallet + " " + error.message);
  }
}

function loadNetworkParams() {
  const chainId = document.getElementById("networkSelect").value;
  if (chainId && networks[chainId]) {
    const network = networks[chainId];
    document.getElementById("chainId").value = parseInt(network.chainId, 16);
    document.getElementById("rpcUrl").value = network.rpcUrls[0];
    document.getElementById("chainName").value = network.chainName;
    document.getElementById("nativeCurrency").value = network.nativeCurrency.symbol;
    document.getElementById("blockExplorer").value = network.blockExplorerUrls[0] || "";
  }
}

async function addNetwork() {
  const chainId = document.getElementById("chainId").value;
  const rpcUrl = document.getElementById("rpcUrl").value;
  const chainName = document.getElementById("chainName").value;
  const nativeCurrency = document.getElementById("nativeCurrency").value;
  const blockExplorer = document.getElementById("blockExplorer").value;

  if (!chainId || !rpcUrl || !chainName || !nativeCurrency) {
    showError("Please fill in all network fields");
    return;
  }

  const network = {
    chainId: `0x${parseInt(chainId).toString(16)}`,
    chainName,
    nativeCurrency: { name: nativeCurrency, symbol: nativeCurrency, decimals: 18 },
    rpcUrls: [rpcUrl],
    blockExplorerUrls: blockExplorer ? [blockExplorer] : []
  };

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }]
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [network]
        });
      } catch (addError) {
        showError(translations[localStorage.language || "en"].error_add_network + " " + addError.message);
        return;
      }
    } else {
      showError(translations[localStorage.language || "en"].error_switch_network + " " + switchError.message);
      return;
    }
  }
}

async function fetchTokenInfo(tokenAddress, nameElement, symbolElement) {
  if (!provider || !ethers.isAddress(tokenAddress)) return;
  try {
    const tokenContract = new ethers.Contract(tokenAddress, [
      {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}
    ], provider);
    const [name, symbol] = await Promise.all([
      tokenContract.name().catch(() => "Unknown"),
      tokenContract.symbol().catch(() => "Unknown")
    ]);
    document.getElementById(nameElement).textContent = name;
    document.getElementById(symbolElement).textContent = symbol;
  } catch (error) {
    console.error("Error fetching token info:", error);
    showError(translations[localStorage.language || "en"].error_token_info + " " + error.message);
  }
}

async function configureContract() {
  const contractAddress = document.getElementById("contractAddress").value;
  const contractAbi = document.getElementById("contractAbi").value;
  const contractType = document.getElementById("contractType").value;
  tokenAAddress = document.getElementById("tokenA").value;
  tokenBAddress = document.getElementById("tokenB").value;

  if (!ethers.isAddress(contractAddress) || !ethers.isAddress(tokenAAddress) || !ethers.isAddress(tokenBAddress)) {
    showError(translations[localStorage.language || "en"].error_invalid_address);
    return;
  }

  let abi;
  try {
    abi = JSON.parse(contractAbi);
  } catch (error) {
    showError(translations[localStorage.language || "en"].error_invalid_abi + " " + error.message);
    return;
  }

  if (!provider || !signer) {
    showError(translations[localStorage.language || "en"].error_connect_wallet);
    return;
  }

  try {
    if (contractType === "router") {
      routerContract = new ethers.Contract(contractAddress, abi, signer);
    } else {
      lpContract = new ethers.Contract(contractAddress, abi, signer);
    }
    tokenAContract = new ethers.Contract(tokenAAddress, [
      {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
      {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}
    ], signer);
    tokenBContract = new ethers.Contract(tokenBAddress, [
      {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
      {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}
    ], signer);
    await Promise.all([
      fetchTokenInfo(tokenAAddress, "tokenAName", "tokenASymbol"),
      fetchTokenInfo(tokenBAddress, "tokenBName", "tokenBSymbol")
    ]);
    await updateBalances();
    document.getElementById("swapButton").disabled = !routerContract || !tokenAContract || !tokenBContract;
    document.getElementById("liquidityButton").disabled = !routerContract || !lpContract;
    showToast("Contract configured successfully");
  } catch (error) {
    console.error("Contract configuration error:", error);
    showError("Contract configuration failed: " + error.message);
  }
}

async function updateBalances() {
  if (!signer || !provider || !tokenAContract || !tokenBContract) {
    console.error("No wallet or contracts connected");
    return;
  }
  try {
    const [bTokenA, bTokenB, bLP] = await Promise.all([
      tokenAContract.balanceOf(account).catch(e => { console.error("Error fetching Token A balance:", e); return 0; }),
      tokenBContract.balanceOf(account).catch(e => { console.error("Error fetching Token B balance:", e); return 0; }),
      lpContract ? lpContract.balanceOf(account).catch(e => { console.error("Error fetching LP balance:", e); return 0; }) : Promise.resolve(0)
    ]);
    document.getElementById("balance-tokenA").textContent = bTokenA ? parseFloat(ethers.formatUnits(bTokenA, 18)).toFixed(8) : "–";
    document.getElementById("balance-tokenB").textContent = bTokenB ? parseFloat(ethers.formatUnits(bTokenB, 18)).toFixed(8) : "–";
    document.getElementById("balance-lp").textContent = bLP ? parseFloat(ethers.formatUnits(bLP, 18)).toFixed(8) : "–";
  } catch (error) {
    console.error("Balance update error:", error);
    showError(translations[localStorage.language || "en"].error_balance_fetch + " " + error.message);
  }
}

async function swapTokens() {
  if (!routerContract || !tokenAContract || !tokenBContract || !signer) {
    showError(translations[localStorage.language || "en"].error_connect_wallet);
    return;
  }

  const direction = document.getElementById("swapDirection").value;
  let percent = parseFloat(document.getElementById("swapPercent").value);
  const amountOutMin = document.getElementById("swapAmountOutMin").value;

  if (isNaN(percent) || percent < 1 || percent > 100) {
    showError(translations[localStorage.language || "en"].error_invalid_percent);
    return;
  }

  try {
    showLoadingToast("loading_swap");
    const tokenIn = direction === "AtoB" ? tokenAContract : tokenBContract;
    const tokenOut = direction === "AtoB" ? tokenBContract : tokenAContract;
    const tokenInAddress = direction === "AtoB" ? tokenAAddress : tokenBAddress;
    const tokenOutAddress = direction === "AtoB" ? tokenBAddress : tokenAAddress;

    const balance = await tokenIn.balanceOf(account);
    if (balance === 0) {
      showError(translations[localStorage.language || "en"].error_insufficient_balance);
      return;
    }

    const amountIn = balance * BigInt(Math.floor(percent * 100)) / BigInt(10000);
    const allowance = await tokenIn.allowance(account, routerContract.target);
    if (allowance < amountIn) {
      const txApprove = await tokenIn.approve(routerContract.target, amountIn, { gasLimit: 100000 });
      await txApprove.wait();
    }

    const path = [tokenInAddress, tokenOutAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const tx = await routerContract.swapExactTokensForTokens(
      amountIn,
      ethers.parseUnits(amountOutMin || "0", 18),
      path,
      account,
      deadline,
      { gasLimit: 300000 }
    );
    showToast(`Swap transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    showToast(`Swap completed in block ${receipt.blockNumber}`);
    await updateBalances();
  } catch (error) {
    console.error("Swap error:", error);
    showError(translations[localStorage.language || "en"].error_swap_failed + " " + error.message);
  } finally {
    hideLoadingToast();
  }
}

async function manageLiquidity() {
  if (!routerContract || !lpContract || !tokenAContract || !tokenBContract || !signer) {
    showError(translations[localStorage.language || "en"].error_connect_wallet);
    return;
  }

  const action = document.getElementById("liquidityAction").value;
  let percent = parseFloat(document.getElementById("liquidityPercent").value);
  const amountTokenAMin = document.getElementById("amountTokenAMin").value;
  const amountTokenBMin = document.getElementById("amountTokenBMin").value;

  if (isNaN(percent) || percent < 1 || percent > 100) {
    showError(translations[localStorage.language || "en"].error_invalid_percent);
    return;
  }

  try {
    showLoadingToast("loading_liquidity");
    if (action === "add") {
      const balanceA = await tokenAContract.balanceOf(account);
      const balanceB = await tokenBContract.balanceOf(account);
      if (balanceA === 0 || balanceB === 0) {
        showError(translations[localStorage.language || "en"].error_insufficient_balance);
        return;
      }

      const amountA = balanceA * BigInt(Math.floor(percent * 100)) / BigInt(10000);
      const amountB = balanceB * BigInt(Math.floor(percent * 100)) / BigInt(10000);
      const allowanceA = await tokenAContract.allowance(account, routerContract.target);
      const allowanceB = await tokenBContract.allowance(account, routerContract.target);
      const approvals = [];
      if (allowanceA < amountA) approvals.push(tokenAContract.approve(routerContract.target, amountA, { gasLimit: 100000 }));
      if (allowanceB < amountB) approvals.push(tokenBContract.approve(routerContract.target, amountB, { gasLimit: 100000 }));
      if (approvals.length > 0) await Promise.all(approvals.map(tx => tx.wait()));

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const tx = await routerContract.addLiquidity(
        tokenAAddress,
        tokenBAddress,
        amountA,
        amountB,
        ethers.parseUnits(amountTokenAMin || "0", 18),
        ethers.parseUnits(amountTokenBMin || "0", 18),
        account,
        deadline,
        { gasLimit: 300000 }
      );
      showToast(`Liquidity addition transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      showToast(`Liquidity added in block ${receipt.blockNumber}`);
    } else {
      const balanceLP = await lpContract.balanceOf(account);
      if (balanceLP === 0) {
        showError(translations[localStorage.language || "en"].error_insufficient_balance);
        return;
      }

      const liquidity = balanceLP * BigInt(Math.floor(percent * 100)) / BigInt(10000);
      const allowance = await lpContract.allowance(account, routerContract.target);
      if (allowance < liquidity) {
        const txApprove = await lpContract.approve(routerContract.target, liquidity, { gasLimit: 100000 });
        await txApprove.wait();
      }

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const tx = await routerContract.removeLiquidity(
        tokenAAddress,
        tokenBAddress,
        liquidity,
        ethers.parseUnits(amountTokenAMin || "0", 18),
        ethers.parseUnits(amountTokenBMin || "0", 18),
        account,
        deadline,
        { gasLimit: 300000 }
      );
      showToast(`Liquidity removal transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      showToast(`Liquidity removed in block ${receipt.blockNumber}`);
    }
    await updateBalances();
  } catch (error) {
    console.error("Liquidity operation error:", error);
    showError(translations[localStorage.language || "en"].error_liquidity_failed + " " + error.message);
  } finally {
    hideLoadingToast();
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.getAttribute("data-theme") === "light";
  const newTheme = isLight ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  localStorage.theme = newTheme;
  const lang = localStorage.language || "en";
  document.querySelector(".theme-toggle").innerHTML = `<i class="fas fa-${newTheme === "light" ? "sun" : "moon"}"></i> <span data-i18n="theme_${newTheme}">${translations[lang][`theme_${newTheme}`]}</span>`;
}

function toggleLanguage() {
  const newLang = localStorage.language === "pl" ? "en" : "pl";
  localStorage.language = newLang;
  updateTranslations(newLang);
  document.querySelector(".lang-toggle").innerHTML = `<i class="fas fa-globe"></i> <span data-i18n="language">${translations[newLang].language}</span>`;
  document.querySelector(".theme-toggle").innerHTML = `<i class="fas fa-${localStorage.theme === "light" ? "sun" : "moon"}"></i> <span data-i18n="theme_${localStorage.theme || "dark"}">${translations[newLang][`theme_${localStorage.theme || "dark"}`]}</span>`;
}

function updateTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    element.innerHTML = translations[lang][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.getAttribute("data-i18n-placeholder");
    element.placeholder = translations[lang][key];
  });
}

function showError(message) {
  const toastContainer = document.getElementById("toast-container") || createToastContainer();
  const lang = localStorage.language || "en";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <strong data-i18n="error_label">${translations[lang].error_label}:</strong>
    <span class="toast-message">${message}</span>
    <div class="toast-buttons">
      <button class="toast-copy"><i class="fas fa-copy"></i> <span data-i18n="copy_button">${translations[lang].copy_button}</span></button>
      <button class="toast-close"><i class="fas fa-times"></i></button>
    </div>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  const timeout = setTimeout(() => removeToast(toast), 7000);
  toast.querySelector(".toast-copy").addEventListener("click", () => {
    copyToClipboard(message);
    toast.querySelector(".toast-copy span").innerHTML = translations[lang].copied;
    setTimeout(() => {
      toast.querySelector(".toast-copy span").innerHTML = translations[lang].copy_button;
    }, 2000);
  });
  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(timeout);
    removeToast(toast);
  });
}

function showToast(message) {
  const toastContainer = document.getElementById("toast-container") || createToastContainer();
  const lang = localStorage.language || "en";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
    <div class="toast-buttons">
      <button class="toast-copy"><i class="fas fa-copy"></i> <span data-i18n="copy_button">${translations[lang].copy_button}</span></button>
      <button class="toast-close"><i class="fas fa-times"></i></button>
    </div>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  const timeout = setTimeout(() => removeToast(toast), 7000);
  toast.querySelector(".toast-copy").addEventListener("click", () => {
    copyToClipboard(message);
    toast.querySelector(".toast-copy span").innerHTML = translations[lang].copied;
    setTimeout(() => {
      toast.querySelector(".toast-copy span").innerHTML = translations[lang].copy_button;
    }, 2000);
  });
  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(timeout);
    removeToast(toast);
  });
}

function showLoadingToast(action) {
  const toastContainer = document.getElementById("toast-container") || createToastContainer();
  const lang = localStorage.language || "en";
  const toast = document.createElement("div");
  toast.className = "toast loading-toast";
  toast.innerHTML = `
    <span class="toast-message">${translations[lang][action]}</span>
    <div class="toast-buttons">
      <button class="toast-close"><i class="fas fa-times"></i></button>
    </div>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
}

function hideLoadingToast() {
  const toastContainer = document.getElementById("toast-container");
  if (toastContainer) {
    const loadingToast = toastContainer.querySelector(".loading-toast");
    if (loadingToast) {
      loadingToast.classList.remove("show");
      loadingToast.classList.add("hide");
      setTimeout(() => loadingToast.remove(), 300);
    }
  }
}

function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toast-container";
  document.body.appendChild(container);
  return container;
}

function removeToast(toast) {
  toast.classList.remove("show");
  toast.classList.add("hide");
  setTimeout(() => toast.remove(), 300);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(err => console.error("Copy failed:", err));
}

(function initialize() {
  if (typeof ethers === 'undefined') {
    console.error('Ethers.js not loaded');
    showError('Error: Ethers.js library not loaded. Try refreshing the page.');
    return;
  }
  const th = localStorage.theme || "dark";
  document.documentElement.setAttribute("data-theme", th);
  const lang = localStorage.language || "en";
  updateTranslations(lang);
  document.querySelector(".theme-toggle").innerHTML = `<i class="fas fa-${th === "light" ? "sun" : "moon"}"></i> <span data-i18n="theme_${th}">${translations[lang][`theme_${th}`]}</span>`;
  document.querySelector(".lang-toggle").innerHTML = `<i class="fas fa-globe"></i> <span data-i18n="language">${translations[lang].language}</span>`;
})();
