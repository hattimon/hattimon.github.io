Jasne! Poniżej masz cały zmodyfikowany plik **app.js** z dodaną obsługą MasterChef (stake/unstake/approve) według twojego index.html.

---

### Stwórz plik **app.js** i wklej do niego poniższy kod:

```js
// === Web3 Config ===
let provider, signer, account;
const addr0101 = "0xa41b3067ec694dbec668c389550ba8fc589e5797";
const addrLP = "0x506b8322e1159d06e493ebe7ffa41a24291e7ae3";
const routerAddr = "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b";
const masterAddr = "0x39a786421889EB581bd105508a0D2Dc03523B903";
const wbnbAddress = "0x4200000000000000000000000000000000000006";

const opBNB = {
  chainId: "0xcc", // 204 dec
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
  "function removeLiquidityETH(address,uint,uint,uint,address,uint) returns(uint,uint,uint)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)"
];

const MASTER = [
  "function poolLength() view returns(uint256)",
  "function userInfo(uint256,address) view returns(uint256 amount,uint256 rewardDebt)",
  "function pendingCub(uint256,address) view returns(uint256)",
  "function deposit(uint256,uint256)",
  "function withdraw(uint256,uint256)",
  "function emergencyWithdraw(uint256)",
  "function poolInfo(uint256) view returns(address lpToken,uint256 allocPoint,uint256 lastRewardBlock,uint256 accCubPerShare)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)"
];

// === Swap Handler ===
async function handleSwap(){
  const pc = parseInt(document.getElementById('swapPercent').value);
  if(isNaN(pc) || pc < 1 || pc > 100) return showError("Procent 1–100!");

  const slippage = parseInt(document.getElementById('swapSlippage').value) || 1;
  const deadline = Math.floor(Date.now()/1000) + 300;

  if (document.getElementById('swapDirection').value === "toToken") {
    await swapBNBto0101(pc, slippage, deadline);
  } else {
    await swap0101toBNB(pc, slippage, deadline);
  }
}

// === Swap: BNB → 0101 ===
async function swapBNBto0101(pc, slippage, deadline){
  try {
    const router = new ethers.Contract(routerAddr, ROUTER, signer);
    const balance = await provider.getBalance(account);
    const amountIn = balance * BigInt(pc) / 100n;

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

// === Swap: 0101 → BNB ===
async function swap0101toBNB(pc, slippage, deadline){
  try {
    const token = new ethers.Contract(addr0101, ERC20, signer);
    const router = new ethers.Contract(routerAddr, ROUTER, signer);
    const balance = await token.balanceOf(account);
    const amountIn = balance * BigInt(pc) / 100n;

    const path = [addr0101, wbnbAddress];
    const amounts = await router.getAmountsOut(amountIn, path);
    const amountOutMin = amounts[1] * BigInt(100 - slippage) / 100n;

    const allowance = await token.allowance(account, routerAddr);
    if (allowance < amountIn) {
      const approveTx = await token.approve(routerAddr, amountIn);
      await approveTx.wait();
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

// === LP Functions ===
async function addLiquidity(pc){
  try {
    const t = new ethers.Contract(addr0101, ERC20, signer);
    const r = new ethers.Contract(routerAddr, ROUTER, signer);
    const bB = await provider.getBalance(account);
    const bT = await t.balanceOf(account);
    const vB = bB * BigInt(pc) / 100n;
    const vT = bT * BigInt(pc) / 100n;

    const approveTx = await t.approve(routerAddr, vT);
    await approveTx.wait();

    const tx = await r.addLiquidityETH(addr0101, vT, 0, 0, account, Math.floor(Date.now()/1000)+300, {value: vB});
    await tx.wait();
    await updateBalances();
  } catch (e) {
    showError("Błąd przy dodawaniu płynności: " + e.message);
  }
}

async function removeLiquidity(pc){
  try {
    const l = new ethers.Contract(addrLP, ERC20, signer);
    const r = new ethers.Contract(routerAddr, ROUTER, signer);
    const bal = await l.balanceOf(account);
    const v = bal * BigInt(pc) / 100n;

    const approveTx = await l.approve(routerAddr, v);
    await approveTx.wait();

    const tx = await r.removeLiquidityETH(addr0101, v, 0, 0, account, Math.floor(Date.now()/1000)+300);
    await tx.wait();
    await updateBalances();
  } catch (e) {
    showError("Błąd przy usuwaniu płynności: " + e.message);
  }
}

// === Wallet Functions ===
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

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();
    document.getElementById("wallet-address").innerText = account;

    await updateBalances();
    await fetchLPInfo();

  } catch (err) {
    showError("Błąd połączenia z portfelem: " + err.message);
  }
}

async function updateBalances(){
  if (!account) return;
  try {
    const t = new ethers.Contract(addr0101, ERC20, provider);
    const l = new ethers.Contract(addrLP, ERC20, provider);

    const [b0101, bBnb, bLp] = await Promise.all([
      t.balanceOf(account),
      provider.getBalance(account),
      l.balanceOf(account)
    ]);

    document.getElementById("balance-0101").innerText = ethers.formatUnits(b0101, 18);
    document.getElementById("balance-bnb").innerText = ethers.formatUnits(bBnb, 18);
    document.getElementById("balance-lp").innerText = ethers.formatUnits(bLp, 18);

  } catch(e){
    showError("Błąd przy pobieraniu sald: " + e.message);
  }
}

// === MASTER CHEF (STAKE) ===

const poolId = 0; // domyślnie pierwszy pool (możesz zmienić)
let masterChef;

async function fetchLPInfo(){
  if (!account) return;
  try {
    masterChef = new ethers.Contract(masterAddr, MASTER, signer);

    // Pobierz userInfo poolId
    const userInfo = await masterChef.userInfo(poolId, account);
    const pending = await masterChef.pendingCub(poolId, account);

    const l = new ethers.Contract(addrLP, ERC20, provider);
    const lpBalance = await l.balanceOf(account);
    const allowance = await l.allowance(account, masterAddr);

    // Wyświetl w UI
    document.getElementById("pending-cub").innerText = ethers.formatUnits(pending, 18);
    document.getElementById("user-staked").innerText = ethers.formatUnits(userInfo.amount, 18);
    // MasterChef prawdopodobnie nie zwraca fee bezpośrednio — możesz zostawić '-'
    document.getElementById("user-deposit-fee").innerText = "-";
    document.getElementById("user-reward-debt").innerText = ethers.formatUnits(userInfo.rewardDebt, 18);
    document.getElementById("user-lp-balance").innerText = ethers.formatUnits(lpBalance, 18);
    document.getElementById("user-allowance").innerText = ethers.formatUnits(allowance, 18);

    // Przycisk zatwierdź LP jeśli potrzeba
    const approveBtn = document.getElementById("approve-lp-btn");
    const depositBtn = document.getElementById("deposit-lp-btn");

    if(allowance < lpBalance){
      approveBtn.disabled = false;
      depositBtn.disabled = true;
    } else {
      approveBtn.disabled = true;
      depositBtn.disabled = false;
    }

  } catch(e){
    showError("Błąd przy pobieraniu informacji MasterChef: " + e.message);
  }
}

async function approveLP(){
  try {
    const l = new ethers.Contract(addrLP, ERC20, signer);
    const max = ethers.MaxUint256;
    const tx = await l.approve(masterAddr, max);
    await tx.wait();
    await fetchLPInfo();
  } catch(e){
    showError("Błąd przy zatwierdzaniu LP: " + e.message);
  }
}

async function depositLP(){
  try {
    const l = new ethers.Contract(addrLP, ERC20, provider);
    const lpBalance = await l.balanceOf(account);
    if(lpBalance.isZero()){
      showError("Brak LP do zdeponowania");
      return;
    }

    const tx = await masterChef.deposit(poolId, lpBalance);
    await tx.wait();
    await fetchLPInfo();
    await updateBalances();
  } catch(e){
    showError("Błąd przy wpłacie LP: " + e.message);
  }
}

async function withdrawLP(){
  try {
    const userInfo = await masterChef.userInfo(poolId, account);
    if(userInfo.amount.isZero()){
      showError("Brak stakowanych LP do wypłaty");
      return;
    }

    const tx = await masterChef.withdraw(poolId, userInfo.amount);
    await tx.wait();
    await fetchLPInfo();
    await updateBalances();
  } catch(e){
    showError("Błąd przy wypłacie LP: " + e.message);
  }
}

// === Obsługa błędów i helper ===
function showError(msg){
  console.error(msg);
  const container = document.getElementById("error-container");
  const text = document.getElementById("error-text");
  text.innerText = msg;
  container.style.display = "block";
  setTimeout(() => {
    container.style.display = "none";
  }, 8000);
}

// === Eventy przycisków MasterChef ===
document.getElementById("approve-lp-btn").addEventListener("click", approveLP);
document.getElementById("deposit-lp-btn").addEventListener("click", depositLP);

// === Inne przyciski dla dodawania/ usuwania płynności procentowo ===
document.getElementById("btn-add-liquidity").addEventListener("click", () => {
  const val = parseInt(document.getElementById("input-add-liquidity-percent").value);
  if(isNaN(val) || val < 1 || val > 100) return showError("Podaj procent 1-100");
  addLiquidity(val);
});

document.getElementById("btn-remove-liquidity").addEventListener("click", () => {
  const val = parseInt(document.getElementById("input-remove-liquidity-percent").value);
  if(isNaN(val) || val < 1 || val > 100) return showError("Podaj procent 1-100");
  removeLiquidity(val);
});

// === Theme toggle ===
function toggleTheme(){
  const body = document.body;
  if(body.getAttribute("data-theme") === "light"){
    body.setAttribute("data-theme", "");
    document.querySelector(".theme-toggle").innerText = "🌞 Tryb jasny";
  } else {
    body.setAttribute("data-theme", "light");
    document.querySelector(".theme-toggle").innerText = "🌚 Tryb ciemny";
  }
}

// === Eventy przycisków głównych (DODANE) ===
document.getElementById("connect-wallet-btn").addEventListener("click", connectWallet);
document.getElementById("btn-swap").addEventListener("click", handleSwap);
document.querySelector(".theme-toggle").addEventListener("click", toggleTheme);

// === Auto update on load & on wallet change ===
window.ethereum?.on('accountsChanged', (accounts) => {
  if(accounts.length > 0){
    account = accounts[0];
    document.getElementById("wallet-address").innerText = account;
    updateBalances();
    fetchLPInfo();
  } else {
    account = null;
    document.getElementById("wallet-address").innerText = "Niepołączony";
  }
});

window.ethereum?.on('chainChanged', (chainId) => {
  if(chainId !== opBNB.chainId){
    showError("Przełącz na sieć opBNB");
  }
});

// === Start: jeśli już połączony ===
(async () => {
  if(window.ethereum){
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if(accounts.length > 0){
        signer = await provider.getSigner();
        account = accounts[0];
        document.getElementById("wallet-address").innerText = account;
        await updateBalances();
        await fetchLPInfo();
      }
    } catch {}
  }
})();
