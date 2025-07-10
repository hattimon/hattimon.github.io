// Placeholder for updated app.js implementing:
// - Swapy w obie strony (0101 ↔ BNB)
// - Obsługa LP (dodawanie/usuwanie procentowe)
// - Pokazanie salda tokenów (0101, BNB, LP)
// - Emergency Withdraw z MasterChef
// - Slippage

import { ethers } from "ethers";

// 📅 Konfiguracja
const token0101 = "0xa41b3067ec694dbec668c389550ba8fc589e5797";
const routerAddress = "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b";
const lpTokenAddress = "0x506b8322e1159d06e493ebe7ffa41a24291e7ae3";
const masterChefAddress = "0x..."; // uzupełnij

let provider;
let signer;
let walletAddress;

// 🚀 Inicjalizacja
window.onload = async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    signer = await provider.getSigner();
    walletAddress = accounts[0];

    // TODO: render balances & GUI
    console.log("Połączono z:", walletAddress);
  } else {
    alert("Zainstaluj MetaMask!");
  }
};

// 🔄 Pobieranie sald
async function getBalances() {
  const token = new ethers.Contract(token0101, ERC20_ABI, provider);
  const lp = new ethers.Contract(lpTokenAddress, ERC20_ABI, provider);

  const [balance0101, balanceBNB, balanceLP] = await Promise.all([
    token.balanceOf(walletAddress),
    provider.getBalance(walletAddress),
    lp.balanceOf(walletAddress),
  ]);

  return {
    token0101: ethers.formatUnits(balance0101, 18),
    bnb: ethers.formatUnits(balanceBNB, 18),
    lp: ethers.formatUnits(balanceLP, 18)
  };
}

// 🥜 Swap 0101 → BNB
async function swapTokenToBNB(amount, slippage) {
  // TODO
}

// ⚡ Swap BNB → 0101
async function swapBNBToToken(amountInEth, slippage) {
  // TODO
}

// 🌌 Add LP procentowo
async function addLiquidity(percent) {
  // TODO: pobierz saldo 0101 i BNB, przelicz wartości na 50/50 i dodaj LP
}

// 🔄 Remove LP procentowo
async function removeLiquidity(percent) {
  // TODO: pobierz saldo LP i usuń część tokenów
}

// ❌ Emergency Withdraw
async function emergencyWithdraw(poolId) {
  const masterChef = new ethers.Contract(masterChefAddress, MASTER_CHEF_ABI, signer);
  const tx = await masterChef.emergencyWithdraw(poolId);
  await tx.wait();
  alert("Emergency Withdraw wykonane!");
}

// Użyj tych funkcji i GUI (HTML) do wywołania operacji przez przyciski
