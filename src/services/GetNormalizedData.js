const mathFunctions = require('../math/functions.js');
const coinMarketCapRepository = require('../repositories/CoinMarketCap');

POPULATION_OF_COINS = 1278;

function makeNormalizedToCoinMarketCap(coins, maxValues, minValues) {
  return coins.map(
    coin => {
      return {
        id: coin.id,
        rank: mathFunctions.normalizeRank(coin.rank, POPULATION_OF_COINS),
        price_usd: mathFunctions.commonNormalization('price_usd', coin, maxValues),
        price_btc: mathFunctions.commonNormalization('price_btc', coin, maxValues),
        ['24h_volume_usd']: mathFunctions.commonNormalization('24h_volume_usd', coin, maxValues),
        market_cap_usd: mathFunctions.commonNormalization('market_cap_usd', coin, maxValues),
        available_supply: mathFunctions.commonNormalization('available_supply', coin, maxValues),
        total_supply: mathFunctions.commonNormalization('total_supply', coin, maxValues),
        percent_change_1h: mathFunctions.sigmoidFunction(coin['percent_change_1h']),
        percent_change_24h: mathFunctions.sigmoidFunction(coin['percent_change_1h']),
        percent_change_7d: mathFunctions.sigmoidFunction(coin['percent_change_1h'])
      }
    }
  )
}

function coinMarketCapInfo(limit){
  return new Promise((resolve, reject) => {
    coinMarketCapRepository.getNCoins(limit)
      .then((coins) => {
        const promisses = [coinMarketCapRepository.getMaxValues(), coinMarketCapRepository.getMinValues()];
        Promise.all(promisses).then(maxAndMin => {
          const normalized = makeNormalizedToCoinMarketCap(coins, maxAndMin[0], maxAndMin[1]);
          resolve(normalized)
        })
      })
      .catch(err => reject(err))
  })
}

module.exports = coinMarketCapInfo;