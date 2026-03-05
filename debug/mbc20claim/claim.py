# claim.py – Send claim() transaction on Base Mainnet
# Usage: python claim.py
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv
import json
import os
import sys

load_dotenv()

# ── CONFIG ──────────────────────────────────────────────────────────────
RPC_URL       = "https://mainnet.base.org"
CONTRACT_ADDR = "0xFc54307bc86a93Fa1a0aA7DD32c75dc9498c1E8D"
CHAIN_ID      = 8453
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

# ── Load wallet key from .env ────────────────────────────────────────────
USER_PRIVKEY = os.environ.get("WALLET_PRIVKEY")
if not USER_PRIVKEY:
    print("ERROR: WALLET_PRIVKEY not set in .env file.")
    print("       Add: WALLET_PRIVKEY=0xYourKey to .env")
    sys.exit(1)

# ── Load claim
