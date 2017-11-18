'use strict';

const {fetchAndMount, getDataForGoogleSpreadsheet}  = require("../services/GetNormalizedData");
const coinMarketRepo = require("../repositories/CoinMarketCap");
const answerController = require("./Answer");
const hcluster = require("../math/hcluster");

const CoinMarket = {
  getNormalizedCoins(req, res) {
    const limit = parseInt(req.params.limit);
    return coinMarketCapInfo(limit)
      .then(data => {
        return answerController.returnResponseSuccess(res, data)
      })
      .catch(err => {
        console.log(err)
        return answerController.returnResponseError(res, err)
      })
  },

  getTimestamps(req, res) {
    return coinMarketRepo.getAllTimeStamps()
      .then(
        data => answerController.returnResponseSuccess(res, data)
      )
      .catch(
        err => answerController.returnResponseError(res, err)
      )
  },
  
  getById(req, res) {
    const {id} = req.params;
    return coinMarketRepo.getEntriesById(id)
      .then(
        data => answerController.returnResponseSuccess(res, data)
      )
      .catch(
        err => answerController.returnResponseError(res, err)
      )
  },

  getValuesForGoogleSpreadsheet(req, res){
    const {id} = req.params;
    return getDataForGoogleSpreadsheet(id).then(resp => {
      answerController.returnResponseSuccess(res, resp);
    }).catch(err => answerController.returnResponseError(res, err))
  },

  getTimePricePoints(req, res) {
    const {id} = req.params;
    return fetchAndMount(id).then(resp => {
      answerController.returnResponseSuccess(res, resp);
    }).catch(err => answerController.returnResponseError(res, err))
  },

  postBlock(req, res) {
    const {timestamp, algorithm} = req.body;
    if(!timestamp) {
      return answerController.returnResponseError(res, "Timestamp field can't be blank");
    }
    return coinMarketRepo.getEntriesByTimestamp(timestamp)
        .then(
          data => {
            const newData = data.map(coin => ({
              id: coin.id,
              vars: [coin.price_usd, coin.percent_change_7d]
            }))
            // console.log(data.length);
            // answerController.returnResponseSuccess(res, data)
            const colorCluster = hcluster()
              .distance('euclidean') // support for 'euclidean' and 'angular'
              .linkage('avg')        // support for 'avg', 'max' and 'min'
              .posKey('vars')    // 'position' by default
              .data(newData.slice(1000,1270))

            answerController.returnResponseSuccess(res, colorCluster.tree())

          }
        )
        .catch(
          err => answerController.returnResponseError(res, err)
        )

    }

}

module.exports = CoinMarket;
