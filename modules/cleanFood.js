module.exports = data => {
  return data.map(item =>
    item.trim()
        .replace(/(^@\S+\s+)|(http\S+)/g, '')
        .replace(/["']/g, "")
  )
}
