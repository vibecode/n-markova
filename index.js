require('dotenv').config()
const config = require('./config')
const express = require('express')
const app = express()
const _ = require('lodash')
const sayInRow = require('./utils/sayInRow')
const triggers = require('./constants/triggers')
const renderLyrics = require('./handlers/renderLyrics')
const renderReply = require('./handlers/renderReply')
const Markov = require('./modules/Markov')
const data = require('./data/texts')
const Random = require('random-js')
const moment = require('moment')

const random = new Random(Random.engines.mt19937().autoSeed())

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

bot.start(async ctx => {
  try {
    await ctx.reply('Мое бытие проявлено')
  } catch (err) {
    console.log(err)
  }

  sayRandomDaily(ctx, 0)
})

bot.mention(process.env.BOT_USERNAME, async ctx => {
  try {
    const phrases = data.bytie.slice(1)
    await sayInRow(phrases, ctx, { reply_to_message_id: ctx.message.message_id })
  } catch (err) {
    console.log(err)
  }
})

bot.hears(/^.*[Бб]ыти.*$/gm, async ctx => {
  try {
    await sayInRow(data.bytie, ctx, { reply_to_message_id: ctx.message.message_id })
  } catch (err) {
    console.log(err)
  }
})

bot.mention('muflisme', ctx => ctx.reply('Героям Слава!', { reply_to_message_id: ctx.message.message_id }))

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

bot.command(["natash", "natasha", "nat", "n", "diagnosis"], ctx => {
  renderReply(markov, ctx)
})

bot.command(["stih", "stihi"], ctx => {
  renderLyrics(ctx)
})

// bot.on('sticker', ctx => console.log(ctx.message.sticker))

bot.on('message', ctx => {
  const { message } = ctx
  const username = _.get(message, 'from.username')
  const text = _.get(message, 'text')

  if (text) {
    console.log('@' + username + ': ' + text)
  }

  const isReplyToBot = _.get(ctx.message, 'reply_to_message.from.username') === BOT_USERNAME

  if (isReplyToBot) {
    renderReply(markov, ctx, ctx.message.text, { reply_to_message_id: ctx.message.message_id })
  }
})

function sayRandomDaily(ctx, leftToDayEnd) {
  const maxTime = 86400000//ms in 24 hours
  const randomTime = random.integer(0, maxTime) + leftToDayEnd

  setTimeout(() => {
    renderReply(markov, ctx)

    //set new timeout at the end of the day
    const now = moment().valueOf()
    const endOfDay = moment().endOf('day').valueOf()
    const leftToDayEnd = endOfDay - now

    sayRandomDaily(ctx, leftToDayEnd)
  }, randomTime)
}

bot.telegram.setWebhook(`${URL}/bot${API_KEY}`)
app.use(bot.webhookCallback(`/bot${API_KEY}`))

app.get('/', (req, res) => {
  res.send('мое бытие проявлено')
})

app.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`)
})
