const Conversions = {
  tons: 1000000000,
  kilograms: 1000000,
  grams: 1000,
  milligrams: 1,
};

// function to convert to milligrams

function toMilligrams(stock) {
  let totalMg = 0;
  for (const [unit, quantity] of Object.entries(stock)) {
    totalMg += quantity * Conversions[unit];
  }

  return totalMg;
}

// convert total milligrams back to normal units

function fromMilligrams(totalMg) {
  if (totalMg < 0) {
    throw new Error("stock cn not be negative");
  }

  const tons = Math.floor(totalMg / 1000000000);

  let remaining = totalMg % 1000000000;

  const kilograms = Math.floor(remaining / 1000000);

  remaining = remaining % 1000000;

  const grams = Math.floor(remaining / 1000);

  const milligrams = remaining % 1000;

  return {
    tons: tons,
    kilograms: kilograms,
    grams: grams,
    milligrams: milligrams,
  };
}

function updateStock(currentStock, changeQuantity, operation) {
  const currentMg = toMilligrams(currentStock);
  const updatedMg = toMilligrams(changeQuantity);

  let newTotalMg;

  if (operation.toLowerCase() === "purchase") {
    newTotalMg = currentMg + updatedMg;
  } else if (operation.toLowerCase() === "sell") {
    newTotalMg = currentMg - updatedMg;
    if (newTotalMg < 0) {
      throw new Error("Insufficient stock for sale");
    }
  } else {
    throw new Error("operation must be 'purchase' or 'sell' ");
  }

  return fromMilligrams(newTotalMg);
}

function displayStock(stock) {
  const units = ["tons", "kilograms", "grams", "milligrams"];
  const parts = units
    .filter((unit) => stock[unit] > 0)
    .map((unit) => `${stock[unit]} ${unit}`);

  return parts.length > 0 ? parts.join(", ") : "0 milligrams";
}

function testInventoryManagement() {
  console.log("=== inventory management test ====\n");

  //initial stock: 1 ton
  const initialStock = { tons: 1, kilograms: 0, grams: 0, milligrams: 0 };
  console.log(`Initial stock ${displayStock(initialStock)}`);

  //sell 1 gram
  const saleQuantity = { tons: 0, kilograms: 0, grams: 10, milligrams: 0 };
  const afterSale = updateStock(initialStock, saleQuantity, "sell");
  console.log(`After selling ${displayStock(afterSale)}`);
  console.log(
    `In milligrams: ${toMilligrams(afterSale).toLocaleString()} mg\n`
  );

  // Purchase 1001 grams
  const purchaseQuantity = {
    tons: 0,
    kilograms: 0,
    grams: 1,
    milligrams: 0,
  };
  const afterPurchase = updateStock(afterSale, purchaseQuantity, "purchase");
  console.log(`After purchasing ${displayStock(purchaseQuantity)}:`);
  console.log(`Final stock: ${displayStock(afterPurchase)}`);
  console.log(
    `In milligrams: ${toMilligrams(afterPurchase).toLocaleString()} mg\n`
  );

  // Verify the results match expected output
  console.log("=== Verification ===");
  console.log(`After sale result:`, afterSale);
  console.log(`Expected: {tons: 0, kilograms: 999, grams: 999, milligrams: 0}`);
  console.log(`After purchase result:`, afterPurchase);
}

console.log("Starting Inventory Management System...\n");
testInventoryManagement();
