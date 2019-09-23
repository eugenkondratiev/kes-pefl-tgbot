require('./scheduler')();

const dbPool = require('./model/connection-pool');
const find = require('./model/find-by-name');

const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const config = require('./config.json');

const bot = new Telegraf(config.token)

async function startUp() {
  try {
    await require('./model/get-players-base')();
    await require('./model/get-clubs-table')();
     bot.use(Telegraf.log())
    ;
    bot.hears(/\/find ([\sA-Яа-яЁёЪъ]+)/, (ctx) => {
      // console.log("ctx.tg - ", ctx.tg);
      console.log("ctx.match - ",ctx.match);
      const nameToFind = ctx.match[1];
      // nameToFind.splice(0, 6);
      console.log("Find request heard", nameToFind);
      const resp = find.findByName(nameToFind);
      console.log('resp - ', resp)
      return ctx.reply(JSON.stringify(resp))
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


// bot.use(Telegraf.log())

// bot.command('onetime', ({ reply }) =>
//   reply('One time keyboard', Markup
//     .keyboard(['/simple', '/inline', '/pyramid'])
//     .oneTime()
//     .resize()
//     .extra()
//   )
// )

// bot.command('custom', ({ reply }) => {
//   return reply('Custom buttons keyboard', Markup
//     .keyboard([
//       ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
//       ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
//       ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
//     ])
//     .oneTime()
//     .resize()
//     .extra()
//   )
// })

// bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
// bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

// bot.command('special', (ctx) => {
//   return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
//     return markup.resize()
//       .keyboard([
//         markup.contactRequestButton('Send contact'),
//         markup.locationRequestButton('Send location')
//       ])
//   }))
// })

// bot.command('pyramid', (ctx) => {
//   return ctx.reply('Keyboard wrap', Extra.markup(
//     Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
//       wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
//     })
//   ))
// })

// bot.command('simple', (ctx) => {
//   return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
//     Markup.keyboard(['Coke', 'Pepsi'])
//   ))
// })

// bot.command('inline', (ctx) => {
//   return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
//     m.inlineKeyboard([
//       m.callbackButton('Coke', 'Coke'),
//       m.callbackButton('Pepsi', 'Pepsi')
//     ])))
// })

// bot.command('random', (ctx) => {
//   return ctx.reply('random example',
//     Markup.inlineKeyboard([
//       Markup.callbackButton('Coke', 'Coke'),
//       Markup.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
//       Markup.callbackButton('Pepsi', 'Pepsi')
//     ]).extra()
//   )
// })

// bot.command('caption', (ctx) => {
//   return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
//     Extra.load({ caption: 'Caption' })
//       .markdown()
//       .markup((m) =>
//         m.inlineKeyboard([
//           m.callbackButton('Plain', 'plain'),
//           m.callbackButton('Italic', 'italic')
//         ])
//       )
//   )
// })

// bot.hears(/\/wrap (\d+)/, (ctx) => {
//   return ctx.reply('Keyboard wrap', Extra.markup(
//     Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
//       columns: parseInt(ctx.match[1])
//     })
//   ))
// })

// bot.action('Dr Pepper', (ctx, next) => {
//   return ctx.reply('👍').then(() => next())
// })

// bot.action('plain', async (ctx) => {
//   await ctx.answerCbQuery()
//   ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
//     Markup.callbackButton('Plain', 'plain'),
//     Markup.callbackButton('Italic', 'italic')
//   ]))
// })

// bot.action('italic', async (ctx) => {
//   await ctx.answerCbQuery()
//   ctx.editMessageCaption('_Caption_', Extra.markdown().markup(Markup.inlineKeyboard([
//     Markup.callbackButton('Plain', 'plain'),
//     Markup.callbackButton('* Italic *', 'italic')
//   ])))
// })

// bot.action(/.+/, (ctx) => {
//   return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
// })

// bot.launch()
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