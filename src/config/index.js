const DB_URL = require('./db.js');
const API_URL = (start,limit) => `https://api.coinmarketcap.com/v1/ticker/?start=${start}&limit=${limit}`;
const SERVER_PORT = 3743;
module.exports = {API_URL, DB_URL, SERVER_PORT}
