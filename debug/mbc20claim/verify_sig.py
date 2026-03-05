# verify_sig.py – Verify whether a given signature recovers to the correct signer
# Usage: python verify_sig.py
from web3 import Web3
from eth_account import Account
from eth_account.messages import encode_defunct
from eth_abi import encode
from dotenv import load_dotenv
import sys

load_dotenv()

# ── CONFIG ──────────────────────────────────────────────────────────────
WALLET          = "0xfEc58763fcd5Df39dD78a454a8304F41209fD1b8"
TICK            = "GPT"
TOTAL_AMOUNT    = 80901 * 10**18
NONCE           = 0
CHAIN_ID        = 8453
SIGNATURE       = "0xce101ec912b456c6348fe53b37afb823dfe07d61e5f6cb920e60c77c5e3cd6d517cdf2075aac86df606ccb76f3b1082275546c03404692218a21b616975a360c1c"
EXPECTED_SIGNER = "0x22dA4D6314B863dD7c3a39E6f338c8cF0BEC7d9f"
# ────────────────────────────────────────────────────────────────────────

sig_clean = SIGNATURE.replace("0x", "")
if len(sig_clean) != 130:
    print(f"ERROR: Signature wrong length ({len(sig_clean)} chars, expected 130).")
    sys.exit(1)

try:
    wallet_cs = Web3.to_checksum_address(WALLET)
    signer_cs = Web3.to_checksum_address(EXPECTED_SIGNER)
except Exception as e:
    print(f"ERROR: Invalid address – {e}")
    sys.exit(1)

w3 = Web3()

payload  = encode(
    ["address", "string", "uint256", "uint256", "uint256"],
    [wallet_cs, TICK, TOTAL_AMOUNT, NONCE, CHAIN_ID]
)
msg_hash = Web3.keccak(payload)
message  = encode_defunct(msg_hash)

try:
    recovered = Account.recover_message(message, signature=SIGNATURE)
except Exception as e:
    print(f"ERROR: Failed to recover signer – {e}")
    sys.exit(1)

match = recovered.lower() == signer_cs.lower()

print("=" * 65)
print("  INPUT")
print("=" * 65)
print(f"  Wallet          : {wallet_cs}")
print(f"  Tick            : {TICK}")
print(f"  Total amount    : {TOTAL_AMOUNT / 10**18:.4f} {TICK}")
print(f"  Nonce           : {NONCE}")
print(f"  Chain ID        : {CHAIN_ID}")
print(f"  Signature       : {SIGNATURE[:20]}...{SIGNATURE[-10:]}")
print("-" * 65)
print("  HASH COMPUTATION")
print("-" * 65)
print(f"  abi.encode hash : 0x{msg_hash.hex()}")
print(f"  EIP-191 prefix applied before recovery")
print("-" * 65)
print("  RESULT")
print("-" * 65)
print(f"  Recovered       : {recovered}")
print(f"  Expected signer : {signer_cs}")
print("-" * 65)
if match:
    print("  ✅ VALID – signature will pass ClaimManagerV3 verification.")
else:
    print("  ❌ INVALID – signature does NOT recover to expected signer.")
    print("     Causes:")
    print("     1. Backend signed a different payload / wrong field order")
    print("     2. Wrong nonce used at signing time")
    print("     3. Wrong private key used by backend")
    print("     4. totalAmount mismatch between signature and call params")
print("=" * 65)

sys.exit(0 if match else 1)
