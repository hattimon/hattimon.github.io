**GPT Claim – Critical Bug Proof**

I ran an on-chain signature verification tool against the `ClaimManagerV3` contract on Base Mainnet.

**Contract:** `0xFc54307bc86a93Fa1a0aA7DD32c75dc9498c1E8D`
**My wallet:** `0xfEc58763fcd5Df39dD78a454a8304F41209fD1b8`
**Allocation:** 80,901 GPT (confirmed via `claimable()` – nothing claimed yet)

**Verification result:**
```
abi.encode hash : 0x5b086202cbc33d0a56a38d48102ed61252992acf7a989b6d695b771dc1b884c9
Recovered signer: 0x3eFf4b61C8aB7F9AFb060c5644C4E81D75a86C3F
Expected signer : 0x22dA4D6314B863dD7c3a39E6f338c8cF0BEC7d9f
Result          : ❌ INVALID
```

**Root cause:** Your backend is signing with a key that corresponds to `0x3eFf...`, not the authorized signer `0x22dA...` stored in the contract. Every `claim()` transaction will revert with `InvalidSignature` until this is fixed.

**Fix required:** Update your backend to sign with the private key of `0x22dA4D6314B863dD7c3a39E6f338c8cF0BEC7d9f`.

Full toolkit + verification code:
https://github.com/hattimon/hattimon.github.io/tree/main/debug/mbc20claim
