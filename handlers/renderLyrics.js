const lyrics = require('../data/lyrics')
const Random = require('random-js')

const random = new Random(Random.engines.mt19937().autoSeed())

module.exports = function(ctx) {
  const idx = random.integer(0, lyrics.length - 1)

  ctx.reply(lyrics[idx])
}
