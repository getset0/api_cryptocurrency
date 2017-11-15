'use strict';

const coinMarketCapInfo = require("../services/GetNormalizedData");
const coinMarketRepo = require("../repositories/CoinMarketCap");
const answerController = require("./Answer");

const CoinMarket = {
  getNormalizedCoins(req, res) {
    console.log('got here');
    const limit = parseInt(req.params.limit);
    return coinMarketCapInfo(limit)
      .then(data => {
        console.log('got haa');
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
  }
}

module.exports = CoinMarket;
