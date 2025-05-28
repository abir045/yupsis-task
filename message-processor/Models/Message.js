const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  trxId: { type: Number, required: true },
  amount: { type: Number, require: true },
  status: {
    type: String,
    enum: ["pending", "success", "rejected"],
    default: "pending",
  },
  attemptCount: { type: Number, default: 0 },
  nextAttemptAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: { type: Date, default: Date.now },
  lastProcessedAt: Date,
  errorMessage: String,
});

//efficient querying index
messageSchema.index({ status: 1, nextAttemptAt: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
