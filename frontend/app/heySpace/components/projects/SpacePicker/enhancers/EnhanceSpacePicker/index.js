import React from 'react';

import { List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { selectAvailableSpacesIds } from 'models/domain/ProjectsModel/selectors';

const emptyList = new List();

function Enhance(ComposedComponent) {
  class EnhanceSpacePicker extends BaseComponent {

    static propTypes = {
      onSelectedSpacesChange: PropTypes.func,
      className: PropTypes.string,
    };

    static defaultProps = {
      onSelectedSpacesChange: doNothing,
    };

    state = {
      selectedSpaceIds: emptyList,
      isOpen: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          spaceIds={this.props.spaceIds}
          selectedSpaceIds={this.state.selectedSpaceIds}
          isOpen={this.state.isOpen}
          isDisabled={this.props.isDisabled}
          onSelectSpaceId={this.onSelectSpaceId}
          onClickButtonDispatched={this.onClickButtonDispatched}
        />
      );
    }

    onSelectSpaceId(spaceId) {
      const selectedSpaceIndex = this.state.selectedSpaceIds.indexOf(spaceId);
      let { selectedSpaceIds } = this.state;
      if (selectedSpaceIndex > -1) {
        selectedSpaceIds = selectedSpaceIds.splice(selectedSpaceIndex, 1);
      } else if (!this.props.isDisabled) {
        selectedSpaceIds = selectedSpaceIds.push(spaceId);
      }
      this.setState({ selectedSpaceIds });
      this.props.onSelectedSpacesChange(selectedSpaceIds);
    }

    onClickButtonDispatched() {
      this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
    }
  
}

  function mapStateToProps(state) {
    return {
      spaceIds: selectAvailableSpacesIds(state),
    };
  }

  return connect(mapStateToProps)(EnhanceSpacePicker);
}

export default Enhance;
