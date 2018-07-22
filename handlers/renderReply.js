module.exports = function(markov, ctx, input, opts) {
  const replyTxt = markov.say(null, input)

  console.log('@НАТАША: ' + replyTxt);

  return ctx.reply(replyTxt, opts)
}
