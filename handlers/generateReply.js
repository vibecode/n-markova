const Markov = require('../modules/Markov')
const data = require('../data/natasha')
const cleanFood = require('../utils/cleanFood')

module.exports = function(ctx, input, opts) {
  const foodSource = data.text.split('. ')
  const food = cleanFood(foodSource)
  const markov = new Markov(food)

  const replyTxt = markov.say(null, input)

  return ctx.reply(replyTxt, opts)
}
