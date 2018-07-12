module.exports = function(markov, ctx, input, opts) {
  const replyTxt = markov.say(null, input)

  return ctx.reply(replyTxt, opts)
}
