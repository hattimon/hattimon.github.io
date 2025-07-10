let provider, signer;
let isConnected = false;

const BNB_TOKEN_ADDRESS = null;  // Native token (BNB)
const TOKEN_0101_ADDRESS = '0xa41B3067eC694DBec668c389550bA8fc589e5797'; // Token 0101
const LP_TOKEN_ADDRESS = '0x506b8322e1159d06e493ebe7ffa41a24291e7ae3'; // Token LP (Uniswap V2 0101/BNB)

async function connectWallet() {
  if (window.ethereum) {
    // Prośba o połączenie z MetaMask
    await ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    // Wyświetlanie adresu portfela
    document.getElementById("wallet-address").innerText = `Połączono: ${address}`;
    document.getElementById("connect-btn").style.display = "none";
    document.getElementById("disconnect-btn").style.display = "block";

    isConnected = true;
    loadTokenBalances(); // Załaduj salda po połączeniu portfela
  } else {
    alert("Zainstaluj MetaMask!");
  }
}

async function disconnectWallet() {
  signer = null;
  provider = null;
  isConnected = false;

  // Resetowanie UI
  document.getElementById("wallet-address").innerText = "Portfel odłączony";
  document.getElementById("connect-btn").style.display = "block";
  document.getElementById("disconnect-btn").style.display = "none";
  document.getElementById("balances-list").innerHTML = "";
  document.getElementById("swap-amount").value = '';
}

async function loadTokenBalances() {
  const balances = [];

  // 1. BNB Balance
  try {
    const bnbBalance = await provider.getBalance(await signer.getAddress());
    balances.push({ symbol: 'BNB', amount: ethers.formatUnits(bnbBalance, 18) });
  } catch (error) {
    console.error("Błąd pobierania salda BNB:", error);
  }

  // 2. Token 0101 Balance
  try {
    const token0101Contract = new ethers.Contract(TOKEN_0101_ADDRESS, ['function balanceOf(address) view returns (uint256)'], signer);
    const token0101Balance = await token0101Contract.balanceOf(await signer.getAddress());
    balances.push({ symbol: '0101', amount: ethers.formatUnits(token0101Balance, 18) });
  } catch (error) {
    console.error("Błąd pobierania salda 0101:", error);
  }

  // 3. LP Token Balance
  try {
    const lpTokenContract = new ethers.Contract(LP_TOKEN_ADDRESS, ['function balanceOf(address) view returns (uint256)'], signer);
    const lpTokenBalance = await lpTokenContract.balanceOf(await signer.getAddress());
    balances.push({ symbol: 'LP Token', amount: ethers.formatUnits(lpTokenBalance, 18) });
  } catch (error) {
    console.error("Błąd pobierania salda LP:", error);
  }

  updateTokenBalances(balances); // Aktualizowanie UI z saldami
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
  const maxAmount = ethers.parseUnits(amount, 18);

  const routerContract = new ethers.Contract(
    "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b", // Router address
    ["function swapExactTokensForTokens(uint256,uint256,address[],address,uint256)"],
    signer
  );

  const path = [TOKEN_0101_ADDRESS, BNB_TOKEN_ADDRESS]; // Ścieżka: 0101 → BNB
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

// Add and remove LP
async function addLiquidity() {
  const amountA = document.getElementById("lp-amount-a").value;
  const amountB = document.getElementById("lp-amount-b").value;

  const routerContract = new ethers.Contract(
    "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b", // Router address
    ["function addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)"],
    signer
  );

  const tx = await routerContract.addLiquidity(
    TOKEN_0101_ADDRESS,
    BNB_TOKEN_ADDRESS, // If BNB is being added
    ethers.parseUnits(amountA, 18),
    ethers.parseUnits(amountB, 18),
    0,
    0,
    await signer.getAddress(),
    Math.floor(Date.now() / 1000) + 60 * 20
  );

  await tx.wait();
  alert("Liquidity Added!");
}

async function removeLiquidity() {
  const amount = document.getElementById("lp-amount-a").value; // LP token amount to remove

  const routerContract = new ethers.Contract(
    "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b", // Router address
    ["function removeLiquidity(address,address,uint256,uint256,uint256,address,uint256)"],
    signer
  );

  const tx = await routerContract.removeLiquidity(
    TOKEN_0101_ADDRESS,
    BNB_TOKEN_ADDRESS, // If BNB is being removed
    ethers.parseUnits(amount, 18),
    0,
    0,
    await signer.getAddress(),
    Math.floor(Date.now() / 1000) + 60 * 20
  );

  await tx.wait();
  alert("Liquidity Removed!");
}

// Event listeners
document.getElementById("connect-btn").addEventListener("click", connectWallet);
document.getElementById("disconnect-btn").addEventListener("click", disconnectWallet);
document.getElementById("swap-btn").addEventListener("click", swapTokens);
document.getElementById("add-lp-btn").addEventListener("click", addLiquidity);
document.getElementById("remove-lp-btn").addEventListener("click", removeLiquidity);

window.onload = () => {
  document.getElementById("disconnect-btn").style.display = "none"; // Hide disconnect initially
};
