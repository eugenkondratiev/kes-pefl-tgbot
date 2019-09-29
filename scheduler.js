
  const schedule = require('node-schedule');
  const getPlayers = require('./model/get-players-table.js');
  const getClubs = require('./model/get-clubs-table.js');
   
  const ruleEveryID = {hour: [3,23], minute: 50, second: 14, dayOfWeek: [2, 4, 6]};
 
 
  module.exports = function() {
    const schGetPlayers = schedule.scheduleJob(ruleEveryID, async function(){
      console.log(new Date(), 'Get players');
     try {
      await getPlayers();
      await getClubs();  

     } catch (error) {
       console.log(error)
     } 

      // j.cancel();
    });
  }

