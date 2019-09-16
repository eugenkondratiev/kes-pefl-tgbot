
  const schedule = require('node-schedule');
//   const schedule = require('node-schedule-tz');
 
  // const rule = new schedule.RecurrenceRule();
//   const rule14seconds = {second: 14};
  const ruleEveryID = {hour: 1, minute: 30, second: 14, dayOfWeek: [2, 4, 6]};
  const testruleEveryID = {hour: 11, minute: 50, second: 14, dayOfWeek: [1,  3]};
//   const testruleEveryID = {hour: 11, minute: 35, second: 14, dayOfWeek: [2, 4, 6], tz:"Europe/Kiev"};
  
  var j = schedule.scheduleJob(testruleEveryID, function(){
    console.log(new Date(), '     TOLOLOLO!!!');
    j.cancel();
  });

  // const rule2 = new schedule.RecurrenceRule();

  // var j2 = schedule.scheduleJob({hour: 1, minute: 21, dayOfWeek: 1}, function(){
  //   main();
