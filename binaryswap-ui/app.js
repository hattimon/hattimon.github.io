// === Web3 Config ===
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

// === Translations ===
const translations = {
  pl: {
    theme_light: "Tryb jasny",
    theme_dark: "Tryb ciemny",
    language: "Polski",
    music_on: "Music: On",
    music_off: "Music: Off",
    audio_not_supported: "Twoja przeglądarka nie obsługuje elementu audio.",
    documentation: "Dokumentacja",
    pair_rate: "Kurs 0101/WBNB",
    fast_bridge: "Szybki Most opBNB ⇄ FDUSD",
    official_bridge: "Oficjalny Most opBNB ⇄ BNB (7 dni)",
    emergency_mode: "Tryb Awaryjny",
    interaction_info: "(<b>Klikając SWAP lub Dodaj/Usuń LP</b> wymaga to kilku kolejnych kliknięć w celu zatwierdzenia interakcji z kontraktem na podaną sumę – zatwierdzenie np. kontraktu Swap i potwierdzenie Swap)",
    gui_info: "Jest to bezpieczne (SSL) zastępcze GUI korzystające z oryginalnych funkcji kontraktów.",
    wallet_recommendation: "Polecam portfel Rabby.io gdzie również cofniesz uprawnienia.",
    transaction_history: "Do podglądu historii transakcji polecam DeBank.com.",
    wallet_label: "Portfel",
    wallet_not_connected: "Niepołączony",
    connect_wallet: "Połącz/Odświerz Portfel",
    switch_network: "Przełącz na opBNB",
    wallet_content: "Zawartość Portfela",
    swap_title: "Swap",
    swap_direction: "Zamiana",
    slippage: "Poślizg",
    swap_button: "Swap",
    liquidity_pool: "Pula Płynności",
    add_lp: "Dodaj LP",
    remove_lp: "Usuń LP",
    emergency_withdrawal: "Awaryjna wypłata LP, NFT itp:",
    contract_instruction_1: "Krok 1: Wejdź na kontrakt:",
    contract_instruction_2: "Skopiuj adres kontraktu oraz zawartość pola Contract ABI.",
    contract_instruction_3: "Krok 2: Otwórz w nowej zakładce stronę:",
    smart_contracts_interface: "Interfejs kontraktów inteligentnych",
    contract_instruction_4: "Przełącz sieć na opBNB i wklej dane w odpowiednie pola.",
    contract_instruction_5: "Krok 3: Przejdź do pola emergencyWithdraw i wpisuj kolejno 0, 1, 2, 3, 4, 5 itd.",
    contract_instruction_6: "W zależności od tego, co stakujesz, podczas zatwierdzania transakcji Rabby Wallet wyświetli komunikat do podpisania, np. wypłata LP lub NFT.",
    contract_instruction_7: "Zatwierdź każdą transakcję, która pokazuje wypłatę z kontraktu i sprawdź ilość tokenów LP w DeBank lub powyżej (reszta powyżej 😊).",
    error_label: "Błąd",
    error_invalid_percent: "Procent 1–100!",
    error_no_metamask: "Zainstaluj MetaMask!",
    error_switch_network: "Nie można przełączyć sieci:",
    error_add_network: "Nie można dodać sieci opBNB:",
    error_connect_wallet: "Błąd połączenia z portfelem:",
    error_swap_bnb_to_0101: "Błąd przy swapie (BNB → 0101):",
    error_swap_0101_to_bnb: "Błąd przy swapie (0101 → BNB):",
    error_play_music: "Nie można odtworzyć muzyki:"
  },
  en: {
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
    language: "English",
    music_on: "Music: On",
    music_off: "Music: Off",
    audio_not_supported: "Your browser does not support the audio element.",
    documentation: "Documentation",
    pair_rate: "0101/WBNB Rate",
    fast_bridge: "Fast Bridge opBNB ⇄ FDUSD",
    official_bridge: "Official Bridge opBNB ⇄ BNB (7 days)",
    emergency_mode: "Emergency Mode",
    interaction_info: "(<b>Clicking SWAP or Add/Remove LP</b> requires several consecutive clicks to approve contract interactions for the specified amount – e.g., approve the Swap contract and confirm the Swap)",
    gui_info: "This is a secure (SSL) substitute GUI using the original functions of BinarySwap contracts.",
    wallet_recommendation: "I recommend the Rabby.io wallet where you can also revoke permissions.",
    transaction_history: "For transaction history, I recommend DeBank.com.",
    wallet_label: "Wallet",
    wallet_not_connected: "Not Connected",
    connect_wallet: "Connect/Refresh Wallet",
    switch_network: "Switch to opBNB",
    wallet_content: "Wallet Contents",
    swap_title: "Swap",
    swap_direction: "Swap Direction",
    slippage: "Slippage",
    swap_button: "Swap",
    liquidity_pool: "Liquidity Pool",
    add_lp: "Add LP",
    remove_lp: "Remove LP",
    emergency_withdrawal: "Emergency Withdrawal of LP, NFT, etc.:",
    contract_instruction_1: "Step 1: Visit the contract:",
    contract_instruction_2: "Copy the Contract Address and the Contract ABI field.",
    contract_instruction_3: "Step 2: Open in a new tab the page:",
    smart_contracts_interface: "Smart Contracts Interface",
    contract_instruction_4: "Switch to opBNB network and paste the data into the respective fields.",
    contract_instruction_5: "Step 3: Go to the emergencyWithdraw field and enter 0, 1, 2, 3, 4, 5, etc. sequentially.",
    contract_instruction_6: "Depending on what you staked, during transaction confirmation, Rabby Wallet will show a signing message, e.g., LP or NFT withdrawal.",
    contract_instruction_7: "Approve each transaction showing a withdrawal from the contract and check the LP token amount in DeBank or above (the rest above 😊).",
    error_label: "Error",
    error_invalid_percent: "Percentage 1–100!",
    error_no_metamask: "Install MetaMask!",
    error_switch_network: "Cannot switch network:",
    error_add_network: "Cannot add opBNB network:",
    error_connect_wallet: "Wallet connection error:",
    error_swap_bnb_to_0101: "Error during swap (BNB → 0101):",
    error_swap_0101_to_bnb: "Error during swap (0101 → BNB):",
    error_play_music: "Cannot play music:"
  }
};

// === Swap Handler ===
async function handleSwap(){
  const pc = parseInt(swapPercent.value);
  if(isNaN(pc) || pc < 1 || pc > 100) return showError(translations[localStorage.language || "pl"].error_invalid_percent);

  const slippage = parseInt(swapSlippage.value) || 1;
  const deadline = Math.floor(Date.now()/1000) + 300;

  if (swapDirection.value === "toToken" && swapToken2.value === "0101") {
    swapBNBto0101(pc, slippage, deadline);
  } else if (swapDirection.value === "toBNB" && swapToken2.value === "BNB") {
    swap0101toBNB(pc, slippage, deadline);
  } else {
    showError("Invalid token pair selection.");
  }
}

// === Swap: BNB → 0101 ===
async function swapBNBto0101(pc, slippage, deadline){
  const router = new ethers.Contract(routerAddr, ROUTER, signer);
  const balance = await provider.getBalance(account);
  const amountIn = balance * BigInt(pc) / 100n;

  try {
    const path = [wbnbAddress, addr0101];
    const amounts = await router.getAmountsOut(amountIn, path);
    const amountOutMin = amounts[1] * BigInt(100 - slippage) / 100n;

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
    showError(translations[localStorage.language || "pl"].error_swap_bnb_to_0101 + " " + error.message);
  }
}

// === Swap: 0101 → BNB ===
async function swap0101toBNB(pc, slippage, deadline){
  const token = new ethers.Contract(addr0101, ERC20, signer);
  const router = new ethers.Contract(routerAddr, ROUTER, signer);
  const balance = await token.balanceOf(account);
  const amountIn = balance * BigInt(pc) / 100n;

  try {
    const path = [addr0101, wbnbAddress];
    const amounts = await router.getAmountsOut(amountIn, path);
    const amountOutMin = amounts[1] * BigInt(100 - slippage) / 100n;

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
    showError(translations[localStorage.language || "pl"].error_swap_0101_to_bnb + " " + error.message);
  }
}

// === LP Functions ===
async function addLiquidity(pc){
  const t = new ethers.Contract(addr0101, ERC20, signer);
  const r = new ethers.Contract(routerAddr, ROUTER, signer);
  const bB = await provider.getBalance(account), bT = await t.balanceOf(account);
  const vB = bB * BigInt(pc) / 100n, vT = bT * BigInt(pc) / 100n;
  await t.approve(routerAddr, vT);
  await r.addLiquidityETH(addr0101, vT, 0, 0, account, Math.floor(Date.now()/1e3)+300, {value: vB});
  updateBalances();
}

async function removeLiquidity(pc){
  const l = new ethers.Contract(addrLP, ERC20, signer);
  const r = new ethers.Contract(routerAddr, ROUTER, signer);
  const bal = await l.balanceOf(account);
  const v = bal * BigInt(pc) / 100n;
  await l.approve(routerAddr, v);
  await r.removeLiquidityETH(addr0101, v, 0, 0, account, Math.floor(Date.now()/1e3)+300);
  updateBalances();
}

// === Wallet Functions ===
async function switchToOpBNB() {
  if (!window.ethereum) return showError(translations[localStorage.language || "pl"].error_no_metamask);

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
        return showError(translations[localStorage.language || "pl"].error_add_network + " " + addError.message);
      }
    } else {
      return showError(translations[localStorage.language || "pl"].error_switch_network + " " + switchError.message);
    }
  }
}

async function connectWallet(){
  if (!window.ethereum) return showError(translations[localStorage.language || "pl"].error_no_metamask);

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
            return showError(translations[localStorage.language || "pl"].error_add_network + " " + addError.message);
          }
        } else {
          return showError(translations[localStorage.language || "pl"].error_switch_network + " " + switchError.message);
        }
      }
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();
    document.getElementById("wallet-address").innerText = account;
    updateBalances();
  } catch (err) {
    showError(translations[localStorage.language || "pl"].error_connect_wallet + " " + err.message);
  }
}

async function updateBalances(){
  const t = new ethers.Contract(addr0101, ERC20, provider);
  const l = new ethers.Contract(addrLP, ERC20, provider);
  const [b0101, bLP, bBNB] = await Promise.all([
    t.balanceOf(account),
    l.balanceOf(account),
    provider.getBalance(account)
  ]);
  document.getElementById("balance-0101").innerText = parseFloat(ethers.formatUnits(b0101,18)).toFixed(8);
  document.getElementById("balance-bnb").innerText = parseFloat(ethers.formatUnits(bBNB,18)).toFixed(8);
  document.getElementById("balance-lp").innerText = parseFloat(ethers.formatUnits(bLP,18)).toFixed(8);
}

// === Theme Toggle ===
function toggleTheme(){
  const html = document.documentElement;
  const isLight = html.getAttribute("data-theme") === "light";
  const newTheme = isLight ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  localStorage.theme = newTheme;
  const lang = localStorage.language || "pl";
  document.querySelector(".theme-toggle").innerHTML = newTheme === "light" ? 
    `🌞 <span data-i18n="theme_light">${translations[lang].theme_light}</span>` : 
    `🌙 <span data-i18n="theme_dark">${translations[lang].theme_dark}</span>`;
}

// === Language Toggle ===
function toggleLanguage(){
  const newLang = localStorage.language === "pl" ? "en" : "pl";
  localStorage.language = newLang;
  updateTranslations(newLang);
  document.querySelector(".lang-toggle").innerHTML = `🌐 <span data-i18n="language">${translations[newLang].language}</span>`;
  document.querySelector(".theme-toggle").innerHTML = localStorage.theme === "light" ? 
    `🌞 <span data-i18n="theme_light">${translations[newLang].theme_light}</span>` : 
    `🌙 <span data-i18n="theme_dark">${translations[newLang].theme_dark}</span>`;
  document.querySelector(".music-toggle").innerHTML = localStorage.music === "on" ? 
    `🎵 <span data-i18n="music_on">${translations[newLang].music_on}</span>` : 
    `🎵 <span data-i18n="music_off">${translations[newLang].music_off}</span>`;
}

// === Update Translations ===
function updateTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    element.innerText = translations[lang][key];
  });
}

// === Music Toggle ===
function toggleMusic(){
  const audio = document.getElementById("background-music");
  const isPlaying = !audio.paused;
  const lang = localStorage.language || "pl";
  if (isPlaying) {
    audio.pause();
    localStorage.music = "off";
    document.querySelector(".music-toggle").innerHTML = `🎵 <span data-i18n="music_off">${translations[lang].music_off}</span>`;
  } else {
    audio.play().catch(err => showError(translations[lang].error_play_music + " " + err.message));
    localStorage.music = "on";
    document.querySelector(".music-toggle").innerHTML = `🎵 <span data-i18n="music_on">${translations[lang].music_on}</span>`;
  }
}

// === Swap Tokens ===
function swapTokens() {
  const swapDirection = document.getElementById("swapDirection");
  const swapToken2 = document.getElementById("swapToken2");
  const temp = swapDirection.value;
  swapDirection.value = swapToken2.value === "0101" ? "toBNB" : "toToken";
  swapToken2.value = temp === "toToken" ? "0101" : "BNB";
}

// === Error Handling ===
function showError(message) {
  const errorContainer = document.getElementById('error-container');
  const errorText = document.getElementById('error-text');
  errorText.textContent = message;
  errorContainer.style.display = 'block';
}

// === Initialization ===
(() => {
  const th = localStorage.theme || "light";
  document.documentElement.setAttribute("data-theme", th);
  
  const lang = localStorage.language || "pl";
  updateTranslations(lang);
  
  const musicState = localStorage.music || "on";
  const audio = document.getElementById("background-music");
  document.querySelector(".theme-toggle").innerHTML = th === "light" ? 
    `🌞 <span data-i18n="theme_light">${translations[lang].theme_light}</span>` : 
    `🌙 <span data-i18n="theme_dark">${translations[lang].theme_dark}</span>`;
  document.querySelector(".lang-toggle").innerHTML = `🌐 <span data-i18n="language">${translations[lang].language}</span>`;
  document.querySelector(".music-toggle").innerHTML = musicState === "on" ? 
    `🎵 <span data-i18n="music_on">${translations[lang].music_on}</span>` : 
    `🎵 <span data-i18n="music_off">${translations[lang].music_off}</span>`;
  
  if (musicState === "on") {
    audio.play().catch(err => console.log("Autoodtwarzanie zablokowane: ", err.message));
  }

  // Initialize swap token selection
  const swapDirection = document.getElementById("swapDirection");
  const swapToken2 = document.getElementById("swapToken2");
  swapToken2.value = swapDirection.value === "toToken" ? "0101" : "BNB";
  swapDirection.addEventListener("change", () => {
    swapToken2.value = swapDirection.value === "toToken" ? "0101" : "BNB";
  });
})();
