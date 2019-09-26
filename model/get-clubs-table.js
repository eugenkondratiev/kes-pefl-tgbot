const dbPool = require('./connection-pool');
const dbQuery = require('./db').dbQuery;
const ID = 0;

module.exports = function() {
  return new Promise((res,rej) => {
    dbQuery('SELECT * FROM Yu6lr7ef8O.clubs;')
    .then(result => {
        global.clubsBase = []; 
        // console.log(result);
        try {
            result.rows.forEach(function(row, i, arr) {
                const clubId = parseInt(row[ID]);
                global.clubsBase[clubId] = row;
        }); ;
        } catch (error) {
            console.log(error);
            rej();
        }

    })

    .catch(err => {
        console.log("get Clubs error - ", err); 
        rej();
    })
    .then( ()=> {
        // console.log(clubsBase, clubsBase.length);
        global.nationBase = [];
        return dbQuery('SELECT * FROM Yu6lr7ef8O.nations_short;');
    })
    .then((nations) => {
        nations.rows.forEach(nation => {
            nationBase[nation[ID]] = nation;
        })
        res(nationBase)
        // console.log(nationBase);
    })
    .catch(err => {
        console.log("get Nations error - ", err);
        rej();
    });
  })  


}
    