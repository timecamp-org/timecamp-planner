import BaseComponent from 'commonEnhancers/BaseComponent';

const Enhance = (ComposedComponent) => {
  class EnhancePageNotSupportedOnMobile extends BaseComponent {
    render() {
      // temporary
      // if (isWebOpenOnMobile()) {
      //   return <NotSupportedMobile />;
      // }

      return <ComposedComponent {...this.props} />;
    }
  }

  return EnhancePageNotSupportedOnMobile;
};

export default Enhance;
