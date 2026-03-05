# claim.py – Send claim() transaction on-chain
from web3 import Web3
from eth_account import Account
import json

# ── CONFIG ──────────────────────────────────────────────────────────────
RPC_URL       = "https://mainnet.base.org"
USER_PRIVKEY  = "0xYOUR_WALLET_PRIVATE_KEY"  # private key of 0xfEc5...d1b8
CONTRACT_ADDR = "0xFc54307bc86a93Fa1a0aA7DD32c75dc9498c1E8D"
# ────────────────────────────────────────────────────────────────────────

ABI_CLAIM = [
    {
        "inputs": [
            {"internalType": "string",  "name": "tick",        "type": "string"},
            {"internalType": "uint256", "name": "totalAmount", "type": "uint256"},
            {"internalType": "uint256", "name": "nonce",       "type": "uint256"},
            {"internalType": "bytes",   "name": "signature",   "type": "bytes"}
        ],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

with open("claim_data.json", "r") as f:
    data = json.load(f)

tick         = data["tick"]
total_amount = int(data["totalAmount"])
nonce        = data["nonce"]
signature    = bytes.fromhex(data["signature"].replace("0x", ""))

w3       = Web3(Web3.HTTPProvider(RPC_URL))
account  = Account.from_key(USER_PRIVKEY)
contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDR),
    abi=ABI_CLAIM
)

print(f"Sending claim from : {account.address}")
print(f"Tick               : {tick}")
print(f"Amount             : {total_
