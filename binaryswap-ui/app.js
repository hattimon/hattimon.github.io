
// app.js

const provider = new ethers.BrowserProvider(window.ethereum);
let signer;
let account;

const token0101 = "0xa41b3067ec694dbec668c389550ba8fc589e5797";
const router = "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b";
const lpToken = "0x506b8322e1159d06e493ebe7ffa41a24291e7ae3";
const masterChef = "0xBb7bA68b2A2d7aB29D30F3E0635F62B059f34eA9";

const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)"
];

const routerABI = [
  "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) payable returns (uint amountToken, uint amountETH, uint liquidity)",
  "function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) returns (uint amountToken, uint amountETH)",
  "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable",
  "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)"
];

const masterChefABI = [
  "function poolLength() view returns (uint256)",
  "function poolInfo(uint256) view returns (address lpToken, uint allocPoint, uint lastRewardBlock, uint accTokenPerShare)",
  "function userInfo(uint256, address) view returns (uint amount, uint rewardDebt)",
  "function pendingCub(uint256, address) view returns (uint256)",
  "function emergencyWithdraw(uint256)"
];

async function connectWallet() {
  try {
    const accounts = await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = accounts[0];
    document.getElementById("wallet-address").textContent = account;
    updateBalances();
    fetchLPInfo();
  } catch (err) {
    alert("❌ Błąd połączenia z portfelem: " + err.message);
  }
}
