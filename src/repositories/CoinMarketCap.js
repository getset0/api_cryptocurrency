const CoinMarketCap = require('../models/CoinMarketCap');
const reduceValue = require('../utils/fp')

const KEYS = [
  "rank",
  "price_usd",
  "price_btc",
  "24h_volume_usd",
  "market_cap_usd",
  "available_supply",
  "total_supply",
  "percent_change_1h",
  "percent_change_24h",
  "percent_change_7d"
];

const coinMarketCap = {
  create(coinMarketCap, commonDate) {
    coinMarketCap.request_timestamp = commonDate;
    const newCoinMarketCap = new CoinMarketCap(coinMarketCap);
    return new Promise(function (resolve, reject) {
      newCoinMarketCap.save((err, savedCoinMarketCap) => {
        if (err) reject(err)
        resolve(savedCoinMarketCap);
      })
    });
  },

  createMultiple(coinMarketCaps) {
    const commonDate = new Date();
    const self = this;
    const promisses = coinMarketCaps.map(coinMarketCap => {
      return self.create(coinMarketCap, commonDate);
    })
    return new Promise(function (resolve, reject) {
      Promise.all(promisses).then(
        response => resolve(response)
      ).catch(
        err => reject(err)
        )
    });
  },

  getNCoins(limit) {
    return CoinMarketCap.find()
      .where('rank').ne(null)
      .where('price_usd').ne(null)
      .where('price_btc').ne(null)
      .where('24h_volume_usd').ne(null)
      .where('market_cap_usd').ne(null)
      .where('available_supply').ne(null)
      .where('total_supply').ne(null)
      .where('percent_change_1h').ne(null)
      .where('percent_change_24h').ne(null)
      .where('percent_change_7d').ne(null)
      .limit(limit);
  },

  getAllTimeStamps() {
    return new Promise(function(resolve, reject) {
        CoinMarketCap.distinct('request_timestamp', (err, result) => {
            if(err) reject(err);
            resolve(result)
          }
      );
    });
  },

  getMaxValue(field) {
    return new Promise(function (resolve, reject) {
      CoinMarketCap.findOne().sort({ [field]: -1 }).exec(
        (err, data) => {
          if (err) reject(err)
          resolve({ [field]: data[field] })
        }
      )
    });
  },

  getMaxValues() {
    const promises = KEYS.map(
      field => this.getMaxValue(field)
    )
    return new Promise(
      (resolve, reject) => {
        Promise.all(promises).then(
          maxValues => {
            //ToDo
            //Put this reduce function on fp
            const reducedData = maxValues.reduce((acc, value) => {
              return Object.assign(acc, value)
            }, {})

            resolve(reducedData)
          }
        ).catch(
          err => reject(err)
          )
      }
    )
  },

  getMinValue(field) {
    return new Promise(function (resolve, reject) {
      CoinMarketCap.findOne()
        .where(field).ne(null)
        .sort({ [field]: 1 }).exec(
        (err, data) => {
          if (err) reject(err)
          resolve({ [field]: data[field] })
        }
        )
    });

  },

  getMinValues() {
    const promises = KEYS.map(
      field => this.getMinValue(field)
    )
    return new Promise(
      (resolve, reject) => {
        Promise.all(promises).then(
          minValues => resolve((values) => {
            return values.reduce((acc, value) => {
              return Object.assign(acc, value)
            }, {})
          })
        ).catch(
          err => reject(err)
          )
      }
    )
  },

  getAll() {
    return CoinMarketCap.find();
  },

  removeAll() {
    this.getAll().then(coinMarketCaps => {
      coinMarketCaps.forEach(function (element) {
        console.log(element);
        return element.remove()
      }, this);
    })
  },

}

module.exports = coinMarketCap;
