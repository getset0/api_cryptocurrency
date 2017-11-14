const mongoose = require('mongoose');

const coinMarketCap = new mongoose.Schema({
  id: { type: String, },
  name: { type: String, },
  symbol: { type: String },
  rank: { type: Number},
  price_usd: { type: Number},
  price_btc: { type: Number},
  ['24h_volume_usd']: { type: Number},
  market_cap_usd:  {type: Number},
  available_supply: { type: Number},
  total_supply: { type: Number},
  max_supply: {type: Number},
  percent_change_1h: { type: Number},
  percent_change_24h: { type: Number},
  percent_change_7d: { type: Number},
  last_updated: { type: String },
  request_timestamp: {type: Date},
  created_at: {type: Date, default: Date.now }
});

const RawData = mongoose.model('RawData', coinMarketCap);

module.exports = RawData;
