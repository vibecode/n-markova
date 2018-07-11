require('dotenv').config()
const config = require('./config')

const Telegraf = require('telegraf')
const generateReply = require('./handlers/generateReply')

const bot = new Telegraf(config.apiKey)

bot.telegram
   .getMe()
   .then((botInfo) => {
     bot.options.username = botInfo.username
   })

bot.hears(/^.*быти.*$/gm, async ctx => {
  await ctx.reply('ты поехавший, да?')
  await ctx.reply('еще раз')
  await ctx.reply('мое бытие проявлено')
  await ctx.reply('не доходит все еще?')
})

bot.hears(/^.*онтологи.*$/, ctx => {
  generateReply(ctx, ctx.message.text)
})

bot.on("message", ctx => {
  generateReply(ctx, ctx.message.text)
})

//TODO выяснить почему не работает
// bot.mention('muflisme', ctx => ctx.reply('hi'))

bot.startPolling()
