let provider, signer, account;
const addr0101 = "0xa41b3067ec694dbec668c389550ba8fc589e5797";
const addrLP = "0x506b8322e1159d06e493ebe7ffa41a24291e7ae3";
const routerAddr = "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b";
const wbnbAddress = "0x4200000000000000000000000000000000000006";

const opBNB = {
  chainId: "0xcc",
  chainName: "opBNB",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org/"],
  blockExplorerUrls: ["https://mainnet.opbnbscan.com/"]
};

const ERC20 = [
  "function balanceOf(address) view returns(uint256)",
  "function approve(address,uint256) returns(bool)",
  "function allowance(address,address) view returns(uint256)"
];

const ROUTER = [
  "function getAmountsOut(uint amountIn, address[] calldata path) view returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)",
  "function addLiquidityETH(address,uint,uint,uint,address,uint) payable returns(uint,uint,uint)",
  "function removeLiquidityETH(address,uint,uint,uint,address,uint) returns(uint,uint)"
];

const translations = {
  en: {
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
    language: "English",
    music_on: "Music: On",
    music_off: "Music: Off",
    documentation: "Documentation",
    price: "0101/WBNB Price",
    fast_bridge: "Fast Bridge opBNB ⇄ FDUSD",
    official_bridge: "Official Bridge opBNB ⇄ BNB (7 days)",
    emergency_mode: "Emergency Mode",
    interaction_info: "(<b>Clicking SWAP or Add/Remove LP</b> requires several subsequent clicks to approve the contract interaction for the specified amount – e.g., approving the Swap contract and confirming the Swap)",
    gui_info: "This is a secure (SSL) backup GUI using BinarySwap's original contract functions.",
    wallet_recommendation: "I recommend the <a href=\"https://rabby.io/\" target=\"_blank\">Rabby.io</a> wallet where you can also revoke permissions.",
    transaction_history: "For transaction history, check <a href=\"https://debank.com/\" target="_blank\">DeBank.com</a>.",
    wallet_label: "Wallet",
    disconnected: "Disconnected",
    connect: "Connect/Refresh Wallet",
    switch: "Switch to opBNB",
    wallet_contents: "Wallet Contents",
    swap: "Swap",
    swap_button: "Swap",
    liquidity_pool: "Liquidity Pool",
    add_lp: "Add Liquidity",
    remove_lp: "Remove Liquidity",
    emergency: "MasterChef – Emergency LP, NFT Withdrawal:",
    step1: "Step 1:",
    contract_instruction_1: "Visit the contract:",
    contract_instruction_2: "Copy the Contract Address and the Contract ABI field.",
    step2: "Step 2:",
    contract_instruction_3: "Open in a new tab:",
    smart_contract_interface: "Smart Contract Interface",
    contract_instruction_4: "Switch to opBNB network and paste the data into the respective fields.",
    step3: "Step 3:",
    contract_instruction_5: "Go to the emergencyWithdraw field and enter 0, 1, 2, 3, 4, 5, etc.",
    contract_instruction_6: "Depending on what you staked, Rabby Wallet will show a signing message (e.g., LP or NFT withdrawal).",
    contract_instruction_7: "Approve each transaction showing a withdrawal from the contract and check the LP token amount in DeBank or above.",
    factory: "Factory",
    init: "Init",
    router: "Router",
    multi: "Multi",
    masterchef: "Masterchef",
    masterchef_audit: "MasterChef Audit",
    lp_burn: "LP burn",
    terminals: "Terminals",
    wrapped_terminals: "Wrapped Terminals",
    token_0101: "0101 Token",
    lp_0101_bnb: "LP 0101/BNB",
    block_explorer: "opBNB Block Explorer",
    enter_amount: "Enter amount (1–100) %",
    error_label: "Error",
    error_invalid_percent: "Percentage must be 1–100!",
    error_no_metamask: "Install MetaMask!",
    error_switch_network: "Cannot switch network:",
    error_add_network: "Cannot add opBNB network:",
    error_connect_wallet: "Wallet connection error:",
    error_swap_bnb_to_0101: "Error swapping (BNB → 0101):",
    error_swap_0101_to_bnb: "Error swapping (0101 → BNB):",
    error_invalid_pair: "Cannot swap the same token!",
    error_play_music: "Cannot play music:",
    error_insufficient_balance: "Insufficient balance for this transaction!",
    error_approval_failed: "Token approval failed!",
    error_liquidity_failed: "Liquidity operation failed!",
    copy_button: "Copy",
    copied: "Copied!"
  },
  pl: {
    theme_light: "Tryb Jasny",
    theme_dark: "Tryb Ciemny",
    language: "Polski",
    music_on: "Muzyka: Wł.",
    music_off: "Muzyka: Wył.",
    documentation: "Dokumentacja",
    price: "Cena 0101/WBNB",
    fast_bridge: "Szybki Most opBNB ⇄ FDUSD",
    official_bridge: "Oficjalny Most opBNB ⇄ BNB (7 dni)",
    emergency_mode: "Tryb Awaryjny",
    interaction_info: "(<b>Klikając ZAMIANA lub Dodaj/Usuń LP</b> wymaga to kilku kolejnych kliknięć w celu zatwierdzenia interakcji z kontraktem na podaną sumę – np. zatwierdzenie kontraktu Zamiany i potwierdzenie Zamiany)",
    gui_info: "Jest to bezpieczne (SSL) zastępcze GUI korzystające z oryginalnych funkcji kontraktów BinarySwap.",
    wallet_recommendation: "Polecam portfel <a href=\"https://rabby.io/\" target=\"_blank\">Rabby.io</a>, gdzie możesz również cofnąć uprawnienia.",
    transaction_history: "Do podglądu historii transakcji sprawdź <a href=\"https://debank.com/\" target="_blank\">DeBank.com</a>.",
    wallet_label: "Portfel",
    disconnected: "Niepołączony",
    connect: "Połącz/Odśwież Portfel",
    switch: "Przełącz na opBNB",
    wallet_contents: "Zawartość Portfela",
    swap: "Zamiana",
    swap_button: "Zamiana",
    liquidity_pool: "Pula Płynności",
    add_lp: "Dodaj Płynność",
    remove_lp: "Usuń Płynność",
    emergency: "MasterChef – Awaryjna wypłata LP, NFT:",
    step1: "Krok 1:",
    contract_instruction_1: "Wejdź na kontrakt:",
    contract_instruction_2: "Skopiuj adres kontraktu oraz pole Contract ABI.",
    step2: "Krok 2:",
    contract_instruction_3: "Otwórz w nowej zakładce:",
    smart_contract_interface: "Interfejs Kontraktów Inteligentnych",
    contract_instruction_4: "Przełącz na sieć opBNB i wklej dane w odpowiednie pola.",
    step3: "Krok 3:",
    contract_instruction_5: "Przejdź do pola emergencyWithdraw i wpisz 0, 1, 2, 3, 4, 5 itd.",
    contract_instruction_6: "W zależności od stakowania, Rabby Wallet pokaże komunikat (np. wypłata LP lub NFT).",
    contract_instruction_7: "Zatwierdź każdą transakcję i sprawdź ilość tokenów LP w DeBank lub powyżej.",
    factory: "Fabryka",
    init: "Inicjalizacja",
    router: "Router",
    multi: "Multi",
    masterchef: "Masterchef",
    masterchef_audit: "Audyt MasterChef",
    lp_burn: "Spalanie LP",
    terminals: "Terminale",
    wrapped_terminals: "Zawinięte Terminale",
    token_0101: "Token 0101",
    lp_0101_bnb: "LP 0101/BNB",
    block_explorer: "Eksplorator Bloków opBNB",
    enter_amount: "Wprowadź ilość (1–100) %",
    error_label: "Błąd",
    error_invalid_percent: "Procent musi być od 1 do 100!",
    error_no_metamask: "Zainstaluj MetaMask!",
    error_switch_network: "Nie można przełączyć sieci:",
    error_add_network: "Nie można dodać sieci opBNB:",
    error_connect_wallet: "Błąd połączenia z portfelem:",
    error_swap_bnb_to_0101: "Błąd przy zamianie (BNB → 0101):",
    error_swap_0101_to_bnb: "Błąd przy zamianie (0101 → BNB):",
    error_invalid_pair: "Nie można zamienić tego samego tokenu!",
    error_play_music: "Nie można odtworzyć muzyki:",
    error_insufficient_balance: "Niewystarczające saldo dla tej transakcji!",
    error_approval_failed: "Zatwierdzenie tokena nie powiodło się!",
    error_liquidity_failed: "Operacja płynności nie powiodła się!",
    copy_button: "Kopiuj",
    copied: "Skopiowano!"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.querySelector('.theme-toggle');
  const langToggleBtn = document.querySelector('.lang-toggle');
  const musicToggleBtn = document.querySelector('.music-toggle');
  const connectWalletBtn = document.getElementById('connect-wallet-btn');
  const switchNetworkBtn = document.getElementById('switch-network-btn');
  const swapTokensBtn = document.getElementById('swap-tokens-btn');
  const swapBtn = document.getElementById('swap-btn');
  const addLiquidityBtn = document.getElementById('add-liquidity-btn');
  const removeLiquidityBtn = document.getElementById('remove-liquidity-btn');

  themeToggleBtn.addEventListener('click', toggleTheme);
  langToggleBtn.addEventListener('click', toggleLanguage);
  musicToggleBtn.addEventListener('click', toggleMusic);
  connectWalletBtn.addEventListener('click', connectWallet);
  switchNetworkBtn.addEventListener('click', switchToOpBNB);
  swapTokensBtn.addEventListener('click', swapTokens);
  swapBtn.addEventListener('click', handleSwap);
  addLiquidityBtn.addEventListener('click', () => {
    const lpPercent = document.getElementById('lpPercent').value;
    if (lpPercent >= 1 && lpPercent <= 100) addLiquidity(lpPercent);
    else showError(translations[localStorage.language || "en"].error_invalid_percent);
  });
  removeLiquidityBtn.addEventListener('click', () => {
    const lpPercent = document.getElementById('lpPercent').value;
    if (lpPercent >= 1 && lpPercent <= 100) removeLiquidity(lpPercent);
    else showError(translations[localStorage.language || "en"].error_invalid_percent);
  });

  const th = localStorage.theme || "dark";
  document.documentElement.setAttribute("data-theme", th);
  const lang = localStorage.language || "en";
  updateTranslations(lang);
  const musicState = localStorage.music || "on";
  const audio = document.getElementById("background-music");
  document.querySelector(".theme-toggle").innerHTML = `<i class="fas fa-${th === "light" ? "sun" : "moon"}"></i> <span data-i18n="theme_${th}">${translations[lang][`theme_${th}`]}</span>`;
  document.querySelector(".lang-toggle").innerHTML = `<i class="fas fa-globe"></i> <span data-i18n="language">${translations[lang].language}</span>`;
  document.querySelector(".music-toggle").innerHTML = `<i class="fas fa-music"></i> <span data-i18n="music_${musicState}">${translations[lang][`music_${musicState}`]}</span>`;

  if (musicState === "on") audio.play().catch(err => showError(translations[lang].error_play_music + " " + err.message));
});

async function connectWallet() {
  if (!window.ethereum) return showError(translations[localStorage.language || "en"].error_no_metamask);

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();

    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentChainId !== opBNB.chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: opBNB.chainId }]
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [opBNB]
            });
          } catch (addError) {
            return showError(translations[localStorage.language || "en"].error_add_network + " " + addError.message);
          }
        } else if (switchError.code === -32002) {
          return showError("Network switch request already pending. Please check your wallet.");
        } else {
          return showError(translations[localStorage.language || "en"].error_switch_network + " " + switchError.message);
        }
      }
    }

    document.getElementById("wallet-address").textContent = account.slice(0, 6) + "..." + account.slice(-4);
    updateBalances();
  } catch (err) {
    showError(translations[localStorage.language || "en"].error_connect_wallet + " " + err.message);
  }
}

async function switchToOpBNB() {
  if (!window.ethereum) return showError(translations[localStorage.language || "en"].error_no_metamask);

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: opBNB.chainId }]
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [opBNB]
        });
      } catch (addError) {
        return showError(translations[localStorage.language || "en"].error_add_network + " " + addError.message);
      }
    } else {
      return showError(translations[localStorage.language || "en"].error_switch_network + " " + switchError.message);
    }
  }
}

async function updateBalances() {
  if (!provider || !account) return;

  try {
    const token0101 = new ethers.Contract(addr0101, ERC20, provider);
    const lpToken = new ethers.Contract(addrLP, ERC20, provider);

    const [balance0101, balanceBNB, balanceLP] = await Promise.all([
      token0101.balanceOf(account),
      provider.getBalance(account),
      lpToken.balanceOf(account)
    ]);

    document.getElementById("balance-0101").textContent = parseFloat(ethers.formatEther(balance0101)).toFixed(8);
    document.getElementById("balance-bnb").textContent = parseFloat(ethers.formatEther(balanceBNB)).toFixed(8);
    document.getElementById("balance-lp").textContent = parseFloat(ethers.formatEther(balanceLP)).toFixed(8);
  } catch (err) {
    console.error("Error updating balances:", err);
  }
}

async function calculateAutoSlippage() {
  return 0.5; // Przykładowa wartość, można dostosować
}

async function handleSwap() {
  if (!signer) return showError(translations[localStorage.language || "en"].error_connect_wallet);

  const fromToken = document.getElementById("fromToken").value;
  const toToken = document.getElementById("toToken").value;
  const percent = parseFloat(document.getElementById("swapPercent").value);
  const slippageSelect = document.getElementById("slippage");
  const slippage = slippageSelect ? slippageSelect.value : "auto";

  if (isNaN(percent) || percent < 1 || percent > 100) {
    return showError(translations[localStorage.language || "en"].error_invalid_percent);
  }
  if (fromToken === toToken) {
    return showError(translations[localStorage.language || "en"].error_invalid_pair);
  }

  const amountPercent = (percent / 100).toString();
  let amount;
  try {
    if (fromToken === "BNB") {
      const balanceBNB = await provider.getBalance(account);
      amount = balanceBNB * BigInt(Math.floor(percent)) / BigInt(100);
    } else {
      const token0101 = new ethers.Contract(addr0101, ERC20, provider);
      const balance0101 = await token0101.balanceOf(account);
      amount = balance0101 * BigInt(Math.floor(percent)) / BigInt(100);
    }

    if (amount <= 0) {
      return showError(translations[localStorage.language || "en"].error_insufficient_balance);
    }

    const slippagePercent = slippage === "auto" ? await calculateAutoSlippage() : parseFloat(slippage);
    const amountOutMin = amount * BigInt(Math.floor(1000 - slippagePercent * 10)) / BigInt(1000);

    if (fromToken === "BNB" && toToken === "0101") {
      await swapBNBto0101(amount, amountOutMin);
    } else if (fromToken === "0101" && toToken === "BNB") {
      await swap0101toBNB(amount, amountOutMin);
    }
  } catch (err) {
    showError((fromToken === "BNB" ? translations[localStorage.language || "en"].error_swap_bnb_to_0101 : translations[localStorage.language || "en"].error_swap_0101_to_bnb) + " " + err.message);
  }
}

async function swapBNBto0101(amount, amountOutMin) {
  const router = new ethers.Contract(routerAddr, ROUTER, signer);
  const path = [wbnbAddress, addr0101];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  try {
    const tx = await router.swapExactETHForTokens(amountOutMin, path, account, deadline, { value: amount });
    await tx.wait();
    updateBalances();
  } catch (err) {
    showError(translations[localStorage.language || "en"].error_swap_bnb_to_0101 + " " + err.message);
  }
}

async function swap0101toBNB(amount, amountOutMin) {
  const token0101 = new ethers.Contract(addr0101, ERC20, signer);
  const router = new ethers.Contract(routerAddr, ROUTER, signer);
  const path = [addr0101, wbnbAddress];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  try {
    const allowance = await token0101.allowance(account, routerAddr);
    if (allowance < amount) {
      const approveTx = await token0101.approve(routerAddr, amount);
      await approveTx.wait();
    }

    const tx = await router.swapExactTokensForETH(amount, amountOutMin, path, account, deadline);
    await tx.wait();
    updateBalances();
  } catch (err) {
    showError(translations[localStorage.language || "en"].error_swap_0101_to_bnb + " " + err.message);
  }
}

async function addLiquidity(percent) {
  if (!signer) return showError(translations[localStorage.language || "en"].error_connect_wallet);

  const token0101 = new ethers.Contract(addr0101, ERC20, signer);
  const router = new ethers.Contract(routerAddr, ROUTER, signer);
  const balanceBNB = await provider.getBalance(account);
  const balance0101 = await token0101.balanceOf(account);
  const amountBNB = balanceBNB * BigInt(Math.floor(percent)) / BigInt(100);
  const amount0101 = balance0101 * BigInt(Math.floor(percent)) / BigInt(100);
  const amountTokenMin = amount0101 * BigInt(95) / BigInt(100);
  const amountETHMin = amountBNB * BigInt(95) / BigInt(100);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  if (amountBNB <= 0 || amount0101 <= 0) {
    return showError(translations[localStorage.language || "en"].error_insufficient_balance);
  }

  try {
    const allowance = await token0101.allowance(account, routerAddr);
    if (allowance < amount0101) {
      const approveTx = await token0101.approve(routerAddr, amount0101);
      await approveTx.wait();
    }

    const tx = await router.addLiquidityETH(addr0101, amount0101, amountTokenMin, amountETHMin, account, deadline, { value: amountBNB });
    await tx.wait();
    updateBalances();
  } catch (err) {
    showError(translations[localStorage.language || "en"].error_liquidity_failed + " " + err.message);
  }
}

async function removeLiquidity(percent) {
  if (!signer) return showError(translations[localStorage.language || "en"].error_connect_wallet);

  const lpToken = new ethers.Contract(addrLP, ERC20, signer);
  const router = new ethers.Contract(routerAddr, ROUTER, signer);
  const balanceLP = await lpToken.balanceOf(account);
  const amount = balanceLP * BigInt(Math.floor(percent)) / BigInt(100);
  const amountTokenMin = amount * BigInt(95) / BigInt(100);
  const amountETHMin = amount * BigInt(95) / BigInt(100);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  if (amount <= 0) {
    return showError(translations[localStorage.language || "en"].error_insufficient_balance);
  }

  try {
    const allowance = await lpToken.allowance(account, routerAddr);
    if (allowance < amount) {
      const approveTx = await lpToken.approve(routerAddr, amount);
      await approveTx.wait();
    }

    const tx = await router.removeLiquidityETH(addr0101, amount, amountTokenMin, amountETHMin, account, deadline);
    await tx.wait();
    updateBalances();
  } catch (err) {
    showError(translations[localStorage.language || "en"].error_liquidity_failed + " " + err.message);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.theme = newTheme;
  document.querySelector(".theme-toggle").innerHTML = `<i class="fas fa-${newTheme === "light" ? "sun" : "moon"}"></i> <span data-i18n="theme_${newTheme}">${translations[localStorage.language || "en"][`theme_${newTheme}`]}</span>`;
}

function toggleLanguage() {
  const currentLang = localStorage.language === "en" ? "pl" : "en";
  localStorage.language = currentLang;
  updateTranslations(currentLang);
  document.querySelector(".lang-toggle").innerHTML = `<i class="fas fa-globe"></i> <span data-i18n="language">${translations[currentLang].language}</span>`;
}

function toggleMusic() {
  const audio = document.getElementById("background-music");
  const currentState = localStorage.music || "on";
  const newState = currentState === "on" ? "off" : "on";
  localStorage.music = newState;

  if (newState === "on") {
    audio.play().catch(err => showError(translations[localStorage.language || "en"].error_play_music + " " + err.message));
  } else {
    audio.pause();
  }

  document.querySelector(".music-toggle").innerHTML = `<i class="fas fa-music"></i> <span data-i18n="music_${newState}">${translations[localStorage.language || "en"][`music_${newState}`]}</span>`;
}

function swapTokens() {
  const fromToken = document.getElementById("fromToken");
  const toToken = document.getElementById("toToken");
  const temp = fromToken.value;
  fromToken.value = toToken.value;
  toToken.value = temp;
}

function showError(message) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.position = "fixed";
    toastContainer.style.top = "20px";
    toastContainer.style.right = "20px";
    toastContainer.style.zIndex = "9999";
    document.body.appendChild(toastContainer);
  }

  const lang = localStorage.language || "en";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.background = "var(--error-bg)";
  toast.style.color = "var(--error-text)";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.marginBottom = "10px";
  toast.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "10px";
  toast.innerHTML = `
    <strong data-i18n="error_label">${translations[lang].error_label}:</strong>
    <span class="toast-message">${message}</span>
    <button class="toast-copy" style="background:none;border:none;cursor:pointer;color:var(--text-color);">
      <i class="fas fa-copy"></i> <span data-i18n="copy_button">${translations[lang].copy_button}</span>
    </button>
    <button class="toast-close" style="background:none;border:none;cursor:pointer;color:var(--text-color);">
      <i class="fas fa-times"></i>
    </button>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  const timeout = setTimeout(() => removeToast(toast), 7000);

  toast.querySelector(".toast-copy").addEventListener("click", () => {
    navigator.clipboard.writeText(message).catch(err => console.error("Copy failed:", err));
    const copyButton = toast.querySelector(".toast-copy span");
    copyButton.innerHTML = translations[lang].copied;
    setTimeout(() => copyButton.innerHTML = translations[lang].copy_button, 2000);
  });

  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(timeout);
    removeToast(toast);
  });
}

function removeToast(toast) {
  toast.classList.remove("show");
  toast.classList.add("hide");
  setTimeout(() => toast.remove(), 300);
}

function updateTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    element.innerHTML = translations[lang][key] || element.innerHTML;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.getAttribute("data-i18n-placeholder");
    element.placeholder = translations[lang][key] || element.placeholder;
  });
}
