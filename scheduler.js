
  const schedule = require('node-schedule');
  const getPlayers = require('./model/get-players-table.js');
  const getClubs = require('./model/get-clubs-table.js');
 const dbQuery = require('./model/db').dbQuery; 

  const ruleEveryID = {hour: 6, minute: 5, second: 14, dayOfWeek: [ 0, 2, 4, 6]};
 //const ruleEveryID = {hour: [6, 11], minute: 5, second: 14, dayOfWeek: [ 0, 2, 4, 6]};
  // const ruleEveryID = {hour: [11, 13], minute: [27 , 31], second: 14, dayOfWeek: [1, 2, 4, 5, 6]};
 
 const ruleEveryHour = {minute: 1, second: 4};

  module.exports = function() {
	const schDbPing = schedule.scheduleJob(ruleEveryHour, async function(){
     try {
      await dbQuery("SELECT 1");

     } catch (error) {
       console.log(error);
       const logRecord = new Date() + "  DbPing - error " + error.message + "\n";
            require('fs').appendFile("./data/actionlog.txt", logRecord, err=>{if (err) console.error(err)});
     } 

    });
    const schGetPlayers = schedule.scheduleJob(ruleEveryID, async function(){
      console.log(new Date(), 'Get players');
     try {
      await getPlayers();
      await getClubs();  

     } catch (error) {
       console.log(error);
       const logRecord = new Date() + "  Get players - error " + error.message + "\n";
            require('fs').appendFile("./data/actionlog.txt", logRecord, err=>{if (err) console.error(err)});
     } 

      // j.cancel();
    });
  }

