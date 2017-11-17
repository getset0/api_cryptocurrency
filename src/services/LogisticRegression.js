const coinMarketCapRepository = require('../repositories/CoinMarketCap');

// coins with all keys
// return array of points (time, price) time starts in 0 and each points sums 30
function mountInput(coins) {
    let pointsX = [];
    let pointsY = [];
    for(let i=0; i<coins.length; i++){
        const pointX = [ i*30, coins[i].rank]
        const pointY = [coins[i].price_usd]
        pointsX.push(pointX);
        pointsY.push(pointY);
    }
    const data = {
        x: pointsX,
        y: pointsY 
    }

    return data;
}

function fetchAndMount(id) {
    return new Promise((resolve, reject) => {
        coinMarketCapRepository.getEntriesById(id).then(coins => {
            const points = mountInput(coins);
            resolve(points);
        }).catch(err => reject(err));
    })

}

module.exports = fetchAndMount 