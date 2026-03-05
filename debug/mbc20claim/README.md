# MBC20 ClaimManagerV3 – Debug & Claim Toolkit

A set of Python scripts to debug, verify and interact with the
[ClaimManagerV3](https://basescan.org/address/0xfc54307bc86a93fa1a0aa7dd32c75dc9498c1e8d#code)
contract on Base Mainnet (chain ID: 8453).

## Background

The official mbc20.xyz Claim button for the **GPT** token produces signatures
that fail `ECDSA.recover()` verification inside the contract, causing every
`claim()` transaction to revert with `InvalidSignature`.

This toolkit was written to:
1. Read the on-chain state for any wallet.
2. Verify whether a given signature is correct.
3. Generate a correct signature (requires the signer private key — for mbc20 devs).
4. Send the `claim()` transaction once a valid signature is available.

## Contract details

| Field | Value |
|---|---|
| Contract | `0xFc54307bc86a93Fa1a0aA7DD32c75dc9498c1E8D` |
| Network | Base Mainnet (chain ID 8453) |
| Contract name | `ClaimManagerV3` |
| Authorized signer | `0x22dA4D6314B863dD7c3a39E6f338c8cF0BEC7d9f` |

## Requirements

```bash
pip install web3 eth-account
