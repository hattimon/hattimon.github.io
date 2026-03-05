# sign.py – Generate a valid signature (requires signer private key)
# NOTE: Only mbc20 devs have access to the signer key 0x22dA4D...
# Usage: python sign.py
from web3 import Web3
from eth_account import Account
from eth_account.messages import encode_defunct
from eth_abi import encode
from dotenv import load_dotenv
import json
import os
import sys

load_dotenv()

# ── CONFIG ──────────────────────────────────────────────────────────────
RPC_URL      = "https://mainnet.base.org"
WALLET       = "0xfEc58763fcd5Df39dD78a454a8304F41209fD1b8"
TICK         = "GPT"
TOTAL_AMOUNT = 80901 * 10**18
NONCE        = 0      # must match nonces[] from check.py
CHAIN_ID     = 8453
# ────────────────────────────────────────────────────────────────────────

# ── Load signer key from .env ────────────────────────────────────────────
SIGNER_PRIVKEY = os.environ.get("SIGNER_PRIVKEY")
if not SIGNER_PRIVKEY:
    print("ERROR: SIGNER_PRIVKEY not set in .env file.")
    print("       Add: SIGNER_PRIVKEY=0xYourKey to .env")
    sys.exit(1)

w3        = Web3(Web3.HTTPProvider(RPC_URL))
wallet_cs = Web3.to_checksum_address(WALLET)

payload  = encode(
    ["address", "string", "uint256", "uint256", "uint256"],
    [wallet_cs, TICK, TOTAL_AMOUNT, NONCE, CHAIN_ID]
)
msg_hash       = Web3.keccak(payload)
message        = encode_defunct(msg_hash)
signer_account = Account.from_key(SIGNER_PRIVKEY)
signed         = signer_account.sign_message(message)
signature_hex  = "0x" + signed.signature.hex()

print("=" * 65)
print(f"  Wallet          : {WALLET}")
print(f"  Tick            : {TICK}")
print(f"  Total amount    : {TOTAL_AMOUNT / 10**18:.4f} {TICK}")
print(f"  Nonce           : {NONCE}")
print(f"  Chain ID        : {CHAIN_ID}")
print(f"  msg_hash        : 0x{msg_hash.hex()}")
print(f"  Signed by       : {signer_account.address}")
print(f"  Signature       : {signature_hex}")
print("=" * 65)

output = {
    "wallet":      WALLET,
    "tick":        TICK,
    "totalAmount": str(TOTAL_AMOUNT),
    "nonce":       NONCE,
    "signature":   signature_hex
}
with open("claim_data.json", "w") as f:
    json.dump(output, f, indent=2)

print("\n  Saved to claim_data.json – use with claim.py")
