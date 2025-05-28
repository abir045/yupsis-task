const Message = require("../Models/Message");

function generateRandomTransaction() {
  return {
    trxId: Math.floor(Math.random() * 1000),
    amount: Math.floor(Math.random() * 991) + 10, // $10-$1000
  };
}

//save message to database

async function saveMessage(transactionData) {
  const message = new Message({
    trxId: transactionData.trxId,
    amount: transactionData.amount,
  });

  await message.save();
  console.log(`New message ${message._id} (${transactionData.trxId})`);
  return message;
}

//generate and save a new message

async function generateMessage() {
  try {
    const transaction = generateRandomTransaction();
    await saveMessage(transaction);
  } catch (error) {
    console.log(`Generation error:`, error);
  }
}

// start continuous message generation

function startMessageGeneration(intervalMS = 3000) {
  setInterval(() => generateMessage(), intervalMS);
}

module.exports = {
  generateRandomTransaction,
  saveMessage,
  generateMessage,
  startMessageGeneration,
};
