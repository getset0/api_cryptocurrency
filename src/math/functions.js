const MathFunctions = {
  normalizeRank(rank, totalCoins) {
    return 1 - (rank / totalCoins);
  },
  commonNormalization(field, coin, maxValues) {
    return coin[field] / maxValues[field];
  },

  //https://en.wikipedia.org/wiki/Sigmoid_function
  sigmoidFunction(x) {
    return 1 / (1 + Math.exp(x));
  },

  //https://datascience.stackexchange.com/questions/5885/how-do-i-normalize-an-array-of-positive-and-negative-numbers-so-they-are-between
  normalizePercentChange(field, coin, maxValues, minValues) {
    return (coin[field] - minValues[field]) / (maxValues[field] - minValues[field])
  }
}

module.exports = MathFunctions;
