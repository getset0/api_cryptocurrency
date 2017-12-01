'use strict';

const { getAllCoinsWithLimit, getValuesAndGenerateCSVFile, getAllTimeStamps, getEntriesById, getEntriesByIdNormalized } = require("../services/GetCoinMarketCapData");
const coinMarketRepo = require("../repositories/CoinMarketCap");
const answerController = require("./Answer");
const hcluster = require("../math/hcluster");

const CoinMarket = {

  // get all types of coins with a limited number
  getAllCoinsWihtLimit(req, res) {
    const limit = parseInt(req.params.limit);
    return getAllCoinsWithLimit(limit)
      .then(data => {
        return answerController.returnResponseSuccess(res, data)
      })
      .catch(err => {
        console.log(err)
        return answerController.returnResponseError(res, err)
      })
  },

  // get all timestamps of all coins
  getTimestamps(req, res) {
    return getAllTimeStamps()
      .then(
      data => answerController.returnResponseSuccess(res, data)
      )
      .catch(
      err => answerController.returnResponseError(res, err)
      )
  },

  // get all timestamps of the same coin
  getById(req, res) {
    const { id } = req.params;
    return getEntriesById(id)
      .then(data => answerController.returnResponseSuccess(res, data))
      .catch(err => answerController.returnResponseError(res, err))
  },

  getByIdNormalized(req, res) {
    const { id } = req.params;
    return getEntriesByIdNormalized(id)
      .then(data => answerController.returnResponseSuccess(res, data))
      .catch(err => answerController.returnResponseError(res, err))
  },

  // mount data in csv file and also generate a csv file
  getValuesAndGenerateCSVFile(req, res) {
    const { id } = req.params;
    return getValuesAndGenerateCSVFile(id).then(resp => {
      answerController.returnResponseSuccess(res, resp);
    }).catch(err => answerController.returnResponseError(res, err))
  },

  postBlock(req, res) {
    const { timestamp, algorithm } = req.body;
    if (!timestamp) {
      return answerController.returnResponseError(res, "Timestamp field can't be blank");
    }
    return coinMarketRepo.getEntriesByTimestamp(timestamp)
        .then(
          data => {
            const newData = data.map(coin => ({
              id: coin.id,
              vars: [coin.price_usd, coin.percent_change_7d, coin.market_cap_usd]
            }))
            // console.log(data.length);
            // answerController.returnResponseSuccess(res, data)
            const colorCluster = hcluster()
              .distance('euclidean') // support for 'euclidean' and 'angular'
              .linkage('avg')        // support for 'avg', 'max' and 'min'
              .posKey('vars')    // 'position' by default
              .data(newData.slice(1,300))

        answerController.returnResponseSuccess(res, colorCluster.tree())

      }
      )
      .catch(
      err => answerController.returnResponseError(res, err)
      )

  }

}

module.exports = CoinMarket;
