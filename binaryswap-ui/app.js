let provider, signer;
let tokenBalances = {}; // To store token balances
let isConnected = false; // Flag to track wallet connection status

const BNB_TOKEN_ADDRESS = null;  // Native token (BNB)
const TOKEN_0101_ADDRESS = '0xa41b3067ec694dbec668c389550ba8fc589e5797'; // Example token (replace with actual address)

// MetaMask connect and disconnect functions
async function connectWallet() {
  if (window.ethereum) {
    await ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    document.getElementById("wallet-address").innerText = `Połączono: ${address}`;
    document.getElementById("connect-btn").style.display = "none";
    document.getElementById("disconnect-btn").style.display = "block";

    isConnected = true;
    loadTokenBalances();
  } else {
    alert("Zainstaluj MetaMask!");
  }
}

async function disconnectWallet() {
  signer = null;
  provider = null;
  isConnected = false;

  document.getElementById("wallet-address").innerText = "Portfel odłączony";
  document.getElementById("connect-btn").style.display = "block";
  document.getElementById("disconnect-btn").style.display = "none";
  document.getElementById("balances-list").innerHTML = "";
  document.getElementById("swap-amount").value = '';
}

async function loadTokenBalances() {
  const balances = [];

  // Add balance of BNB
  const bnbBalance = await provider.getBalance(await signer.getAddress());
  balances.push({ symbol: 'BNB', amount: ethers.formatUnits(bnbBalance, 18) });

  // Add balance of 0101 token (replace with actual token address)
  const token0101Contract = new ethers.Contract(TOKEN_0101_ADDRESS, ['function balanceOf(address) view returns (uint256)'], signer);
  const token0101Balance = await token0101Contract.balanceOf(await signer.getAddress());
  balances.push({ symbol: '0101', amount: ethers.formatUnits(token0101Balance, 18) });

  updateTokenBalances(balances);
}

function updateTokenBalances(balances) {
  const balanceList = document.getElementById('balances-list');
  balanceList.innerHTML = '';
  balances.forEach(balance => {
    const balanceElement = document.createElement('p');
    balanceElement.innerText = `${balance.symbol}: ${balance.amount}`;
    balanceList.appendChild(balanceElement);
  });
}

async function swapTokens() {
  const amount = document.getElementById("swap-amount").value;
  const maxAmount = ethers.parseUnits(amount, 18); // Handle decimals correctly for token

  // Router contract address
  const routerContract = new ethers.Contract(
    "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b", // BinarySwap Router
    ["function swapExactTokensForTokens(uint256,uint256,address[],address,uint256)"],
    signer
  );

  const path = [TOKEN_0101_ADDRESS, "0xa41b3067ec694dbec668c389550ba8fc589e5797"]; // Replace with correct path
  const to = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  const tx = await routerContract.swapExactTokensForTokens(
    maxAmount,
    0,
    path,
    to,
    deadline
  );

  await tx.wait();
  alert("Swap completed!");
}

document.getElementById("connect-btn").addEventListener("click", connectWallet);
document.getElementById("disconnect-btn").addEventListener("click", disconnectWallet);
document.getElementById("swap-btn").addEventListener("click", swapTokens);

window.onload = () => {
  document.getElementById("connect-btn").style.display = "block";
};
