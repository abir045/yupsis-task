const RETRY_DELAYS = {
  1: 2 * 60 * 1000,
  2: 5 * 60 * 1000,
  3: 10 * 60 * 1000, //10 minutes
  4: 20 * 60 * 1000,
  5: 30 * 60 * 1000,
  default: 60 * 60 * 1000, //60 minutes
};

function getRetryDelay(attemptCount) {
  return RETRY_DELAYS[attemptCount] || RETRY_DELAYS.default;
}

module.exports = { getRetryDelay, RETRY_DELAYS };
