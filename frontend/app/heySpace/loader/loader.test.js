
describe('app loader', () => {

  describe('before script is loaded into html', () => {

    beforeAll(() => {
      const html = require('fs').readFileSync(process.cwd() + `/app/heySpace/index.html`).toString()
      document.body.innerHTML = html
    })

    it('.loader-wrapper div should be empty', () => {
      expect(document.querySelector('.loader-wrapper').children.length).toEqual(0)
    })

  })

  describe('after loader script is executed', () => {

    beforeAll(() => {
      require('./loader')
    })

    describe('after appLoaded event is dispatched', () => {

      beforeAll(() => {
        const appLoadedEvent = new Event('appLoaded')
        document.dispatchEvent(appLoadedEvent)
      })

      it('app should be visible', () => {
        expect(document.querySelector('#app').className).toEqual('app--visible')
      })

      it('loader should be hidden', () => {
        expect(document.querySelector('.loader-wrapper').className).toEqual('loader-wrapper app--loaded')
      })

    })

    describe('after appLoading event is dispatched', () => {

      beforeAll(() => {
        const appLoadingEvent = new Event('appLoading')
        document.dispatchEvent(appLoadingEvent)
      })

      it('loader should be visible', () => {
        expect(document.querySelector('.loader-wrapper').className).toEqual('loader-wrapper')
      })

    })
  })
})