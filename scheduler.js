
  const schedule = require('node-schedule');
  const getPlayers = require('./model/parse-players-base');
   
  const ruleEveryID = {hour: [3,23], minute: 35, second: 14, dayOfWeek: [2, 4, 6]};
  const ruleEveryID2 = {hour: 1, minute: 25, second: 14, dayOfWeek: [2, 4, 6]};
  const ruleEveryID3 = {hour: 1, minute: 30, second: 14, dayOfWeek: [2, 4, 6]};
  // const testruleEveryID = {hour: 11, minute: 50, second: 14, dayOfWeek: [1,  3]};
  // const rule2 = new schedule.RecurrenceRule();

  module.exports = function() {
    const schGetPlayers = schedule.scheduleJob(ruleEveryID, function(){
      console.log(new Date(), 'Get players');
      getPlayers();
      // j.cancel();
    });
  }