const coinMarketCapRepository = require('../repositories/CoinMarketCap');
var jsregression = require('js-regression');

// === Create the linear regression === // 
var logistic = new jsregression.LogisticRegression({
  alpha: 0.001,
  iterations: 1000,
  lambda: 0.0
});
// can also use default configuration: var logistic = new jsregression.LogisticRegression();  

// coins with all keys
// return array of points (time, price) time starts in 0 and each points sums 30
function mountInput(coins) {
  let allInputsAndOutputs = [];
  for (let i = 0; i < coins.length; i++) {
    const inputAndOutput = [i , coins[i].rank, coins[i].price_usd]
    allInputsAndOutputs.push(inputAndOutput);
  }

  return allInputsAndOutputs;
}

function fetchAndMount(id) {
  return new Promise((resolve, reject) => {
    coinMarketCapRepository.getEntriesById(id).then(coins => {
      const points = mountInput(coins);
      const pointsTest = points[points.length-1];
      console.log(pointsTest)
      
      runLogisticRegression(points, pointsTest)
      resolve(points);
    }).catch(err => reject(err));
  })
}

function runLogisticRegression(trainingData, arrTest) {
  console.log(arrTest)
  // === Create the linear regression === // 
  var regression = new jsregression.LinearRegression({
    alpha: 0.001, //  
    iterations: 300,
    lambda: 0.001
  });
  // can also use default configuration: var regression = new jsregression.LinearRegression();  

  console.log(trainingData)
  // === Train the logistic regression === // 
  var model = logistic.fit(trainingData);

  // === Print the trained model === // 
  console.log(model);


  console.log(arrTest[0])
  const predicted = regression.transform([218, 34]);
  console.log("Predicted: " + predicted +"\n");
  console.log("Expected: " + arrTest[2] +"\n");
  // === Testing the trained linear regression === // 
  // var testingData = [];
  // for (var x = 1.0; x < 100.0; x += 1.0) {
  //   var actual_y = 2.0 + 5.0 * x + 2.0 * x * x + Math.random() * 1.0;
  //   var predicted_y = regression.transform([x, x * x]);
  //   console.log("actual: " + actual_y + " predicted: " + predicted_y);
  // }
}

module.exports = fetchAndMount 