let provider, signer, account;
const addr0101 = "0xa41b3067ec694dbec668c389550ba8fc589e5797";
const addrLP = "0x506b8322e1159d06e493ebe7ffa41a24291e7ae3";
const routerAddr = "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b";
const masterAddr = "0x39a786421889EB581bd105508a0D2Dc03523B903";
const wbnbAddress = "0x4200000000000000000000000000000000000006";

const opBNB = {
  chainId: "0xcc",
  chainName: "opBNB",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18
  },
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
  "function addLiquidityETH(address,uint,uint,uint,address,uint) payable returns(uint,uint,uint)",
  "function removeLiquidityETH(address,uint,uint,uint,address,uint) returns(uint,uint)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)"
];

const MASTER = [
  "function poolLength() view returns(uint256)",
  "function userInfo(uint256,address) view returns(uint256,uint256)",
  "function pendingCub(uint256,address) view returns(uint256)",
  "function emergencyWithdraw(uint256)"
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
    transaction_history: "For transaction history, check <a href=\"https://debank.com/\" target=\"_blank\">DeBank.com</a>.",
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
    emergency: "MasterChef – Awaryjna wypłata LP, NFT itp:",
    step1: "Krok 1:",
    contract_instruction_1: "Wejdź na kontrakt:",
    contract_instruction_2: "Skopiuj adres kontraktu oraz zawartość pola Contract ABI.",
    step2: "Krok 2:",
    contract_instruction_3: "Otwórz w nowej zakładce strone:",
    smart_contract_interface: "Interfejs kontraktów inteligentnych",
    contract_instruction_4: "Przełącz sieć na opBNB i wklej dane w odpowiednie pola.",
    step3: "Krok 3:",
    contract_instruction_5: "Przejdź do pola emergencyWithdraw i wpisuj kolejno 0, 1, 2, 3, 4, 5 itd.",
    contract_instruction_6: "W zależności od tego, co stakujesz, Rabby Wallet wyświetli komunikat do podpisania, np. wypłata LP lub NFT.",
    contract_instruction_7: "Zatwierdź każdą transakcję, która pokazuje wypłatę z kontraktu i sprawdź ilość tokenów LP w DeBank lub powyżej.",
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
    block_explorer: "Eksplorator bloków opBNB",
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
    copy_button: "Kopiuj",
    copied: "Skopiowano!"
  }
};

async function handleSwap() {
  const pc = parseInt(document.getElementById("swapPercent").value);
  if (isNaN(pc) || pc < 1 || pc > 100) return showError(translations[localStorage.language || "en"].error_invalid_percent);

  const slippageSelect = document.getElementById("slippage").value;
  const deadline = Math.floor(Date.now() / 1000) + 300;
  const fromToken = document.getElementById("fromToken").value;
  const toToken = document.getElementById("toToken").value;

  if (fromToken === toToken) {
    return showError(translations[localStorage.language || "en"].error_invalid_pair);
  }

  let slippage;
  if (slippageSelect === "auto") {
    slippage = await calculateAutoSlippage(fromToken, toToken, pc);
  } else {
    slippage = parseFloat(slippageSelect);
  }

  if (fromToken === "BNB" && toToken === "0101") {
    await swapBNBto0101(pc, slippage, deadline);
  } else if (fromToken === "0101" && toToken === "BNB") {
    await swap0101toBNB(pc, slippage, deadline);
  }
}

async function calculateAutoSlippage(fromToken, toToken, pc) {
  const router = new ethers.Contract(routerAddr, ROUTER, signer);
  let amountIn, path;
  if (fromToken === "BNB") {
    const balance = await provider.getBalance(account);
    amountIn = balance * BigInt(pc) / 100n;
    path = [wbnbAddress, addr0101];
  } else {
    const token = new ethers.Contract(addr0101, ERC20, signer);
    const balance = await token.balanceOf(account);
    amountIn = balance * BigInt(pc) / 100n;
    path = [addr0101, wbnbAddress];
  }
  try {
    const amounts = await router.getAmountsOut(amountIn, path);
    const priceImpact = 0.1; // Assume 0.1% as minimum safe slippage for auto mode
    return priceImpact;
  } catch (error) {
    console.error("Error calculating auto slippage:", error);
    return 0.5; // Fallback to 0.5% if calculation fails
  }
}

async function swapBNBto0101(pc, slippage, deadline) {
  const router = new ethers.Contract(routerAddr, ROUTER, signer);
  const balance = await provider.getBalance(account);
  const amountIn = balance * BigInt(pc) / 100n;

  try {
    const path = [wbnbAddress, addr0101];
    const amounts = await router.getAmountsOut(amountIn, path);
    const amountOutMin = amounts[1] * BigInt(Math.floor(1000 - slippage * 10)) / 1000n;

    const tx = await router.swapExactETHForTokens(
      amountOutMin,
      path,
      account,
      deadline,
      { value: amountIn }
    );
    await tx.wait();
    updateBalances();
  } catch (error) {
    showError(translations[localStorage.language || "en"].error_swap_bnb_to_0101 + " " + error.message);
  }
}

async function swap0101toBNB(pc, slippage, deadline) {
  const token = new ethers.Contract(addr0101, ERC20, signer);
  const router = new ethers.Contract(routerAddr, ROUTER, signer);
  const balance = await token.balanceOf(account);
  const amountIn = balance * BigInt(pc) / 100n;

  try {
    const path = [addr0101, wbnbAddress];
    const amounts = await router.getAmountsOut(amountIn, path);
    const amountOutMin = amounts[1] * BigInt(Math.floor(1000 - slippage * 10)) / 1000n;

    const allowance = await token.allowance(account, routerAddr);
    if (allowance < amountIn) {
      await token.approve(routerAddr, amountIn);
    }

    const tx = await router.swapExactTokensForETH(
      amountIn,
      amountOutMin,
      path,
      account,
      deadline
    );
    await tx.wait();
    updateBalances();
  } catch (error) {
    showError(translations[localStorage.language || "en"].error_swap_0101_to_bnb + " " + error.message);
  }
}

async function addLiquidity(pc) {
  const t = new ethers.Contract(addr0101, ERC20, signer);
  const r = new ethers.Contract(routerAddr, ROUTER, signer);
  const bB = await provider.getBalance(account), bT = await t.balanceOf(account);
  const vB = bB * BigInt(pc) / 100n, vT = bT * BigInt(pc) / 100n;
  await t.approve(routerAddr, vT);
  await r.addLiquidityETH(addr0101, vT, 0, 0, account, Math.floor(Date.now() / 1e3) + 300, { value: vB });
  updateBalances();
}

async function removeLiquidity(pc) {
  const l = new ethers.Contract(addrLP, ERC20, signer);
  const r = new ethers.Contract(routerAddr, ROUTER, signer);
  const bal = await l.balanceOf(account);
  const v = bal * BigInt(pc) / 100n;
  await l.approve(routerAddr, v);
  await r.removeLiquidityETH(addr0101, v, 0, 0, account, Math.floor(Date.now() / 1e3) + 300);
  updateBalances();
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

async function connectWallet() {
  if (!window.ethereum) return showError(translations[localStorage.language || "en"].error_no_metamask);

  try {
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
        } else {
          return showError(translations[localStorage.language || "en"].error_switch_network + " " + switchError.message);
        }
      }
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();
    document.getElementById("wallet-address").textContent = account.slice(0, 6) + "..." + account.slice(-4);
    updateBalances();
  } catch (err) {
    showError(translations[localStorage.language || "en"].error_connect_wallet + " " + err.message);
  }
}

async function updateBalances() {
  if (!signer) return;
  const t = new ethers.Contract(addr0101, ERC20, provider);
  const l = new ethers.Contract(addrLP, ERC20, provider);
  const [b0101, bLP, bBNB] = await Promise.all([
    t.balanceOf(account),
    l.balanceOf(account),
    provider.getBalance(account)
  ]);
  document.getElementById("balance-0101").textContent = parseFloat(ethers.formatUnits(b0101, 18)).toFixed(8);
  document.getElementById("balance-bnb").textContent = parseFloat(ethers.formatUnits(bBNB, 18)).toFixed(8);
  document.getElementById("balance-lp").textContent = parseFloat(ethers.formatUnits(bLP, 18)).toFixed(8);
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
  document.querySelector(".music-toggle").innerHTML = `<i class="fas fa-music"></i> <span data-i18n="music_${localStorage.music === "on" ? "on" : "off"}">${translations[newLang][`music_${localStorage.music === "on" ? "on" : "off"}`]}</span>`;
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

function toggleMusic() {
  const audio = document.getElementById("background-music");
  const isPlaying = !audio.paused;
  const lang = localStorage.language || "en";
  if (isPlaying) {
    audio.pause();
    localStorage.music = "off";
    document.querySelector(".music-toggle").innerHTML = `<i class="fas fa-music"></i> <span data-i18n="music_off">${translations[lang].music_off}</span>`;
  } else {
    audio.play().catch(err => showError(translations[lang].error_play_music + " " + err.message));
    localStorage.music = "on";
    document.querySelector(".music-toggle").innerHTML = `<i class="fas fa-music"></i> <span data-i18n="music_on">${translations[lang].music_on}</span>`;
  }
}

function swapTokens() {
  const fromToken = document.getElementById("fromToken");
  const toToken = document.getElementById("toToken");
  const temp = fromToken.value;
  fromToken.value = toToken.value;
  toToken.value = temp;
  fromToken.dispatchEvent(new Event('change'));
  console.log("Swapped: ", fromToken.value, "→", toToken.value);
}

function showError(message) {
  const toastContainer = document.getElementById("toast-container") || createToastContainer();
  const lang = localStorage.language || "en";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <strong data-i18n="error_label">${translations[lang].error_label}:</strong>
    <span class="toast-message">${message}</span>
    <button class="toast-copy"><i class="fas fa-copy"></i> <span data-i18n="copy_button">${translations[lang].copy_button}</span></button>
    <button class="toast-close"><i class="fas fa-times"></i></button>
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

(() => {
  const th = localStorage.theme || "dark";
  document.documentElement.setAttribute("data-theme", th);
  
  const lang = localStorage.language || "en";
  updateTranslations(lang);
  
  const musicState = localStorage.music || "on";
  const audio = document.getElementById("background-music");
  document.querySelector(".theme-toggle").innerHTML = `<i class="fas fa-${th === "light" ? "sun" : "moon"}"></i> <span data-i18n="theme_${th}">${translations[lang][`theme_${th}`]}</span>`;
  document.querySelector(".lang-toggle").innerHTML = `<i class="fas fa-globe"></i> <span data-i18n="language">${translations[lang].language}</span>`;
  document.querySelector(".music-toggle").innerHTML = `<i class="fas fa-music"></i> <span data-i18n="music_${musicState}">${translations[lang][`music_${musicState}`]}</span>`;
  
  if (musicState === "on") {
    audio.play().catch(err => console.log("Autoplay blocked: ", err.message));
  }
})();
