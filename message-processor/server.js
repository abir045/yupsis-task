require("dotenv").config();

const mongoose = require("mongoose");
const { startMessageProcessing } = require("./processors/messageProcessor");
const { startMessageGeneration } = require("./generators/messageGenerator");
const Message = require("./Models/Message");

//get system statistics

async function getSystemStats() {
  const stats = await Message.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        avgAttempts: { $avg: "$attemptCount" },
      },
    },
  ]);
  return stats;
}

//display statistics

async function showStats() {
  console.log(`== system statistics ==`);
  const stats = await getSystemStats();
  console.table(stats);
  console.log("===================================\n");
}

async function initializeSystem() {
  //connect to mongodb
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("connected to mongodb");

  //start processing
  startMessageGeneration(3000);
  startMessageProcessing(5000);

  //periodic stat display
  setInterval(showStats, 30000);
}

async function main() {
  try {
    await initializeSystem();
  } catch (error) {
    console.log(`startup failed`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  initializeSystem,
  getSystemStats,
  showStats,
};
