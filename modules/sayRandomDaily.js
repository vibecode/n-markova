const moment = require('moment')
const Random = require('random-js')
const config = require('../config')

const random = new Random(Random.engines.mt19937().autoSeed())

module.exports = function sayRandomDaily(bot, markov, leftToDayEnd) {
  const maxTime = 86400000 //86400000 ms in 24 hours
  const randomInt = random.integer(0, maxTime)

  const randomTime = leftToDayEnd ? randomInt + leftToDayEnd : randomInt

  setTimeout(async () => {
    const text = markov.say()
    const chats = config.CHATS

    chats.forEach(chat_id => bot.telegram.sendMessage(chat_id, text).catch(err => console.log(err)))

    //set new timeout at the end of the day
    const now = moment().valueOf()
    const endOfDay = moment().endOf('day').valueOf()
    const leftToDayEnd = endOfDay - now

    sayRandomDaily(bot, markov, leftToDayEnd)
  }, randomTime)
}
