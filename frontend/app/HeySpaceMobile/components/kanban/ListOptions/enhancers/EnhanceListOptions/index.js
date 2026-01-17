import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from 'BaseComponent'
import { connect } from 'react-redux'

import { selectIsCurrentUserProjectFollower } from 'models/domain/ProjectsModel/selectors'
import { selectIsCurrentUserListOrSpaceFollower, selectProjectIdByListId } from 'models/domain/ListsModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceListOptions extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      listId: PropTypes.string.isRequired,
    }

    state = {
      isListOptionsOpen: false,
    }

    render() {
      return (
        <ComposedComponent
          listId={this.props.listId}

          listOptions={this.props.listOptions}
          isCurrentUserFollowingListOrSpace={this.props.isCurrentUserFollowingListOrSpace}
          isCurrentUserFollowingSpace={this.props.isCurrentUserFollowingSpace}
          isListOptionsOpen={this.state.isListOptionsOpen}

          onCloseListOptions={this.onCloseListOptions}
          onShowListOptions={this.onShowListOptions}
          onSelectOption={this.onSelectOption}
        />
      )
    }

    onShowListOptions() {
      this.setState({
        isListOptionsOpen: true,
      })
    }

    onCloseListOptions() {
      this.setState({
        isListOptionsOpen: false,
      })
    }

    onSelectOption(item) {
      this.onCloseListOptions()
      this.props.onSelectOption(item)
    }
  }

  function mapStateToProps(state, props) {
    const projectId = selectProjectIdByListId(state, { listId: props.listId })
    return {
      isCurrentUserFollowingListOrSpace: selectIsCurrentUserListOrSpaceFollower(state, { listId: props.listId }),
      isCurrentUserFollowingSpace: selectIsCurrentUserProjectFollower(state, { projectId }),
    }
  }

  return connect(mapStateToProps)(EnhanceListOptions)
}


export default Enhance
