const moment = require('moment')
const Random = require('random-js')

const random = new Random(Random.engines.mt19937().autoSeed())

module.exports = function sayRandomDaily(bot, markov) {
  const maxTime = 3600000 //86400000 ms in 24 hours
  const randomTime = random.integer(0, maxTime) // + leftToDayEnd

  setTimeout(async () => {
    const text = markov.say()
    const chats = [
      336222660, //dev
      499447942, //eg
    ]

    chats.forEach(chat_id => bot.telegram.sendMessage(chat_id, text).catch(err => console.log(err)))

    //set new timeout at the end of the day
    // const now = moment().valueOf()
    // const endOfDay = moment().endOf('day').valueOf()
    // const leftToDayEnd = endOfDay - now

    sayRandomDaily(bot, markov)
  }, randomTime)
}
