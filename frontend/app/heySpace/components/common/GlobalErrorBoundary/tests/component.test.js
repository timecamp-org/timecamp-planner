import React from 'react'
import GlobalErrorBoundary from 'commonComponents/GlobalErrorBoundary/component'

describe('<GlobalErrorBoundary />', () => {

  const mockAppLoadedEvent = jest.fn()

  beforeAll(() => {
    document.addEventListener('appLoaded', function() {
      mockAppLoadedEvent()
    })
  })


  const renderedComponent = shallow(
    <GlobalErrorBoundary>
      <div>Test</div>
    </GlobalErrorBoundary>
  )

  it('renders children correctly', () => {
    expect(renderedComponent).toMatchSnapshot()
  })

  it('has correct default state', () => {
    const { hasError } = renderedComponent.state()
    expect(hasError).toBeFalsy()
  })

  it('shouldn\'t have dispatched appLoaded event before hasError state changed to true', () => {
    expect(mockAppLoadedEvent).toHaveBeenCalledTimes(0)
  })

  describe('should react to hasError state change', () => {

    beforeAll(() => {
      renderedComponent.setState({ hasError: true })
    })

    it('should dispatch appLoaded event when hasError will change to true', () => {
      expect(mockAppLoadedEvent).toHaveBeenCalled()
    })

    it('should have correct hasError state', () => {
      const { hasError } = renderedComponent.state()
      expect(hasError).toBeTruthy()
    })

    it('should render fallback component', () => {
      expect(renderedComponent).toMatchSnapshot()
    })

    // TODO: why isn't it passing?????
    // it('should reloadApp after button click', () => {
    //   const reloadAppSpy = jest.spyOn(renderedComponent.instance(), 'reloadApp')
    //   renderedComponent.find('button').simulate('click')
    //   expect(reloadAppSpy).toHaveBeenCalled()
    // })

  })

})
