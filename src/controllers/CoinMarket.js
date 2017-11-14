'use strict';

const coinMarketCapInfo = require("../services/GetNormalizedData");
const answerController = require("./Answer");

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
  }
}

module.exports = CoinMarket;