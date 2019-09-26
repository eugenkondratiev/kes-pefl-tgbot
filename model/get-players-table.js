const dbPool = require('./connection-pool');
const dbQuery = require('./db').dbQuery;
const ID = 0;

module.exports = function() {
  return new Promise((res,rej) => {
    dbQuery('SELECT * FROM Yu6lr7ef8O.players;')
    .then(result => {
        global.playersBase = []; 
        // console.log(result);
        try {
            result.rows.forEach(function(row, i, arr) {
                const playerRecord = [].concat(row);
                playerRecord.shift();
                global.playersBase.push(playerRecord);
                res(playersBase)
        }); 
        // console.log(global.playersBase);
        } catch (error) {
            console.log(error);
            rej();
        }

    })

    .catch(err => {
        console.log("get players error - ", err); 
        // dbPool.end()
        rej();
    })
  })  


    // .then(() => {dbPool.end()})
    // .catch(err => {
    //         console.log("End DB error - ", err);
    //         // dbPool.end()
    //     });

}
    