const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const secrets = require('./src/config/secrets.js');
const configs = require('./src/config');
const coinMarketController = require('./src/controllers/CoinMarket');

//TODO: set credentials as ENV variables
const {DB_USER, DB_PASSWORD} = secrets;
const {DB_URL, SERVER_PORT} = configs;
mongoose.connect(DB_URL(DB_USER, DB_PASSWORD), {useMongoClient: true});
mongoose.Promise = global.Promise;

// -> START SERVER
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*
 * Routes
 */
app.get('/all/:limit', (req, res) => {
    rawData.getAll(parseInt(req.params.limit)).then(
      (data) => {
        res.json(data)
      }
    )
  })
  
  app.get('/max-values', (req, res) => {
    const fields = KEYS_INPUT.concat(KEYS_OUTPUT);
    rawData.getMaxValues(fields).then(
      (data) => res.json(data)
    )
  })
  
  app.get('/min-values', (req, res) => {
    const fields = KEYS_INPUT.concat(KEYS_OUTPUT);
    rawData.getMinValues(fields).then(
      (data) => res.json(data)
    )
  })
  
app.get('/coinmakert/normalized-coins', coinMarketController.getNormalizedCoins)

app.listen(SERVER_PORT, () => console.log(`Server started on ${SERVER_PORT}`) );
