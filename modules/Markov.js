const Random = require('random-js')

const random = new Random(Random.engines.mt19937().autoSeed())

class Markov {
  constructor(food) {
    this._food = food
    this._startWords = []
    this._endWords = new Set
    this._wordStats = new Map
    this._makeWords()
  }

  _makeWords() {
    this._food.forEach(phrase => {
      const words = phrase.split(' ')

      this._startWords.push(words[0])

      if (words[words.length - 1].length > 1) {
        this._endWords.add(words.slice(-1))
      }

      words.forEach((word, i, a) => {
        if (a[i + 1]) {
          this._wordStats.has(a[i])
            ? this._wordStats.get(a[i]).push(a[i + 1])
            : this._wordStats.set(a[i], [a[i + 1]])
        }
      })
    })
  }

  say(minLength, reply) {
    minLength = minLength || 3 + Math.floor(3 * Math.random())
    let word = ''

    if (reply) {
      const replyArr = Markov.reduceReply(reply)

      const startWordLower = Markov.choice(replyArr)

      if (startWordLower && typeof startWordLower === 'string') {
        word = startWordLower.replace(/^./, c => c.toUpperCase())
      } else {
        word = ''
      }

    } else {
      word = Markov.choice(this._startWords)
    }

    let phrase = [word]

    while (this._wordStats.has(word)) {
      let nextWords = this._wordStats.get(word)
      word = Markov.choice(nextWords)
      phrase.push(word)

      if (phrase.length > minLength
        && this._endWords.has(word)
        || phrase.length > 30) break
    }

    if (phrase.length < minLength) {
      return phrase.join(' ') + ' ' + this.say(minLength).toLowerCase()
    }

    return phrase.join(' ').replace(/[^\waA-zZаА-яА-Я")]$/, "") + '.'
  }

  static choice(wordsArr) {
    const max = wordsArr.length - 1
    const randomIdx = random.integer(0, max)

    //old random
    // const i = Math.floor(wordsArr.length * Math.random())
    return wordsArr[randomIdx]
  }

  static reduceReply(reply) {
    return reply.toString()
                .trim()
                .split(' ')
                .filter(word => word.match(/([а-яА-Яa-zA-Z])/g))
  }
}

module.exports = Markov
