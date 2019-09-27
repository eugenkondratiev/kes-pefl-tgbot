require('./scheduler')();


const dbPool = require('./model/connection-pool');
const Find = require('./model/pefl-searcher');

const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const config = require('./config.json');

const bot = new Telegraf(config.token)
bot.context.db = {
}

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
    await require('./model/get-players-table')();
    await require('./model/get-clubs-table')();

     bot.use(Telegraf.log())
    const COMMAND_HELP = `
/find имя_часть_имени  - поиск игрока по имени (напр. /find хиса)
/exot id_нации  - поиск игроков нужной нации( пока по номеру) (напр /exot 190)
/id часть_названия_нации  - поиск id нужной нации (напр /id тринид)
/next - следующая порция игроков
/prev - прошлая порция игроков
/start - старт
/xxx - рестарт
Всего игроков - ${global.playersBase.length}\n`;

    bot.hears(/\/find ([\sA-Яа-яЁёЪъ]+)/i, (ctx) => {
      const _id = ctx.message.from.id;
      if (!ctx.db[_id]) ctx.db[_id] = new Find(global.playersBase );
      // console.log("ctx.tg - ", ctx.tg);
      // console.log("ctx.match - ",ctx.match);
      const nameToFind = ctx.match[1];
      ctx.nameToFind = nameToFind;
      if (nameToFind.length < 3) return ctx.reply(`Пожалуйста, вводите 3 и более букв`    )
      // nameToFind.splice(0, 6);
      console.log("Find request heard", nameToFind);
      const resp = ctx.db[_id].findByName(nameToFind);
      console.log('resp - ', resp)
      return ctx.replyWithHTML(resp,  moreLesskeyboard)
      // return ctx.replyWithHTML(resp,  Extra.markup(moreLesskeyboard))
      
    })

    bot.hears(/\/exot ([\d]{1,4})/i, (ctx) => {
      const _id = ctx.message.from.id;
      if (!ctx.db[_id]) ctx.db[_id] = new Find(global.playersBase );
      // console.log("ctx.tg - ", ctx.tg);
      console.log("ctx.match - ",ctx.match);
      const nationToFind = ctx.match[1];
      ctx.nationToFind = nationToFind;
      console.log("Exot request heard", nationToFind);
      const resp = ctx.db[_id].findByNation(nationToFind);
      console.log('resp - ', resp);
      // return ctx.replyWithHTML(resp,  Extra.HTML().markup(testInlinKb))
      // return ctx.replyWithHTML(resp, Extra.markup(moreLesskeyboard))
      return ctx.replyWithHTML(resp, moreLesskeyboard)
      // return ctx.replyWithHTML(resp, {parse_mode : "HTML"}, moreLesskeyboard)
    })


    bot.hears(/\/id ([\sA-Яа-яЁёЪъ]+)/i, (ctx) => {
      // const _id = ctx.message.from.id;
      // if (!ctx.db[_id]) ctx.db[_id] = new Find(global.playersBase );
      // console.log("ctx.tg - ", ctx.tg);
      console.log("ctx.match - ",ctx.match);
      const nationToFind = ctx.match[1];
      // ctx.nameToFind = nameToFind;
      if (nationToFind.length < 3) return ctx.reply(`Пожалуйста, вводите 3 и более букв`    )
      // nameToFind.splice(0, 6);
      console.log("ID request heard", nationToFind);
      const resp = require('./model/find-id')(nationToFind);
      console.log('resp - ', resp)
      return ctx.replyWithHTML(resp)
      // return ctx.replyWithHTML(resp,  moreLesskeyboard)
      
    })


    bot.command('next', (ctx) => {
      const _id = ctx.message.from.id;

      const resp = ctx.db[_id].getNextPortionOfPlayers();
        console.log('resp NEXT- ', resp)
        return ctx.replyWithHTML(resp,  moreLesskeyboard)
      });

    bot.command('prev', (ctx) => {
        const _id = ctx.message.from.id;
  
        const resp = ctx.db[_id].getPrevPortionOfPlayers();
          console.log('resp PREV- ', resp)
          return ctx.replyWithHTML(resp, Extra.HTML().markup(testInlinKb))
        }) ;

    bot.action('next', (ctx) => {
          // console.log('ACTION NEXT  -   ', ctx);

          const _id = ctx.update.callback_query.from.id;
          // const _id = ctx.message.from.id;
    
          const resp = ctx.db[_id].getNextPortionOfPlayers();
            // console.log('resp NEXT- ', resp)
            return ctx.replyWithHTML(resp,  moreLesskeyboard)
          });
    
    bot.action('prev', (ctx) => {
          const _id = ctx.update.callback_query.from.id;
          // const _id = ctx.message.from.id;
      
            const resp = ctx.db[_id].getPrevPortionOfPlayers();
              // console.log('resp PREV- ', resp)
              return ctx.replyWithHTML(resp,  moreLesskeyboard);
            }) ;      

    bot.command(['xxx', 'start'], (ctx) => {
        return ctx.reply(COMMAND_HELP)
      })
    
    bot.on('message', (ctx) => {
        return ctx.reply(COMMAND_HELP)
      })



     bot.launch();
  
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
});

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
  dbPool.end();
});

process.on('beforeExit', (code) => {
  console.log(`beforeExit fired  with code: ${code}`);
  dbPool.end();
});

startUp();