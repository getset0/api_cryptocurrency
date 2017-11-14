const DB_URL = (dbuser, dbpassword) => `mongodb://${dbuser}:${dbpassword}@ds155315.mlab.com:55315/cryptos`

module.exports = DB_URL;
