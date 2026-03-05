# 🧰 MBC20 ClaimManagerV3 -- Debug & Claim Toolkit

A lightweight toolkit designed to **debug, verify, and interact** with
the `ClaimManagerV3` contract on **Base Mainnet**.

It helps diagnose signature verification issues and provides tools to
analyze the claim mechanism used by the **MBC20 token distribution
system**.

------------------------------------------------------------------------

# 📖 Background

The official **mbc20.xyz Claim button** for the **GPT token** generates
signatures that fail the internal contract verification.

Inside the contract, every `claim()` transaction performs an
`ECDSA.recover()` check.

Because the produced signature **does not recover to the authorized
signer**, the transaction reverts with:

    InvalidSignature

This toolkit was created to help:

-   🔍 Inspect the on-chain state of any wallet
-   🧪 Verify whether a signature is valid
-   🔐 Recreate a correct signature (if the signer key is available)
-   🚀 Execute the `claim()` transaction once a valid signature exists

------------------------------------------------------------------------

# 🧾 Contract Information

  Field                  Value
  ---------------------- ----------------------------------------------
  📜 Contract            `0xFc54307bc86a93Fa1a0aA7DD32c75dc9498c1E8D`
  🌐 Network             Base Mainnet
  ⛓ Chain ID             `8453`
  🧩 Contract Name       `ClaimManagerV3`
  🔑 Authorized Signer   `0x22dA4D6314B863dD7c3a39E6f338c8cF0BEC7d9f`

------------------------------------------------------------------------

# ⚙️ Requirements

Python **3.10+** is recommended.

Install dependencies:

``` bash
pip install web3 eth-account python-dotenv
```

------------------------------------------------------------------------

# 🧰 Toolkit Overview

This toolkit was designed for **smart-contract debugging and signature
analysis**.

It provides functionality to:

  -----------------------------------------------------------------------
  Feature                  Description
  ------------------------ ----------------------------------------------
  🔎 State Inspection      Read claimable amount, claimed tokens and
                           nonce

  ✍️ Signature             Check whether a signature resolves to the
  Verification             authorized signer

  🧪 Signature Recreation  Recreate the expected contract signature
                           format

  🚀 Claim Execution       Send a valid `claim()` transaction to the
                           contract
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 🔐 Signature Verification Logic

The contract generates the message hash using:

``` solidity
bytes32 hash = keccak256(abi.encode(
    msg.sender,
    tick,
    totalAmount,
    nonce,
    block.chainid
));
```

Where:

  Parameter         Description
  ----------------- -------------------------------------------
  `msg.sender`      User wallet address
  `tick`            Token identifier (example: `"GPT"`)
  `totalAmount`     Total allocation in **wei (18 decimals)**
  `nonce`           Value from `nonces[wallet][tickHash]`
  `block.chainid`   Network chain ID

The contract then applies the Ethereum signed message prefix:

    "\x19Ethereum Signed Message:\n32"

This is done using:

``` solidity
MessageHashUtils.toEthSignedMessageHash(hash)
```

Finally the contract checks:

    ECDSA.recover(ethHash, signature) == signer

If the recovered address **does not match the authorized signer**, the
transaction fails.

------------------------------------------------------------------------

# 🐞 Reported Issue

The following wallet was unable to claim tokens due to the invalid
signature bug.

  Field           Value
  --------------- ----------------------------------------------
  👤 Wallet       `0xfEc58763fcd5Df39dD78a454a8304F41209fD1b8`
  🪙 Allocation   **80,901 GPT**
  📊 Claimable    Fully claimable
  ❌ Status       Claim fails due to invalid signature

Example failed transaction:

    0xdeee87f7d6a061e49e3a00cd0ecacf20bf6dcc59c9548649f928ffcbf83e4fd3

Root cause:

The backend service generates a signature that **does not recover to the
authorized signer** `0x22dA4D...`.

------------------------------------------------------------------------

# 🧠 Purpose of This Repository

This repository exists to:

-   Document the **signature verification failure**
-   Provide tools for **smart contract debugging**
-   Help developers **analyze and reproduce the issue**
-   Demonstrate the correct **EIP-191 signing flow**

------------------------------------------------------------------------

# 📜 License

MIT License

Feel free to use, modify, and distribute this toolkit.
