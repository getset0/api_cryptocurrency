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
app.get('/coinmarket/timestamps', coinMarketController.getTimestamps)
app.get('/coinmarket/normalized-coins/:limit', coinMarketController.getAllCoinsWihtLimit)
app.post('/coinmarket/block', coinMarketController.postBlock)
app.get('/coinmarket/all-timestamps/:id', coinMarketController.getById)
app.get('/coinmarket/all-timestamps/normalized/:id', coinMarketController.getByIdNormalized)
app.get('/coinmarket/csv-values/:id', coinMarketController.getValuesAndGenerateCSVFile);

app.listen(SERVER_PORT, () => console.log(`Server started on ${SERVER_PORT}`) );
