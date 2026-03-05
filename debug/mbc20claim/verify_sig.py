# verify_sig.py – Verify whether a given signature is correct
from web3 import Web3
from eth_account import Account
from eth_account.messages import encode_defunct
from eth_abi import encode

# ── CONFIG ──────────────────────────────────────────────────────────────
WALLET          = "0xfEc58763fcd5Df39dD78a454a8304F41209fD1b8"
TICK            = "GPT"
TOTAL_AMOUNT    = 80901 * 10**18
NONCE           = 0
CHAIN_ID        = 8453
SIGNATURE       = "0xce101ec912b456c6348fe53b37afb823dfe07d61e5f6cb920e60c77c5e3cd6d517cdf2075aac86df606ccb76f3b1082275546c03404692218a21b616975a360c1c"
EXPECTED_SIGNER = "0x22dA4D6314B863dD7c3a39E6f338c8cF0BEC7d9f"
# ────────────────────────────────────────────────────────────────────────

w3        = Web3()
wallet_cs = Web3.to_checksum_address(WALLET)

payload  = encode(
    ["address", "string", "uint256", "uint256", "uint256"],
    [wallet_cs, TICK, TOTAL_AMOUNT, NONCE, CHAIN_ID]
)
msg_hash = Web3.keccak(payload)
message  = encode_defunct(msg_hash)
recovered = Account.recover_message(message, signature=SIGNATURE)

match = recovered.lower() == EXPECTED_SIGNER.lower()

print("=" * 60)
print(f"  Wallet          : {WALLET}")
print(f"  Tick            : {TICK}")
print(f"  Total amount    : {TOTAL_AMOUNT}")
print(f"  Nonce           : {NONCE}")
print(f"  Chain ID        : {CHAIN_ID}")
print(f"  msg_hash        : 0x{msg_hash.hex()}")
print("-" * 60)
print(f"  Recovered signer: {recovered}")
print(f"  Expected signer : {EXPECTED_SIGNER}")
print(f"  Result          : {'✅ VALID signature' if match else '❌ INVALID signature – backend bug!'}")
print("=" * 60)
