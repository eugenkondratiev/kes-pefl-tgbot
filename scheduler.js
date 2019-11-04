
  const schedule = require('node-schedule');
  const getPlayers = require('./model/get-players-table.js');
  const getClubs = require('./model/get-clubs-table.js');
   
  const ruleEveryID = {hour: 5, minute: 5, second: 14, dayOfWeek: [2, 4, 6]};
  // const ruleEveryID = {hour: [4, 14, 15], minute: [5 , 51, 59], second: 14, dayOfWeek: [2, 4, 5, 6]};
 
 
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

