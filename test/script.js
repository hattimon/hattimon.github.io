async function swapTokens() {
  const lang = localStorage.language || "en";

  // Sprawdzenie, czy wszystkie wymagane obiekty są dostępne
  if (!routerContract || !tokenAContract || !tokenBContract || !signer) {
    console.error("Missing required objects:", {
      routerContract: !!routerContract,
      tokenAContract: !!tokenAContract,
      tokenBContract: !!tokenBContract,
      signer: !!signer
    });
    showError(translations[lang].error_connect_wallet);
    return;
  }

  const direction = document.getElementById("swapDirection").value;
  let percent = parseFloat(document.getElementById("swapPercent").value);
  const amountOutMin = document.getElementById("swapAmountOutMin").value;

  // Walidacja procentu
  if (isNaN(percent) || percent < 1 || percent > 100) {
    showError(translations[lang].error_invalid_percent);
    return;
  }

  try {
    showLoadingToast("loading_swap");

    // Określenie tokenów wejściowego i wyjściowego
    const tokenIn = direction === "AtoB" ? tokenAContract : tokenBContract;
    const tokenOut = direction === "AtoB" ? tokenBContract : tokenAContract;
    const tokenInAddress = direction === "AtoB" ? tokenAAddress : tokenBAddress;
    const tokenOutAddress = direction === "AtoB" ? tokenBAddress : tokenAAddress;

    // Sprawdzenie, czy tokenIn ma metodę allowance
    if (typeof tokenIn.allowance !== 'function') {
      console.error("tokenIn does not have allowance method:", tokenIn);
      showError("Invalid token contract: Missing allowance method");
      return;
    }

    // Pobranie salda
    const balance = await tokenIn.balanceOf(account).catch(error => {
      console.error("Error fetching balance:", error);
      throw new Error("Failed to fetch balance: " + error.message);
    });

    if (balance === 0n) {
      showError(translations[lang].error_insufficient_balance);
      return;
    }

    const amountIn = balance * BigInt(Math.floor(percent * 100)) / BigInt(10000);
    console.log("Amount to swap:", ethers.formatUnits(amountIn, 18));

    // Sprawdzenie i zatwierdzenie allowance
    const allowance = await tokenIn.allowance(account, routerContract.target).catch(error => {
      console.error("Error fetching allowance:", error);
      throw new Error("Failed to fetch allowance: " + error.message);
    });

    if (allowance < amountIn) {
      console.log("Approving token:", ethers.formatUnits(amountIn, 18));
      const txApprove = await tokenIn.approve(routerContract.target, amountIn, { gasLimit: 100000 });
      const approveReceipt = await txApprove.wait();
      console.log("Approval transaction confirmed:", approveReceipt.hash);
      showToast(`Token approval confirmed: ${approveReceipt.hash}`);
    } else {
      console.log("Allowance sufficient:", ethers.formatUnits(allowance, 18));
    }

    // Przygotowanie ścieżki i parametrów swapu
    const path = [tokenInAddress, tokenOutAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    console.log("Swap parameters:", {
      amountIn: ethers.formatUnits(amountIn, 18),
      amountOutMin: amountOutMin || "0",
      path,
      to: account,
      deadline
    });

    // Wykonanie swapu
    const tx = await routerContract.swapExactTokensForTokens(
      amountIn,
      ethers.parseUnits(amountOutMin || "0", 18),
      path,
      account,
      deadline,
      { gasLimit: 300000 }
    );
    console.log("Swap transaction sent:", tx.hash);
    showToast(`Swap transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log("Swap transaction confirmed in block:", receipt.blockNumber);
    showToast(`Swap completed in block ${receipt.blockNumber}`);
    await updateBalances();
  } catch (error) {
    console.error("Swap error:", error);
    showError(translations[lang].error_swap_failed + " " + error.message);
  } finally {
    hideLoadingToast();
  }
}
