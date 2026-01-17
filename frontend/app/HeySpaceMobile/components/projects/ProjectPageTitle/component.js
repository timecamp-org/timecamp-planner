import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import isNil from 'lodash/isNil';

import { View, Text } from 'react-native';
import GroupConversationName from '../../menu/GroupConversationName';
import PersonFullName from '../../person/PersonFullName';

ProjectPageTitle.propTypes = {
  spaceName: PropTypes.string,
  conversationId: PropTypes.string,
  conversationWithUserId: PropTypes.string,
};

function ProjectPageTitle(props) {
  return <View>{renderContent(props)}</View>;
}

function renderContent(props) {
  if (!isNil(props.spaceName)) {
    return (
      <Text numberOfLines={2} style={styles.titleText}>
        {props.spaceName}
      </Text>
    );
  } else if (props.conversationId) {
    return <GroupConversationName style={styles.titleText} conversationId={props.conversationId} />;
  } else if (props.conversationWithUserId) {
    return (
      <PersonFullName
        style={styles.titleText}
        userId={props.conversationWithUserId}
        shouldAddYouInParenthesesIfCurrent
      />
    );
  } else {
    return <Text style={styles.titleText}>{'Project name not set'}</Text>;
  }
}

export default ProjectPageTitle;
