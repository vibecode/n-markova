require('dotenv').config()
const config = require('./config')
const data = require('./data/natasha')
const express = require('express')
const expressApp = express()

const Telegraf = require('telegraf')
const generateReply = require('./handlers/generateReply')

const { URL, API_KEY, PORT} = config

const bot = new Telegraf(API_KEY)

bot.telegram
   .getMe()
   .then((botInfo) => {
     bot.options.username = botInfo.username
   })

bot.hears(/^.*[Бб]ыти.*$/gm, async ctx => {
  try {
    await sayInRow(data.bytie, ctx, {reply_to_message_id: ctx.message.message_id})
  } catch (err) {
    console.log(err)
  }
})

bot.mention('natassha_bot', async ctx => {
  try {
    const phrases = data.bytie.slice(1)
    await sayInRow(phrases, ctx, {reply_to_message_id: ctx.message.message_id})
  } catch (err) {
    console.log(err)
  }
})

//TODO update phrase
bot.mention('muflisme', ctx => ctx.reply('Героям Слава!', {reply_to_message_id: ctx.message.message_id}))

bot.hears(
  [/^.*[Аа]теи.*$/gm,
   /^.*[Нн]абоков.*$/gm,
   /^.*[Рр]озанов.*$/gm,
   /^.*[Гг]алковск.*$/gm,
   /^.*[Дд]остоевск.*$/gm,
   /^.*[Лл]итература.*$/gm,
   /^.*[Сс]тажер.*$/gm,
   /^.*[Оо]нтолог.*$/gm,
   /^.*[Пп]сих.*$/gm,
   /^.*[Шш]изо.*$/gm,
   /^.*[Мм]аг.*$/gm,
   /^.*[Рр]изом.*$/gm,
   /^.*тел.*$/gm, /^.*орган.*$/gm,
   /^.*письм.*$/gm,
   /^.*анус.*$/gm,
   /^.*[Лл][Оо][Лл].*$/gm,
   /^.*[Дд]еррид.*$/gm,
   /^.*[Лл]акан.*$/gm,
   /^.*[Дд]елез.*$/gm], ctx => {
  generateReply(ctx, ctx.match,  {reply_to_message_id: ctx.message.message_id})
})

bot.hears([/^.*[Хх]ох.*$/gm,  /^.*[Уу]кр.*$/gm], ctx => {
  generateReply(ctx, ctx.match, {reply_to_message_id: ctx.message.message_id})
})

bot.command(["natash", "natasha", "nat", "n", "diagnosis"], ctx => {
    generateReply(ctx)
})

bot.hears([/^.*[Лл]еня.*$/gm,  /^.*[Лл]ео.*$/gm, /^.*[Мм]ухер.*$/gm], async ctx => {
  try {
    await ctx.replyWithSticker('CAADBQADRwADRWMpEsuzZEkvMI9UAg')
  } catch (err) {
    console.log(err)
  }
})

bot.on('sticker', ctx => console.log(ctx.message.sticker))

// bot.startPolling()

bot.telegram.setWebhook(`${URL}/bot${API_KEY}`)
expressApp.use(bot.webhookCallback(`/bot${API_KEY}`))

expressApp.get('/', (req, res) => {
  res.send('мое бытие проявлено');
})
expressApp.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

async function sayInRow(phrasesArr, ctx, opts) {
  await ctx.reply(phrasesArr[0], opts)

  for (let i = 1; i < phrasesArr.length; i++) {
    await ctx.reply(phrasesArr[i])
  }
}
