Dobra, przejrzałem dokładnie Twój oryginalny plik i to, co przesłałem — faktycznie uciąłem się na końcu przy sekcji WALLET (początek `switchToOpBNB` i dalej).

Pełna zawartość pliku **powinna zawierać wszystkie Twoje funkcje**, w tym:

* Wallet (connectWallet, switchToOpBNB)
* updateBalances
* toggleTheme
* showError

---

### Teraz pełny, poprawiony i kompletny `app.js` z Twojego oryginału + poprawkami:

```js
// === Web3 Config ===
let provider, signer, account;
const addr0101 = "0xa41b3067ec694dbec668c389550ba8fc589e5797";
const addrLP = "0x506b8322e1159d06e493ebe7ffa41a24291e7ae3";
const routerAddr = "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b";
const masterAddr = "0x39a786421889EB581bd105508a0D2Dc03523B903";
const wbnbAddress = "0x4200000000000000000000000000000000000006";

// === MasterChef Setup ===
const pidLP = 0;
const masterLPABI = [
  "function deposit(uint256 _pid, uint256 _amount) external",
  "function withdraw(uint256 _pid, uint256 _amount) external",
  "function userInfo(uint256,address) view returns (uint256 amount, uint256 rewardDebt)"
];

// === Chain Info ===
const opBNB = {
  chainId: "0xcc",
  chainName: "opBNB",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org/"],
  blockExplorerUrls: ["https://mainnet.opbnbscan.com/"]
};

// === ABI Definitions ===
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

// === SWAP HANDLER ===
async function handleSwap(){
  const pc = parseInt(swapPercent.value);
  if(isNaN(pc) || pc < 1 || pc > 100) return showError("Procent 1–100!");

  const slippage = parseInt(swapSlippage.value) || 1;
  const deadline = Math.floor(Date.now()/1000) + 300;

  if (swapDirection.value === "toToken") {
    await swapBNBto0101(pc, slippage, deadline);
  } else {
    await swap0101toBNB(pc, slippage, deadline);
  }
}

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
    await updateBalances();
  } catch (error) {
    showError("Błąd przy swapie (BNB → 0101): " + error.message);
  }
}

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
    await updateBalances();
  } catch (error) {
    showError("Błąd przy swapie (0101 → BNB): " + error.message);
  }
}

// === LIQUIDITY ===
async function addLiquidity(pc){
  const t = new ethers.Contract(addr0101, ERC20, signer);
  const r = new ethers.Contract(routerAddr, ROUTER, signer);
  const bB = await provider.getBalance(account);
  const bT = await t.balanceOf(account);
  const vB = bB * BigInt(pc) / 100n;
  const vT = bT * BigInt(pc) / 100n;

  try {
    await t.approve(routerAddr, vT);
    const tx = await r.addLiquidityETH(addr0101, vT, 0, 0, account, Math.floor(Date.now()/1e3)+300, {value: vB});
    await tx.wait();
    await updateBalances();
  } catch (err) {
    showError("Błąd przy dodawaniu płynności: " + err.message);
  }
}

async function removeLiquidity(pc){
  const l = new ethers.Contract(addrLP, ERC20, signer);
  const r = new ethers.Contract(routerAddr, ROUTER, signer);
  const bal = await l.balanceOf(account);
  const v = bal * BigInt(pc) / 100n;

  try {
    await l.approve(routerAddr, v);
    const tx = await r.removeLiquidityETH(addr0101, v, 0, 0, account, Math.floor(Date.now()/1e3)+300);
    await tx.wait();
    await updateBalances();
  } catch (err) {
    showError("Błąd przy usuwaniu płynności: " + err.message);
  }
}

// === STAKING MASTER ===
async function stakeLP(pc){
  const lp = new ethers.Contract(addrLP, ERC20, signer);
  const master = new ethers.Contract(masterAddr, masterLPABI, signer);
  const balance = await lp.balanceOf(account);
  const amount = balance * BigInt(pc) / 100n;

  try {
    const allowance = await lp.allowance(account, masterAddr);
    if (allowance < amount) {
      await lp.approve(masterAddr, amount);
    }
    const tx = await master.deposit(pidLP, amount);
    await tx.wait();
    await updateBalances();
  } catch (err) {
    showError("Błąd przy stake LP: " + err.message);
  }
}

async function unstakeLP(pc){
  const master = new ethers.Contract(masterAddr, masterLPABI, signer);
  const lpInfo = await master.userInfo(pidLP, account);
  const staked = lpInfo.amount;
  const amount = staked * BigInt(pc) / 100n;

  try {
    const tx = await master.withdraw(pidLP, amount);
    await tx.wait();
    await updateBalances();
  } catch (err) {
    showError("Błąd przy unstake LP: " + err.message);
  }
}

async function harvest() {
  const master = new ethers.Contract(masterAddr, masterLPABI, signer);
  try {
    const tx = await master.deposit(pidLP, 0);
    await tx.wait();
    await updateBalances();
  } catch (err) {
    showError("Błąd przy odbieraniu nagrody: " + err.message);
  }
}

// === WALLET ===
async function switchToOpBNB() {
  if (!window.ethereum) return showError("Zainstaluj MetaMask!");

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
        return showError("Nie można dodać sieci opBNB: " + addError.message);
      }
    } else {
      return showError("Nie można przełączyć sieci: " + switchError.message);
    }
  }
}

async function connectWallet(){
  if (!window.ethereum) return showError("Zainstaluj MetaMask!");

  try {
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentChainId !== opBNB.chainId) {
      await switchToOpBNB();
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();
    document.getElementById("wallet-address").innerText = account;
    await updateBalances();
  } catch (err) {
    showError("Błąd połączenia z portfelem: " + err.message);
  }
}

// === BALANCES ===
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

// === THEME TOGGLE ===
function toggleTheme(){
  const html = document.documentElement;
  const light = html.getAttribute("data-theme")==="light";
  html.setAttribute("data-theme", light?"":"light");
  document.querySelector(".theme-toggle").innerText = light?"🌞 Tryb jasny":"🌙 Tryb ciemny";
  localStorage.theme = light?"":"light";
}
(() => {
  const th = localStorage.theme;
  document.documentElement.setAttribute("data-theme", th || "");
  document.querySelector(".theme-toggle").innerText = th?"🌙 Tryb ciemny":"🌞 Tryb jasny";
})();

// === ERROR HANDLER ===
function showError(message) {
  const errorContainer = document.getElementById('error-container');
  const errorText = document.getElementById('error-text');
  errorText.textContent = message;
  errorContainer.style.display = 'block';
}
