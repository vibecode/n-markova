module.exports = async function sayInRow(phrasesArr, ctx, opts) {
  await ctx.reply(phrasesArr[0], opts)

  for (let i = 1; i < phrasesArr.length; i++) {
    await promiseDelay(300)
    await ctx.reply(phrasesArr[i])
  }
}

function promiseDelay(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeout)
  })
}
