
  const schedule = require('node-schedule');
  const getPlayers = require('./model/get-players-table.js');
  const getClubs = require('./model/get-clubs-table.js');
   
  const ruleEveryID = {hour: 7, minute: 5, second: 14, dayOfWeek: [ 0, 2, 4, 6]};
  // const ruleEveryID = {hour: [13, 10], minute: [10 , 15], second: 14, dayOfWeek: [1, 2, 4, 5, 6]};
 
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

