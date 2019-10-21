const dbPool = require('./connection-pool')();
const dbQuery = require('./db').dbQuery;
const ID = 0;

module.exports = function() {
  return new Promise((res,rej) => {
    dbQuery('SELECT * FROM pefl.players;')
    .then(result => {
        global.playersBase = []; 
        try {
            result.rows.forEach(function(row, i, arr) {
                const playerRecord = [].concat(row);
                playerRecord.shift();
                global.playersBase.push(playerRecord);

              })

            res(playersBase);
            console.log(new Date(),"  global.playersBase - ", global.playersBase.length);
        ; 
        } catch (error) {
            console.log(error);
            rej(error);
        }

    })

    .catch(err => {
        console.log("get players error - ", err); 
        // dbPool.end()
        rej(err);
    })
  })  




}
    