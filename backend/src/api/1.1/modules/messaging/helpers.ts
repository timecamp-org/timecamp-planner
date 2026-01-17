export function isQuillMessage(text: string): boolean {
    try {
      const parsedText = JSON.parse(text)
      return Boolean(typeof parsedText === 'object' && parsedText !== null && parsedText.ops)
    } catch (error) {
      // not a valid JSON so not quill message
      return false
    }
  }