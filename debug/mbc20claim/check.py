
***

## `check.py`

```python
# check.py – Read on-chain state for a wallet
from web3 import Web3

# ── CONFIG ──────────────────────────────────────────────────────────────
RPC_URL       = "https://mainnet.base.org"
CONTRACT_ADDR = "0xFc54307bc86a93Fa1a0aA7DD32c75dc9498c1E8D"
WALLET        = "0xfEc58763fcd5Df39dD78a454a8304F41209fD1b8"
TICK          = "GPT"
TOTAL_AMOUNT  = 80901 * 10**18
# ────────────────────────────────────────────────────────────────────────

ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "wallet",      "type": "address"},
            {"internalType": "string",  "name": "tick",        "type": "string"},
            {"internalType": "uint256", "name": "totalAmount", "type": "uint256"}
        ],
        "name": "claimable",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "bytes32", "name": "", "type": "bytes32"}
        ],
        "name": "claimed",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "bytes32", "name": "", "type": "bytes32"}
        ],
        "name": "nonces",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "signer",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
]

w3         = Web3(Web3.HTTPProvider(RPC_URL))
contract   = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDR), abi=ABI)
wallet_cs  = Web3.to_checksum_address(WALLET)
tick_hash  = Web3.keccak(text=TICK)

claimable_amount = contract.functions.claimable(wallet_cs, TICK, TOTAL_AMOUNT).call()
claimed_amount   = contract.functions.claimed(wallet_cs, tick_hash).call()
current_nonce    = contract.functions.nonces(wallet_cs, tick_hash).call()
signer_addr      = contract.functions.signer().call()

print("=" * 60)
print(f"  Wallet         : {WALLET}")
print(f"  Tick           : {TICK}")
print(f"  Total amount   : {TOTAL_AMOUNT}")
print(f"  Tick hash      : 0x{tick_hash.hex()}")
print("-" * 60)
print(f"  claimable()    : {claimable_amount / 10**18:.4f} {TICK}")
print(f"  claimed[]      : {claimed_amount   / 10**18:.4f} {TICK}")
print(f"  nonces[]       : {current_nonce}")
print(f"  signer         : {signer_addr}")
print("=" * 60)
