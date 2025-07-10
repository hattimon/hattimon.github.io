const provider = new ethers.BrowserProvider(window.ethereum);
let signer, account;

const token0101 = "0xa41b3067ec694dbec668c389550ba8fc589e5797";
const router = "0x3958795ca5C4d9f7Eb55656Ba664efA032E1357b";
const lpToken = "0x506b8322e1159d06e493ebe7ffa41a24291e7ae3";
const masterChef = "0x39a786421889EB581bd105508a0D2Dc03523B903";

const tokenABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address,uint256) returns(bool)"
];

const routerABI = [
  "function addLiquidityETH(address,uint,uint,uint,address,uint) payable returns(uint,uint,uint)",
  "function removeLiquidityETH(address,uint,uint,uint,address,uint) returns(uint,uint)",
  "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint,address[],address,uint) payable",
  "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint,uint,address[],address,uint)"
];

const masterChefABI = [
  "function poolLength() view returns(uint256)",
  "function userInfo(uint256,address) view returns(uint256,uint256)",
  "function pendingCub(uint256,address) view returns(uint256)",
  "function emergencyWithdraw(uint256)"
];

async function connectWallet() {
  if (!window.ethereum) return alert("Zainstaluj MetaMask!");
  const accounts = await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  account = accounts[0];
  document.getElementById("wallet-address").textContent = account;
  updateBalances();
  fetchLPInfo();
}

async function addNetwork() {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0xcc",
        chainName: "opBNB Mainnet",
        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
        rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org/"],
        blockExplorerUrls: ["https://mainnet.opbnbscan.com/"]
      }]
    });
  } catch(e){ alert("Błąd dodania sieci: "+e.message); }
}

async function updateBalances() {
  const t = new ethers.Contract(token0101, tokenABI, provider);
  const l = new ethers.Contract(lpToken, tokenABI, provider);
  const [b0101, bLP, bBNB] = await Promise.all([
    t.balanceOf(account),
    l.balanceOf(account),
    provider.getBalance(account)
  ]);
  document.getElementById("balance-0101").textContent = parseFloat(ethers.formatUnits(b0101,18)).toFixed(8);
  document.getElementById("balance-bnb").textContent = parseFloat(ethers.formatUnits(bBNB,18)).toFixed(8);
  document.getElementById("balance-lp").textContent = parseFloat(ethers.formatUnits(bLP,18)).toFixed(8);
}

async function handleSwap() {
  const percent = parseFloat(document.getElementById("swapPercent").value);
  if(isNaN(percent)||percent<=0||percent>100) return alert("Wprowadź % od 1 do 100!");
  const sl = parseInt(document.getElementById("swapSlippage").value);
  const dir = document.getElementById("swapDirection").value;
  if(dir==="toToken") return swapBNBto0101(percent,sl);
  else return swap0101toBNB(percent,sl);
}

async function swapBNBto0101(percent, slippage) {
  const r = new ethers.Contract(router, routerABI, signer);
  const bBNB = await provider.getBalance(account);
  const value = bBNB * BigInt(percent) / 100n;
  const path = ["0x4200000000000000000000000000000000000006", token0101];
  const deadline = Math.floor(Date.now()/1000)+600;
  const tx = await r.swapExactETHForTokensSupportingFeeOnTransferTokens(0,path,account,deadline,{value});
  await tx.wait();
  updateBalances();
}

async function swap0101toBNB(percent, slippage) {
  const t = new ethers.Contract(token0101, tokenABI, signer);
  const r = new ethers.Contract(router, routerABI, signer);
  const b0101 = await t.balanceOf(account);
  const amount = b0101 * BigInt(percent) / 100n;
  await t.approve(router, amount);
  const path = [token0101, "0x4200000000000000000000000000000000000006"];
  const deadline = Math.floor(Date.now()/1000)+600;
  const tx = await r.swapExactTokensForETHSupportingFeeOnTransferTokens(amount,0,path,account,deadline);
  await tx.wait();
  updateBalances();
}

async function addLiquidity(percent) {
  const t = new ethers.Contract(token0101, tokenABI, signer);
  const r = new ethers.Contract(router, routerABI, signer);
  const bBNB = await provider.getBalance(account);
  const b0101 = await t.balanceOf(account);
  const valBNB = bBNB * BigInt(percent) / 100n;
  const val0101 = b0101 * BigInt(percent) / 100n;
  await t.approve(router, val0101);
  const deadline = Math.floor(Date.now()/1000)+600;
  const tx = await r.addLiquidityETH(token0101,val0101,0,0,account,deadline,{value: valBNB});
  await tx.wait();
  updateBalances();
}

async function removeLiquidity(percent) {
  const l = new ethers.Contract(lpToken, tokenABI, signer);
  const r = new ethers.Contract(router, routerABI, signer);
  const bLP = await l.balanceOf(account);
  const toRem = bLP * BigInt(percent)/100n;
  await l.approve(router,toRem);
  const deadline = Math.floor(Date.now()/1000)+600;
  const tx = await r.removeLiquidityETH(token0101,toRem,0,0,account,deadline);
  await tx.wait();
  updateBalances();
}

async function emergencyWithdraw(pid) {
  const m = new ethers.Contract(masterChef, masterChefABI, signer);
  const tx = await m.emergencyWithdraw(pid);
  await tx.wait();
  alert("🚨 Emergency Withdraw wywołany dla pool "+pid);
  updateBalances();
  fetchLPInfo();
}

async function fetchLPInfo() {
  document.getElementById("lp-info").innerHTML="";
  const m = new ethers.Contract(masterChef, masterChefABI, provider);
  const len = await m.poolLength();
  for(let i=0;i<Number(len);i++){
    const u = await m.userInfo(i,account);
    const p = await m.pendingCub(i,account);
    if(u[0]>0n||p>0n){
      const html = document.createElement("p");
      html.innerHTML = `Pool ${i}: LP=${ethers.formatUnits(u[0],18).slice(0,8)}, Pending CUB=${ethers.formatUnits(p,18).slice(0,8)}
        <button onclick="emergencyWithdraw(${i})">🚨 Emergency Withdraw</button>`;
      document.getElementById("lp-info").append(html);
    }
  }
  updateBalances();
}
