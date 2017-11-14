const CoinMarketCap = require('../models/CoinMarketCap');
const {reduceValues} = require('../utils/fp')

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
    return RawData.find()
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

  getMaxValue(field){
    return new Promise(function(resolve, reject) {
      RawData.findOne().sort({[field]: -1}).exec(
        (err, data) => {
          if(err) reject(err)
          resolve({[field]: data[field]})
        }
      )
    });
  },

  getMaxValues(fields) {
    const promises = fields.map(
      field => this.getMaxValue(field)
    )
    const self = this;
    return new Promise(
      (resolve, reject) => {
        Promise.all(promises).then(
          maxValues => resolve(self.reduceValues(maxValues))
        ).catch(
          err => reject(err)
        )
      }
    )
  },

  getMinValue(field){
    return new Promise(function(resolve, reject) {
      RawData.findOne()
      .where(field).ne(null)
      .sort({[field]: 1}).exec(
        (err, data) => {
          if(err) reject(err)
          resolve({[field]: data[field]})
        }
      )
    });

  },

  getMinValues(fields) {
    const promises = fields.map(
      field => this.getMinValue(field)
    )
    const self = this;
    return new Promise(
      (resolve, reject) => {
        Promise.all(promises).then(
          minValues => resolve(self.reduceValues(minValues))
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
