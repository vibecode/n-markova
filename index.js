require('dotenv').config()
const _ = require('lodash')
const  http = require("http")
const config = require('./config')
const express = require('express')
const app = express()
const sayInRow = require('./utils/sayInRow')
const triggers = require('./constants/triggers')
const renderLyrics = require('./handlers/renderLyrics')
const renderReply = require('./handlers/renderReply')
const sayRandomDaily = require('./modules/sayRandomDaily')
const Markov = require('./modules/Markov')
const data = require('./data/texts')

const cleanFood = require('./utils/cleanFood')
const Telegraf = require('telegraf')

const { URL, API_KEY, PORT } = config

const foodSource = data.text.split('. ')
const food = cleanFood(foodSource)
const markov = new Markov(food)

const bot = new Telegraf(API_KEY)

let BOT_USERNAME = ''

bot.telegram
   .getMe()
   .then((botInfo) => {
     bot.options.username = botInfo.username
     BOT_USERNAME = botInfo.username
   })

sayRandomDaily(bot, markov)

//logging incoming messages
bot.use((ctx, next) => {
  const { message } = ctx
  const username = _.get(message, 'from.username')
  const text = _.get(message, 'text', '***нет текста***')
  const chat_id = _.get(message, 'chat.id')

  console.log('chat_id: ' + chat_id)
  console.log('@' + username + ': ' + text)

  return next(ctx)
})

bot.start(async ctx => {
  try {
    await ctx.reply('Мое бытие проявлено')
  } catch (err) {
    console.log(err)
  }
})

bot.command(["natash", "natasha", "nat", "n", "diagnosis"], ctx => {
  renderReply(markov, ctx)
})

bot.command(["stih", "stihi"], ctx => {
  renderLyrics(ctx)
})

bot.command(["man"], async ctx => {

  const text = _.get(ctx, 'message.text').replace(/\/man/gm, "").trim()
  const chats = config.CHATS

  console.log('cleared ' + text);
  function broadcast(message) {
    chats.forEach(chat_id => bot.telegram.sendMessage(chat_id, message).catch(err => console.log(err)))
  }

  if (text) {
    broadcast(text)
  } else {
    const textRandom = markov.say()
    broadcast(textRandom)
  }
})

bot.hears(/^.*[Бб]ыти.*$/gm, async ctx => {
  try {
    await sayInRow(data.bytie, ctx, { reply_to_message_id: ctx.message.message_id })
  } catch (err) {
    console.log(err)
  }
})

bot.hears(triggers.common, ctx => {
  renderReply(markov, ctx, ctx.match, { reply_to_message_id: ctx.message.message_id })
})

bot.hears(triggers.myher, async ctx => {
  try {
    await ctx.replyWithSticker('CAADBQADRwADRWMpEsuzZEkvMI9UAg')
  } catch (err) {
    console.log(err)
  }
})

bot.hears(triggers.death, async ctx => {
  try {
    await ctx.replyWithSticker('CAADBQADKgADRWMpEpDaQiZ-o0X6Ag')
  } catch (err) {
    console.log(err)
  }
})

bot.mention('muflisme', ctx => ctx.reply('Героям Слава!', { reply_to_message_id: ctx.message.message_id }))

bot.mention(process.env.BOT_USERNAME, async ctx => {
  try {
    const phrases = data.bytie.slice(1)
    await sayInRow(phrases, ctx, { reply_to_message_id: ctx.message.message_id })
  } catch (err) {
    console.log(err)
  }
})

// bot.on('sticker', ctx => console.log(ctx.message.sticker))

bot.on('message', ctx => {
  const { message } = ctx

  const isReplyToBot = _.get(message, 'reply_to_message.from.username') === BOT_USERNAME

  if (isReplyToBot) {
    renderReply(markov, ctx, message.text, { reply_to_message_id: message.message_id })
  }
})

bot.telegram.setWebhook(`${URL}/bot${API_KEY}`)
app.use(bot.webhookCallback(`/bot${API_KEY}`))

app.get('/', (req, res) => {
  res.send('мое бытие проявлено')
})

app.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`)
})


//keep heroku app awake
setInterval(() => {
  http.get('http://n-markova.herokuapp.com')
}, 1200000) // every 20 minutes (1 200 000)
