# check.py – Read on-chain state for a wallet from ClaimManagerV3
# Usage: python check.py
from web3 import Web3
import sys

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
    {
        "inputs": [],
        "name": "factory",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
]

# ── Connect ──────────────────────────────────────────────────────────────
w3 = Web3(Web3.HTTPProvider(RPC_URL))

if not w3.is_connected():
    print("ERROR: Cannot connect to RPC. Check your internet connection.")
    sys.exit(1)

print(f"  Connected to Base Mainnet (chain ID: {w3.eth.chain_id})")

contract  = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDR), abi=ABI)
wallet_cs = Web3.to_checksum_address(WALLET)

# tick hash = keccak256(tick_bytes) – used as key in claimed[] and nonces[]
tick_hash = Web3.keccak(text=TICK)

# ── Read contract state ──────────────────────────────────────────────────
print("  Querying contract...\n")

try:
    claimable_amount = contract.functions.claimable(wallet_cs, TICK, TOTAL_AMOUNT).call()
    claimed_amount   = contract.functions.claimed(wallet_cs, tick_hash).call()
    current_nonce    = contract.functions.nonces(wallet_cs, tick_hash).call()
    signer_addr      = contract.functions.signer().call()
    factory_addr     = contract.functions.factory().call()
except Exception as e:
    print(f"ERROR: Contract call failed: {e}")
    sys.exit(1)

# ── ETH balance of wallet ────────────────────────────────────────────────
eth_balance = w3.eth.get_balance(wallet_cs)

# ── Output ───────────────────────────────────────────────────────────────
print("=" * 65)
print("  CONTRACT INFO")
print("=" * 65)
print(f"  Contract        : {CONTRACT_ADDR}")
print(f"  Factory         : {factory_addr}")
print(f"  Signer          : {signer_addr}")
print("-" * 65)
print("  WALLET INFO")
print("-" * 65)
print(f"  Wallet          : {WALLET}")
print(f"  ETH balance     : {w3.from_wei(eth_balance, 'ether'):.6f} ETH")
print("-" * 65)
print("  TOKEN STATE")
print("-" * 65)
print(f"  Tick            : {TICK}")
print(f"  Tick hash       : 0x{tick_hash.hex()}")
print(f"  Total amount    : {TOTAL_AMOUNT / 10**18:.4f} {TICK}")
print(f"  claimable()     : {claimable_amount / 10**18:.4f} {TICK}", end="")
print("  ✅ OK" if claimable_amount > 0 else "  ❌ NOTHING TO CLAIM")
print(f"  claimed[]       : {claimed_amount   / 10**18:.4f} {TICK}")
print(f"  nonces[]        : {current_nonce}")
print("=" * 65)

# ── Summary ──────────────────────────────────────────────────────────────
print("\n  SUMMARY")
print("-" * 65)
if claimable_amount == 0:
    print("  ❌ Nothing to claim – either already claimed or wrong totalAmount.")
elif eth_balance == 0:
    print("  ⚠️  Claimable tokens found but wallet has 0 ETH for gas!")
else:
    print(f"  ✅ Ready to claim {claimable_amount / 10**18:.4f} {TICK}")
    print(f"     Use nonce={current_nonce} in sign.py and claim.py")
print("-" * 65)
