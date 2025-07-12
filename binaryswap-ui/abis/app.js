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

// === Swap Handler ===
async function handleSwap() {
  const pc = parseInt(document.getElementById("swapPercent").value);
  if (isNaN(pc) || pc < 1 || pc > 100) return showError("Percentage must be 1–100!");

  const slippage = parseInt(document.getElementById("swapSlippage").value) || 1;
  const deadline = Math.floor(Date.now() / 1000) + 300;

  if (document.getElementById("swapDirection").value === "toToken") {
    swapBNBto0101(pc, slippage, deadline);
  } else {
    swap0101toBNB(pc, slippage, deadline);
  }
}

// === Swap: BNB → 0101 ===
async function swapBNBto0101(pc, slippage, deadline) {
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
    showError("Error swapping (BNB → 0101): " + error.message);
  }
}

// === Swap: 0101 → BNB ===
async function swap0101toBNB(pc, slippage, deadline) {
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
    showError("Error swapping (0101 → BNB): " + error.message);
  }
}

// === LP Functions ===
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

// === Wallet Functions ===
async function switchToOpBNB() {
  if (!window.ethereum) return showError("Install MetaMask!");

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
        return showError("Cannot add opBNB network: " + addError.message);
      }
    } else {
      return showError("Cannot switch network: " + switchError.message);
    }
  }
}

async function connectWallet() {
  if (!window.ethereum) return showError("Install MetaMask!");

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
            return showError("Cannot add opBNB network: " + addError.message);
          }
        } else {
          return showError("Cannot switch network: " + switchError.message);
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
    showError("Wallet connection error: " + err.message);
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

// === Theme Toggle ===
function toggleTheme() {
  const html = document.documentElement;
  const light = html.getAttribute("data-theme") === "light";
  html.setAttribute("data-theme", light ? "" : "light");
  document.querySelector(".theme-toggle").textContent = light ? "🌞 Light Mode" : "🌙 Dark Mode";
  localStorage.theme = light ? "" : "light";
}
(() => {
  const th = localStorage.theme;
  document.documentElement.setAttribute("data-theme", th || "");
  document.querySelector(".theme-toggle").textContent = th ? "🌙 Dark Mode" : "🌞 Light Mode";
})();

// === Error Handling ===
function showError(message) {
  const errorContainer = document.getElementById('error-container');
  const errorText = document.getElementById('error-text');
  errorText.textContent = message;
  errorContainer.style.display = 'block';
  setTimeout(() => (errorContainer.style.display = 'none'), 5000);
}
