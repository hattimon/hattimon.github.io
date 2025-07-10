let provider, signer;
let tokenBalances = {}; // To store token balances
let contractInstances = {}; // To store contract instances

// MetaMask connect and disconnect functions
async function connectWallet() {
  if (window.ethereum) {
    await ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    document.getElementById("wallet-address").innerText = `Połączono: ${await signer.getAddress()}`;
    loadTokenBalances();
  } else {
    alert("Zainstaluj MetaMask!");
  }
}

async function disconnectWallet() {
  signer = null;
  provider = null;
  document.getElementById("wallet-address").innerText = "Portfel odłączony";
  document.getElementById("contract-ui").innerHTML = "";
}

async function loadTokenBalances() {
  // Load balances for each token (you can change the token addresses as needed)
  const tokens = [
    { symbol: 'BNB', address: null }, // Native token (BNB)
    { symbol: '0101', address: '0xa41B3067eC694DBec668c389550bA8fc589e5797' }, // Example token address for 0101
    // Add more tokens here
  ];

  for (const token of tokens) {
    if (token.address) {
      const contract = new ethers.Contract(token.address, ['function balanceOf(address) view returns (uint256)'], signer || provider);
      const balance = await contract.balanceOf(await signer.getAddress());
      tokenBalances[token.symbol] = ethers.formatUnits(balance, 18); // Assuming 18 decimals, adjust as necessary
    } else {
      const balance = await provider.getBalance(await signer.getAddress());
      tokenBalances[token.symbol] = ethers.formatUnits(balance, 18);
    }
  }

  updateUI();
}

function updateUI() {
  // Show balances
  const balanceContainer = document.getElementById('token-balances');
  balanceContainer.innerHTML = '';
  for (const [symbol, balance] of Object.entries(tokenBalances)) {
    const balanceElement = document.createElement('p');
    balanceElement.innerText = `${symbol}: ${balance}`;
    balanceContainer.appendChild(balanceElement);
  }
}

async function loadContractUI() {
  const contracts = [
    { name: "Factory", address: "0xd50aaE6C73E2486B0Da718D23F35Dcf5aad25911" },
    { name: "Router", address: "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b" },
    { name: "Multi", address: "0x689e9631d1e308845DE5661C0B6bdE23c841e459" },
    { name: "Masterchef", address: "0x39a786421889EB581bd105508a0D2Dc03523B903" },
    { name: "Terminals", address: "0xD954Bb4E6aF0CCC7d692431b8841A03916BeC9e9" },
    { name: "WrappedTerminals", address: "0x7dC01688De0eFf09657406a7d55933d9349cC0B6" }
  ];

  const container = document.getElementById("contract-ui");
  for (const contract of contracts) {
    const abiResp = await fetch(`abis/${contract.name}.json`);
    const abi = await abiResp.json();
    const instance = new ethers.Contract(contract.address, abi, signer || provider);

    const div = document.createElement("div");
    div.innerHTML = `<h2>${contract.name}</h2>`;
    
    abi.forEach(fn => {
      if (fn.type === "function") {
        const btn = document.createElement("button");
        btn.innerText = fn.name;
        btn.onclick = async () => {
          try {
            // Here you can add additional logic for arguments to be passed to the functions
            const result = await instance[fn.name]();
            alert(`${fn.name} wynik: ${result}`);
          } catch (e) {
            alert(`Błąd w ${fn.name}: ` + (e.reason || e.message));
          }
        };
        div.appendChild(btn);
      }
    });

    container.appendChild(div);
  }
}

async function swapTokens() {
  const amount = document.getElementById("swap-amount").value;
  const maxAmount = ethers.parseUnits(amount, 18); // Ensure to handle token decimals correctly

  const routerContract = new ethers.Contract(
    "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b", 
    ["function swapExactTokensForTokens(uint256,uint256,address[],address,uint256)"],
    signer
  );
  
  // Example: Swapping 0101 to BNB
  const path = ["0xa41B3067eC694DBec668c389550bA8fc589e5797", "0xbbbbb...."]; // Replace with actual token addresses
  const to = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes deadline

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

window.onload = loadContractUI;
