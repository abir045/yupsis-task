function calculateMojoExchange(initialMojos) {
  let mojos = initialMojos;
  let mutkis = 0;
  let totalMojosEaten = 0;
  let step = 1;

  console.log(`Starting with ${initialMojos} Mojos\n`);

  while (mojos > 0 || mutkis >= 3) {
    // Step 1: Eat all available Mojos
    if (mojos > 0) {
      console.log(`Step ${step}: Eat ${mojos} Mojos → Get ${mojos} Mutkis`);
      mutkis += mojos;
      totalMojosEaten += mojos;
      mojos = 0;
      console.log(`Total Mutkis: ${mutkis}`);
      step++;
    }

    // Step 2: Exchange Mutkis for Mojos (3 Mutkis = 1 Mojo)
    if (mutkis >= 3) {
      const mojosFromExchange = Math.floor(mutkis / 3);
      const mutkisUsed = mojosFromExchange * 3;
      const remainingMutkis = mutkis - mutkisUsed;

      console.log(
        `Step ${step}: Exchange ${mutkisUsed} Mutkis → Get ${mojosFromExchange} Mojos`
      );
      console.log(`Remaining Mutkis: ${remainingMutkis}`);

      mojos = mojosFromExchange;
      mutkis = remainingMutkis;
      step++;
    }
  }

  console.log(`\nFinal Result:`);
  console.log(`- Remaining Mojos: ${mojos}`);
  console.log(`- Remaining Mutkis: ${mutkis}`);
  console.log(`- Total Mojos Eaten: ${totalMojosEaten}`);

  return {
    totalMojosEaten,
    remainingMojos: mojos,
    remainingMutkis: mutkis,
  };
}

// result
const result = calculateMojoExchange(14);
