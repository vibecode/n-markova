const moment = require('moment')
const Random = require('random-js')

const random = new Random(Random.engines.mt19937().autoSeed())

module.exports = function sayRandomDaily(bot, markov, leftToDayEnd) {
  const maxTime = 5000 //86400000 ms in 24 hours
  const randomTime = random.integer(0, maxTime) + leftToDayEnd

  setTimeout(async () => {
    const text = markov.say()

    try {
      await  bot.telegram.sendMessage(336222660, text)
    } catch (err) {
      console.log(err)
    }

    //set new timeout at the end of the day
    const now = moment().valueOf()
    const endOfDay = moment().endOf('day').valueOf()
    const leftToDayEnd = endOfDay - now

    sayRandomDaily(bot, markov, leftToDayEnd)
  }, randomTime)
}
