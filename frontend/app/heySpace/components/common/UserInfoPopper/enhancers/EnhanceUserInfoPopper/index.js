import React from 'react';

import { List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { generateConversationId } from 'common/utils/generateCombinedId';
import { makeConversationLink } from 'common/utils/routerHelpers';
import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { onSetOpenedCardDetailsModalId } from 'models/domain/AppModel/actions';
import { selectOpenedCardDetailsModalId } from 'models/domain/AppModel/selectors';
import { selectUserGroupName } from 'models/domain/OrganizationGroupsModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { onCreateConversationIfDoesNotExist } from 'models/domain/ProjectsModel/actions';
import { selectProjectIsOneToOneConversation, selectProjectIdByObjectId } from 'models/domain/ProjectsModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

function enhance(ComposedComponent) {
  class EnhanceUserInfoPopper extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
      shouldDisplayGoToDirectMessagesButton: PropTypes.bool.isRequired,
    };

    render() {
      return <ComposedComponent {...this.props} onLinkClick={this.onLinkClick} />;
    }

    onLinkClick() {
      const { currentUserId, userId, organizationId } = this.props;
      const conversationPeople = new List([currentUserId, userId]);
      const conversationId = generateConversationId(conversationPeople, organizationId);
      this.props.onCreateConversationIfDoesNotExist(conversationPeople);
      this.props.history.push(makeConversationLink(conversationId));
      this.onHideModalIfOpen();
    }

    onHideModalIfOpen() {
      if (this.props.openedCardDetailsModalId !== null) {
        this.props.onCloseCardDetailsModal();
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const objectId = props.match.params.projectId;
    const projectId = selectProjectIdByObjectId(state, { objectId });
    const currentUserId = selectCurrentUserId(state);

    return {
      currentUserId,
      groupName: selectUserGroupName(state, { userId: props.userId }),
      organizationId: selectCurrentOrganizationId(state),
      openedCardDetailsModalId: selectOpenedCardDetailsModalId(state),
      shouldDisplayGoToDirectMessagesButton: projectId
        ? !selectProjectIsOneToOneConversation(state, { projectId })
        : true,
    };
  };

  function mapDispatchToProps(dispatch) {
    return {
      onCloseCardDetailsModal: () => dispatch(onSetOpenedCardDetailsModalId(null)),
      onCreateConversationIfDoesNotExist: (conversationPeople) =>
        dispatch(onCreateConversationIfDoesNotExist(conversationPeople)),
    };
  }

  return EnhanceWithRouter()(connect(mapStateToProps, mapDispatchToProps)(EnhanceUserInfoPopper));
}

export default enhance;
