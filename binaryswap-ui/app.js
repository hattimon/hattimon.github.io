// === Theme Toggle ===
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

// === Web3 Config ===
let provider, signer, account;
const addr0101 = "0xa41b3067ec694dbec668c389550ba8fc589e5797";
const addrLP = "0x506b8322e1159d06e493ebe7ffa41a24291e7ae3";
const routerAddr = "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b";
const masterAddr = "0x39a786421889EB581bd105508a0D2Dc03523B903";

const ERC20 = [
  "function balanceOf(address) view returns(uint256)",
  "function approve(address,uint256) returns(bool)"
];

const ROUTER = [
  "function addLiquidityETH(address,uint,uint,uint,address,uint) payable returns(uint,uint,uint)",
  "function removeLiquidityETH(address,uint,uint,uint,address,uint) returns(uint,uint)",
  "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint,address[],address,uint) payable",
  "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint,uint,address[],address,uint)"
];

const MASTER = [
  "function poolLength() view returns(uint256)",
  "function userInfo(uint256,address) view returns(uint256,uint256)",
  "function pendingCub(uint256,address) view returns(uint256)",
  "function emergencyWithdraw(uint256)"
];

// === Wallet ===
async function connectWallet(){
  if(!window.ethereum) return alert("Zainstaluj MetaMask!");
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  account = await signer.getAddress();
  document.getElementById("wallet-address").innerText = account;
  updateBalances();
  fetchLPInfo();
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

async function addNetwork(){
  try {
    await window.ethereum.request({ method:"wallet_addEthereumChain", params:[{
      chainId: "0xcc",
      chainName: "opBNB Mainnet",
      nativeCurrency: { name:"BNB", symbol:"BNB", decimals:18 },
      rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org/"],
      blockExplorerUrls: ["https://mainnet.opbnbscan.com/"]
    }]});
  } catch (e) {
    alert("Błąd dodawania sieci: " + e.message);
  }
}

// === Swap ===
async function handleSwap(){
  const pc = parseInt(swapPercent.value);
  if(isNaN(pc) || pc < 1 || pc > 100) return alert("Procent 1–100!");
  swapDirection.value === "toToken" ? swapBNBto0101(pc) : swap0101toBNB(pc);
}

async function swapBNBto0101(pc){
  const r = new ethers.Contract(routerAddr, ROUTER, signer);
  const bal = await provider.getBalance(account);
  const v = bal * BigInt(pc) / 100n;
  await r.swapExactETHForTokensSupportingFeeOnTransferTokens(0, [ethers.ZeroAddress, addr0101], account, Math.floor(Date.now()/1e3)+300, {value: v});
  updateBalances();
}

async function swap0101toBNB(pc){
  const t = new ethers.Contract(addr0101, ERC20, signer);
  const r = new ethers.Contract(routerAddr, ROUTER, signer);
  const bal = await t.balanceOf(account);
  const v = bal * BigInt(pc) / 100n;
  await t.approve(routerAddr, v);
  await r.swapExactTokensForETHSupportingFeeOnTransferTokens(v, 0, [addr0101, ethers.ZeroAddress], account, Math.floor(Date.now()/1e3)+300);
  updateBalances();
}

// === LP ===
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

// === MasterChef ===
async function fetchLPInfo(){
  const m = new ethers.Contract(masterAddr, MASTER, provider);
  const len = Number(await m.poolLength());
  const root = document.getElementById("lp-info");
  root.innerHTML = "<h3>MasterChef – Twoje pule</h3>";
  for(let i=0;i<len;i++){
    const u = await m.userInfo(i, account), p = await m.pendingCub(i, account);
    if(u[0]>0n || p>0n){
      const el = document.createElement("p");
      el.innerHTML = `Pool ${i}: LP=${parseFloat(ethers.formatUnits(u[0],18)).toFixed(8)}, Pending=${parseFloat(ethers.formatUnits(p,18)).toFixed(8)} 
        <button onclick="emergencyWithdraw(${i})">🚨 Emergency</button>`;
      root.appendChild(el);
    }
  }
}

async function emergencyWithdraw(i){
  const m = new ethers.Contract(masterAddr, MASTER, signer);
  await m.emergencyWithdraw(i);
  fetchLPInfo();
  updateBalances();
}
