// Simulated in-memory DB
const payments = [];

let isProcessing = false;

const RETRY_DELAYS = {
  1: 2 * 1000, // 2 sec for demo
  2: 4 * 1000, // 4 sec
  3: 6 * 1000,
  4: 8 * 1000,
  5: 10 * 1000,
  default: 15 * 1000,
};

// Generate a fake payment transaction
function generateMessage() {
  const trxId = Math.floor(Math.random() * 1000);
  const amount = Math.floor(Math.random() * 991) + 10;

  payments.push({
    id: crypto.randomUUID(),
    trxId,
    amount,
    status: "pending",
    attemptCount: 0,
    createdAt: new Date(),
    nextAttemptAt: new Date(),
    lastProcessedAt: null,
    errorMessage: null,
  });

  console.log(`💳 New message created: trxId=${trxId}, amount=$${amount}`);
}

// Simulated validation (trxId must match random number)
function validateTransaction(trxId) {
  const rand = Math.floor(Math.random() * 1000);
  console.log(`Validating trxId: ${trxId} vs random: ${rand}`);
  return trxId === rand;
}

// Find the next eligible message (FIFO)
function getNextMessage() {
  const now = new Date();
  return payments.find(
    (msg) =>
      msg.status === "pending" ||
      (msg.status === "rejected" && msg.nextAttemptAt <= now)
  );
}

// Handle success
function handleSuccess(message) {
  message.status = "success";
  message.lastProcessedAt = new Date();
  console.log(`✅ SUCCESS: trxId=${message.trxId}`);
}

// Handle failure and set retry
function handleFailure(message) {
  message.status = "rejected";
  message.attemptCount += 1;
  message.lastProcessedAt = new Date();

  const delay = RETRY_DELAYS[message.attemptCount] || RETRY_DELAYS.default;
  message.nextAttemptAt = new Date(Date.now() + delay);
  message.errorMessage = `Validation failed, retrying in ${delay / 1000}s`;

  console.log(
    `❌ FAILURE: trxId=${message.trxId}, attempt=${message.attemptCount}`
  );
}

// Core processing loop
function processNextMessage() {
  if (isProcessing) return;

  isProcessing = true;

  const message = getNextMessage();

  if (!message) {
    console.log("📭 No messages to process right now.");
    isProcessing = false;
    return;
  }

  console.log(`🔄 Processing: trxId=${message.trxId}`);

  const isValid = validateTransaction(message.trxId);
  if (isValid) {
    handleSuccess(message);
  } else {
    handleFailure(message);
  }

  isProcessing = false;
}

// Print stats
function showStats() {
  const stats = payments.reduce((acc, msg) => {
    acc[msg.status] = (acc[msg.status] || 0) + 1;
    return acc;
  }, {});
  console.log("📊 Current Stats:", stats);
}

// Intervals
setInterval(generateMessage, 3000); // Generate every 3s
setInterval(processNextMessage, 2000); // Try processing every 2s
setInterval(showStats, 10000); // Show stats every 10s
