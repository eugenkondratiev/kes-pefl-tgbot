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
            const logRecord = new Date() + "  global.playersBase - " + global.playersBase.length + "\n\r";
            console.log(logRecord);
            require('fs').appendFile("./data/actionlog.txt", logRecord, err=>{if (err) console.error(err)});

        ; 
        } catch (error) {
            console.log(error);
            const logRecord = new Date() + "  global.playersBase - error " + error + "\n\r";
            require('fs').appendFile("./data/actionlog.txt", logRecord, err=>{if (err) console.error(err)});

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
    