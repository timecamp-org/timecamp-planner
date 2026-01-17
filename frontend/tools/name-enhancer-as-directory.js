module.exports = function(source) {
  const parentFolderName = this.context.slice(this.context.lastIndexOf('/') + 1, this.context.length)

  if (parentFolderName.includes('Enhance') && /return.*EnhancedComponent.*/.test(source)) {
    const oldReturnPhrase = source.match(/return.*EnhancedComponent.*/)[0]
    const phraseToInject = `EnhancedComponent.displayName = \'${parentFolderName}\'\n${oldReturnPhrase}`

    return source.replace(oldReturnPhrase, phraseToInject)
  } else {
    return source
  }
}