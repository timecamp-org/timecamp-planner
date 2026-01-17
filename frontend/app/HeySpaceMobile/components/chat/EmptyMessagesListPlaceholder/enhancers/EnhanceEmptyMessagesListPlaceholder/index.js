import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'BaseComponent';
import { selectConversationName, selectProjectType } from 'models/domain/ProjectsModel/selectors';
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain';
import { ProjectType } from 'models/domain/ProjectsModel/types';
import { selectEntityType } from 'models/domain/EntityModel/selectors';
import { EntityType } from 'models/domain/EntityModel/types';

function enhance(ComposedComponent) {
  class EnhanceEmptyMessagesListPlaceholder extends BaseComponent {
    static propTypes = {
      objectId: PropTypes.string.isRequired,
    };

    render() {
      const { title, subTitle } = this.getPlaceholderText();

      return <ComposedComponent title={title} subTitle={subTitle} />;
    }

    isProjectOwnConversation() {
      return this.props.projectType === ProjectType.DIRECT_CHAT && this.props.projectPeople.size === 1;
    }

    isProjectConversation() {
      return this.props.projectType === ProjectType.DIRECT_CHAT;
    }

    getPlaceholderText() {
      if (this.props.objectType === EntityType.TASK_DATA) {
        return {
          title: 'No conversations in this task.',
          subTitle: '',
        };
      } else if (this.isProjectOwnConversation()) {
        return {
          title: 'This is only your project.',
          subTitle: `Send messages to yourself with links, files, drafts or anything you need. Is it not enough for your needs? Try My tasks and focus only on your tasks.`,
        };
      } else if (this.isProjectConversation()) {
        return {
          title: 'No messages yet.',
          subTitle: `Don’t be shy, send a message to ${this.props.conversationName} and fill this empty project.`,
        };
      } else {
        return {
          title: 'What a quiet team!',
          subTitle: 'Don’t be shy, send a message to your team and fill this empty project',
        };
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const objectType = selectEntityType(state, { entityId: props.objectId });

    if (objectType === EntityType.TASK_DATA) {
      return {
        objectType,
      };
    } else {
      return {
        objectType,
        projectType: selectProjectType(state, { projectId: props.objectId }),
        projectPeople: selectProjectPeople(state, { projectId: props.objectId }),
        conversationName: selectConversationName(state, { conversationId: props.objectId }),
      };
    }
  };

  return connect(mapStateToProps)(EnhanceEmptyMessagesListPlaceholder);
}

export default enhance;
