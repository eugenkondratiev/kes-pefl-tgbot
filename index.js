﻿require('./scheduler')();
const peflServer = require('./app');
//const dbPool = require('./model/connection-pool')();
const dbPool = require('./model/connection-pool-eco')();
const Find = require('./model/pefl-searcher');

const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const config = require('./config.json');

const bot = new Telegraf(config.token)
bot.context.db = {
}
const logUser =  require('./model/id-log');

const moreLesskeyboard = Markup.inlineKeyboard([
  Markup.callbackButton('еще 10', 'next'),
  Markup.callbackButton('прошлые 10', 'prev')
]).extra({parse_mode : "HTML"});

const testInlinKb = (m) => {
  m.inlineKeyboard([
    m.callbackButton('еще 10', '/next'),
    m.callbackButton('прошлые 10', '/prev')
  ])
}

async function startUp() {
  try {
    const answerPlayers = await require('./model/get-players-table')();
    // console.log("answerPlayers ", answerPlayers);
    const answerClubs = await require('./model/get-clubs-table')();
     bot.use(Telegraf.log());

    function getCommandHelp()  {
      return `
/find имя_часть_имени  - поиск игрока по имени (напр. /find хиса)
/exot id_нации  - поиск игроков нужной нации( пока по номеру) (напр /exot 190)
/id часть_названия_нации  - поиск id нужной нации (напр /id тринид)
/next - следующая порция игроков
/prev - прошлая порция игроков
/start - старт
/xxx - рестарт
Всего игроков - ${global.playersBase.length}\n`;
    }
    const PREV_NEXT_EARLY = `Используйте /next и /prev 
    когда уже найден набор игроков командами 
    /find или /exot`
    bot.hears(/\/find ([\sA-Яа-яЁёЪъ]+)/i, (ctx) => {
      try {
        const _id = ctx.message.from.id;
        if (!ctx.db[_id]) ctx.db[_id] = new Find(global.playersBase );
        logUser(ctx);
        const nameToFind = ctx.match[1];
        ctx.nameToFind = nameToFind;
        if (nameToFind.length < 3) return ctx.reply(`Пожалуйста, вводите 3 и более букв`    ).catch(err => {console.log(err)});
        console.log("Find request heard", nameToFind);
        const resp = ctx.db[_id].findByName(nameToFind);
        console.log('resp - ', resp);
        return ctx.replyWithHTML(resp,  moreLesskeyboard).catch(err => {console.log(err)});
          
      } catch (error) {
        console.log(error); 
        return 'ok'
      }      
    })

    bot.hears(/\/exot ([\d]{1,4})/i, (ctx) => {
      try {
        const _id = ctx.message.from.id;
        if (!ctx.db[_id]) ctx.db[_id] = new Find(global.playersBase );
        logUser(ctx);
        console.log("ctx.match - ",ctx.match);
        const nationToFind = ctx.match[1];
        ctx.nationToFind = nationToFind;
        console.log("Exot request heard", nationToFind);
        const resp = ctx.db[_id].findByNation(nationToFind);
        console.log('resp - ', resp);
        return ctx.replyWithHTML(resp, moreLesskeyboard).catch(err => {console.log(err)});
          
      } catch (error) {
        console.log(error);
        return 'ok'
      }
    })


    bot.hears(/\/id ([\sA-Яа-яЁёЪъ]+)/i, (ctx) => {
      try {
      console.log("ctx.match - ",ctx.match);
      logUser(ctx);
      const nationToFind = ctx.match[1];
      if (nationToFind.length < 3) return ctx.reply(`Пожалуйста, вводите 3 и более букв`    ).catch(err => {console.log(err)});
      console.log("ID request heard", nationToFind);
      const resp = require('./model/find-id')(nationToFind);
      console.log('resp - ', resp)
      return ctx.replyWithHTML(resp).catch(err => {console.log(err)});
        
      } catch (error) {
        console.log(error);
        return 'ok'
      }
      
    })


    bot.command('next', (ctx) => {
      try {
        const _id = ctx.message.from.id;
        if (!ctx.db[_id] ) return ctx.reply(PREV_NEXT_EARLY).catch(err => {console.log(err)});

        const resp = ctx.db[_id].getNextPortionOfPlayers();
          console.log('resp NEXT- ', resp)
          return ctx.replyWithHTML(resp,  moreLesskeyboard).catch(err => {console.log(err)});
          
      } catch (error) {
        console.log(error);
        return 'ok'
      }
      });

    bot.command('prev', (ctx) => {
      try {
        const _id = ctx.message.from.id;
        // if (ctx.db[_id] ) {
          if (!ctx.db[_id] ) return ctx.reply(PREV_NEXT_EARLY).catch(err => {console.log(err)});
        const resp = ctx.db[_id].getPrevPortionOfPlayers();
          console.log('resp PREV- ', resp)
          return ctx.replyWithHTML(resp, Extra.HTML().markup(testInlinKb)).catch(err => {console.log(err)});
        // } 
      } catch (error) {
        console.log(error);
        return 'ok'
      }
        }) ;

    bot.action('next', (ctx) => {
      try {
        const _id = ctx.update.callback_query.from.id;
        if (!ctx.db[_id] ) return ctx.reply(PREV_NEXT_EARLY).catch(err => {console.log(err)}); 
          const resp = ctx.db[_id].getNextPortionOfPlayers();
            return ctx.replyWithHTML(resp,  moreLesskeyboard).catch(err => {console.log(err)});
        
      } catch (error) {
        console.log(error);
        return 'ok'
      }
          });
    
    bot.action('prev', (ctx) => {
      try {
        const _id = ctx.update.callback_query.from.id;
        if (!ctx.db[_id] ) return ctx.reply(PREV_NEXT_EARLY).catch(err => {console.log(err)});     
          const resp = ctx.db[_id].getPrevPortionOfPlayers();
            return ctx.replyWithHTML(resp,  moreLesskeyboard).catch(err => {console.log(err)});
      
      } catch (error) {
        console.log(error);
        return 'ok'
      }
            }) ;      

    bot.command(['xxx', 'start'], (ctx) => {
        try {
          logUser(ctx);
          return ctx.reply(getCommandHelp()).catch(err => {console.log(err)});
        
        } catch (error) {
          console.log(error);
          return 'ok'
        }
      })
    
    bot.on('message', (ctx) => {
      try {
        logUser(ctx);
        return ctx.reply(getCommandHelp()).catch(err => {console.log(err)});
        
      } catch (error) {
        console.log(error);
        return 'ok'
      }
      })


      try {
        bot.launch();
     
      } catch (error) {
        console.log(error);
        return 'ok'
      }

     
  } catch (error) {
    console.log("startUpError - ", error)
  }
}


setTimeout(()=> {
    const used = process.memoryUsage();   
    for (let key in used) {
      console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
    // console.log(playersBase, playersBase.length);
}, 70000);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // logic
	dbPool.end();
});

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
  dbPool.end();
});

process.on('beforeExit', (code) => {
  console.log(`beforeExit fired  with code: ${code}`);
  dbPool.end();
});

try {
 	peflServer();
	startUp(); 

} catch (error) {
  console.log("main bot loop error - ", error);
  return 'ok'
}
