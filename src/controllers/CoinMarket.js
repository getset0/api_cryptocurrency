'use strict';

const coinMarketCapInfo = require("../services/GetNormalizedData");
const answerController = require("./Answer");

const CoinMarket = {
  getNormalizedCoins(req, res) {
    const {limit} = req.params;
    return coinMarketCapInfo(limit)
      .then(data => {
        console.log(data);
        answerController.returnResponseSuccess(res, data)
      })
      .catch(err => answerController.returnResponseError(res, err))
  }
}

module.exports = CoinMarket;