const mathFunctions = require('../math/functions.js');
const coinMarketCap = require('../repositories/CoinMarketCap');

function makeNormalizedToCoinMarketCap(coins, maxValues, minValues) {
  return coins.map(
    coin => ({
      id: coin.id,
      rank: mathFunctions.normalizeRank(coin.rank, POPULATION_OF_COINS),
      price_usd: mathFunctions.commonNormalization('price_usd', coin, maxValues),
      price_btc: mathFunctions.commonNormalization('price_btc', coin, maxValues),
      ['24h_volume_usd']: mathFunctions.commonNormalization('24h_volume_usd', coin, maxValues),
      market_cap_usd: mathFunctions.commonNormalization('market_cap_usd', coin, maxValues),
      available_supply: mathFunctions.commonNormalization('available_supply', coin, maxValues),
      total_supply: mathFunctions.commonNormalization('total_supply', coin, maxValues),
      percent_change_1h: mathFunctions.sigmoidFunction('percent_change_1h', coin, maxValues, minValues),
      percent_change_24h: mathFunctions.sigmoidFunction('percent_change_24h', coin, maxValues, minValues),
      percent_change_7d: mathFunctions.sigmoidFunction('percent_change_7d', coin, maxValues, minValues)
    })
  )
}

coinMarketCapInfo: (limit) => {
  return new Promise((resolve, reject) => {
    coinMarketCap.getNCoins(limit)
      .then((coins) => {
        console.log(coins);
        resolve(makeNormalizedToCoinMarketCap(coins))
      })
      .catch(err => reject(err))
  })
}

module.exports = coinMarketCapInfo;