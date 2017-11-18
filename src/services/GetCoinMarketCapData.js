const mathFunctions = require('../math/functions.js');
const coinMarketCapRepository = require('../repositories/CoinMarketCap');
const json2csv = require('json2csv');
const fs = require('fs');

POPULATION_OF_COINS = 1278;

const KEYS = [
  "rank",
  "price_usd",
  "24h_volume_usd",
  "market_cap_usd",
  "available_supply",
  "total_supply",
  "percent_change_1h",
  "percent_change_24h",
  "percent_change_7d",
  "price_btc",
]

function makeNormalizedToCoinMarketCap(coins, maxValues, minValues) {
  return coins.map(
    coin => {
      return {
        id: coin.id,
        rank: mathFunctions.normalizeRank(coin.rank, POPULATION_OF_COINS),
        price_usd: mathFunctions.sigmoidFunction(coin['price_usd']),
        price_btc: mathFunctions.sigmoidFunction(coin['price_btc']),
        ['24h_volume_usd']: mathFunctions.sigmoidFunction(coin['24h_volume_usd']),
        market_cap_usd: mathFunctions.sigmoidFunction(coin['market_cap_usd']),
        available_supply: mathFunctions.sigmoidFunction(coin['available_supply']),
        total_supply: mathFunctions.sigmoidFunction(coin['total_supply']),
        percent_change_1h: mathFunctions.sigmoidFunction(coin['percent_change_1h']),
        percent_change_24h: mathFunctions.sigmoidFunction(coin['percent_change_24h']),
        percent_change_7d: mathFunctions.sigmoidFunction(coin['percent_change_7d'])
      }
    }
  )
}

function getAllCoinsWithLimit(limit) {
  return new Promise((resolve, reject) => {
    coinMarketCapRepository.getNCoins(limit)
      .then((coins) => {
        const promisses = [coinMarketCapRepository.getMaxValues(), coinMarketCapRepository.getMinValues()];
        Promise.all(promisses).then(maxAndMin => {
          const normalized = makeNormalizedToCoinMarketCap(coins, maxAndMin[0], maxAndMin[1]);
          resolve(normalized)
        }).catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

function getValuesAndGenerateCSVFile(id) {
  return new Promise((resolve, reject) => {
    coinMarketCapRepository.getEntriesById(id)
      .then((coinsOnTime) => {
        const googleSpreadData = mountAndGenerateCsv(coinsOnTime)
        resolve(googleSpreadData)
      })
      .catch(err => reject(err))
  })
}

function mountAndGenerateCsv(coins) {
  var csv = json2csv({ data: coins, fields: KEYS, del: "\t" });

  const fileName = coins[0].id;

  fs.writeFile(`${fileName}.csv`, csv, function (err) {
    if (err) throw err;
    console.log('file saved');
  });

  return csv;
}

function getAllTimeStamps() {
  return coinMarketCapRepository.getAllTimeStamps();
}

function getEntriesById(id) {
  return coinMarketCapRepository.getEntriesById(id);
}

function getEntriesByIdNormalized(id) {
  return new Promise((resolve, reject) => {
    coinMarketCapRepository.getEntriesById(id).then(coinsOnTime => {
      coinMarketCapRepository.getMaxValues(id).then(maxValues => {
        const normalizedData = makeNormalizedToCoinMarketCap(coinsOnTime, maxValues)
        resolve(normalizedData);
      }) 
    })    
  })
}

module.exports = {
  getAllCoinsWithLimit,
  getValuesAndGenerateCSVFile,
  getAllTimeStamps,
  getEntriesById,
  getEntriesByIdNormalized,
};