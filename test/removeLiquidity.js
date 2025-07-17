const { ethers } = require("ethers");

// Configuration
const providerUrl = "https://nova.arbitrum.io/rpc"; // Arbitrum Nova RPC
const privateKey = "YOUR_PRIVATE_KEY"; // Replace with your wallet private key
const routerAddress = "0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f"; // Uniswap V2 Router
const tokenAddress = "TOKEN_ADDRESS"; // Replace with the token address from the pair
const liquidity = "LIQUIDITY_AMOUNT"; // Replace with the amount of liquidity tokens to remove
const amountTokenMin = "MIN_TOKEN_AMOUNT"; // Replace with minimum acceptable token amount
const amountETHMin = "MIN_ETH_AMOUNT"; // Replace with minimum acceptable ETH amount
const to = "YOUR_WALLET_ADDRESS"; // Replace with your wallet address
const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

// Uniswap V2 Router ABI (subset relevant for removeLiquidityETH)
const routerAbi = [
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "liquidity", "type": "uint256"},
      {"internalType": "uint256", "name": "amountTokenMin", "type": "uint256"},
      {"internalType": "uint256", "name": "amountETHMin", "type": "uint256"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "removeLiquidityETH",
    "outputs": [
      {"internalType": "uint256", "name": "amountToken", "type": "uint256"},
      {"internalType": "uint256", "name": "amountETH", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function removeLiquidity() {
  try {
    // Set up provider and signer
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Connect to Uniswap V2 Router contract
    const router = new ethers.Contract(routerAddress, routerAbi, wallet);

    // Approve liquidity tokens if necessary (ensure the pair contract is approved)
    // Note: You may need to approve the router to spend your liquidity tokens
    // This step is skipped here; ensure approval is done separately if needed

    // Call removeLiquidityETH
    const tx = await router.removeLiquidityETH(
      tokenAddress,
      ethers.utils.parseUnits(liquidity, 18), // Adjust decimals if needed
      ethers.utils.parseUnits(amountTokenMin, 18), // Adjust decimals if needed
      ethers.utils.parseUnits(amountETHMin, 18), // Adjust decimals if needed
      to,
      deadline,
      { gasLimit: 300000 } // Adjust gas limit as needed
    );

    console.log("Transaction sent:", tx.hash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Amounts received:", {
      amountToken: ethers.utils.formatUnits(receipt.events[receipt.events.length - 1].args.amountToken, 18),
      amountETH: ethers.utils.formatUnits(receipt.events[receipt.events.length - 1].args.amountETH, 18)
    });

  } catch (error) {
    console.error("Error removing liquidity:", error);
  }
}

// Execute the function
removeLiquidity();
