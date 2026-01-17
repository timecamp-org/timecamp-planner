import * as AppModelActions from 'models/domain/AppModel/actions';
import { QuickSwitcherState } from 'models/domain/AppModel/types';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';

function enhance(ComposedComponent) {
  class EnhanceOpenQuickSwitcherButton extends BaseComponent {
    static propTypes = {
      onOpenQuickSwitcher: PropTypes.func.isRequired,
      isCollapsed: PropTypes.bool,
    };

    render() {
      return <ComposedComponent isCollapsed={this.props.isCollapsed} onClick={this.props.onOpenQuickSwitcher} />;
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onOpenQuickSwitcher: () => dispatch(AppModelActions.onSetQuickSwitcherState(QuickSwitcherState.CHATS)),
  });

  return connect(null, mapDispatchToProps)(EnhanceOpenQuickSwitcherButton);
}

export default enhance;
