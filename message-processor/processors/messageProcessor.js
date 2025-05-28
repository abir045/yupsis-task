const Message = require("../Models/Message");
const { getRetryDelay } = require("../utils/retryConfig");

let isProcessing = false;

//FIFO message retrieval

async function getNextMessage() {
  const now = new Date();
  return await Message.findOne({
    $or: [
      { status: "pending" },
      { status: "rejected", nextAttemptAt: { $lte: now } },
    ],
  }).sort({ createdAt: 1 });
}

//transaction validation

function validateTransaction(trxId) {
  const randomNumber = Math.floor(Math.random() * 1000);
  console.log(`validating trxId: ${trxId} vs random: ${randomNumber}`);
  return trxId === randomNumber;
}

//mock post-success function

async function netFeeCustomerRecharge(message) {
  console.log(`Recharge : ID ${message.trxId}, AMount: ${message.amount}  `);
}

//success handler

async function handleSuccess(message) {
  message.status = "success";
  message.lastProcessedAt = new Date();
  await message.save();

  console.log(`success: ${message._id}`);
  await netFeeCustomerRecharge(message);
}

//failure handler with retry logic

async function handleFailure(message, error = null) {
  message.attemptCount += 1;
  message.status = "rejected";
  message.lastProcessedAt = new Date();
  const retryDelay = getRetryDelay(message.attemptCount);
  message.nextAttemptAt = new Date(Date.now() + retryDelay);

  if (error) message.errorMessage = error.message;

  await message.save();

  console.log(`failed: ${message._id} (attempt ${message.attemptCount})`);
}

//main processing loop

async function processNextMessage() {
  if (isProcessing) return;

  isProcessing = true;

  try {
    const message = await getNextMessage();

    if (!message) {
      console.log("no messages to process");
      return;
    }

    console.log(`processing : ${message._id} (${message.trxId})`);
    const isValid = validateTransaction(message.trxId);

    if (isValid) {
      await handleSuccess(message);
    } else {
      await handleFailure(message);
    }
  } catch (error) {
    console.log(`processing error`, error);
  } finally {
    isProcessing = false;
  }
}

function startMessageProcessing(intervalMS = 50000) {
  setInterval(() => processNextMessage(), intervalMS);
}

module.exports = {
  processNextMessage,
  startMessageProcessing,
  getNextMessage,
  validateTransaction,
  handleSuccess,
  handleFailure,
  netFeeCustomerRecharge,
};
