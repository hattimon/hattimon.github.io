
let provider, signer;

async function connectWallet() {
  if (window.ethereum) {
    await ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    document.getElementById("wallet-address").innerText = `Połączono: ${await signer.getAddress()}`;
  } else {
    alert("Zainstaluj MetaMask!");
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

window.onload = loadContractUI;
