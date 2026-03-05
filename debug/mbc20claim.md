<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# napis zjedynie o tmy portfelu: 0xfEc58763fcd5Df39dD78a454a8304F41209fD1b8


---

**Subject: GPT Token Claim – `execution reverted` / InvalidSignature on ClaimManagerV3**

***

Hi team,

I am unable to claim my GPT tokens using the official Claim button on mbc20.xyz. Every attempt results in a simulation failure and an on-chain revert. I have analyzed the verified contract source code on BaseScan and identified the root cause.

***

**Affected wallet:** `0xfEc58763fcd5Df39dD78a454a8304F41209fD1b8`

**Token:** GPT

**Allocation (confirmed via `claimable()` on-chain):** `80,901 GPT` — full amount still unclaimed

**Contract:** `0xFc54307bc86a93Fa1a0aA7DD32c75dc9498c1E8D` (Base Mainnet, `ClaimManagerV3`)

**Error:** `execution reverted` → `InvalidSignature`

**Simulation output:**

```
Simulation Failed (execution reverted: execution reverted #1002)
Unknown Signature Type
```

**Calldata sent by your frontend:**

```json
{
  "func": "claim",
  "params": [
    "GPT",
    80901000000000000000000,
    0,
    "0xce101ec912b456c6348fe53b37afb823dfe07d61e5f6cb920e60c77c5e3cd6d517cdf2075aac86df606ccb76f3b1082275546c03404692218a21b616975a360c1c"
  ]
}
```


***

**Root cause:**

After reviewing the verified Solidity source of `ClaimManagerV3`, the contract verifies the signature by computing:

```solidity
bytes32 hash = keccak256(abi.encode(
    msg.sender,    // 0xfEc58763fcd5Df39dD78a454a8304F41209fD1b8
    tick,          // "GPT"
    totalAmount,   // 80901000000000000000000
    nonce,         // 0
    block.chainid  // 8453
));
bytes32 ethHash = MessageHashUtils.toEthSignedMessageHash(hash);
// ECDSA.recover(ethHash, signature) must equal signer
```

The authorized `signer` stored in the contract is:
`0x22dA4D6314B863dD7c3a39E6f338c8cF0BEC7d9f`

The `ECDSA.recover()` of the signature provided by your backend **does not return this address**, which causes `InvalidSignature` revert. The wallet itself and the allocation are perfectly valid — the issue is entirely in the signature generated server-side.

***

**On-chain state verified:**


| Check | Result |
| :-- | :-- |
| `claimable(0xfEc5...d1b8, "GPT", 80901e18)` | `80901000000000000000000` ✅ |
| `claimed[wallet][tickHash]` | `0` — nothing claimed yet |
| `nonces[wallet][tickHash]` | `0` |
| `signer()` | `0x22dA4D6314B863dD7c3a39E6f338c8cF0BEC7d9f` |


***

**Request:**

Please check your backend signing logic and ensure the message is encoded **exactly** as:

```
keccak256(abi.encode(walletAddress, tick, totalAmount, nonce, chainId))
```

wrapped with the EIP-191 `personal_sign` prefix (`\x19Ethereum Signed Message:\n32`), and signed by the key corresponding to `0x22dA4D6314B863dD7c3a39E6f338c8cF0BEC7d9f`.

Thank you.

