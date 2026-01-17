import React, { useCallback } from 'react'
import { useComponent } from "./hook";
import { View } from "react-native";
import styles from "./styles";
import navMenuStyles from '../../../styles/navMenu'
import { ConversationDescriptor } from "common/models/domain/ProjectsModel/models";
import TeamNavButton from 'components/menu/TeamNavButton'
import ListContentSkeletonLoader from 'components/skeletons/ListContentSkeletonLoader'
import {
  darkTwoColor,
  duskColor,
} from 'styles/colors'

export const TeamNavLinkList: React.FC = (): React.ReactElement => {
  const hook = useComponent()

  const renderTeamNavButton = useCallback((descriptor: ConversationDescriptor) => {
    const conversationId = descriptor.get('conversationId')
    const people = descriptor.get('people')
    const type = descriptor.get('type')

    return (
      <TeamNavButton
        key={conversationId}
        conversationId={conversationId}
        people={people}
        type={type}
        isSelected={hook.isSelected(conversationId)}
      />
    )
  }, [hook.isSelected])

  if (hook.isLoading) {
    return renderSkeleton()
  }

  return (
    <View style={styles.container}>
      {
        hook.conversationDescriptors.map(renderTeamNavButton)
      }
    </View>
  )
}

function renderSkeleton() {
  return (
    <View style={navMenuStyles.skeletonWrapper}>
      <ListContentSkeletonLoader
        backgroundColor={darkTwoColor}
        foregroundColor={duskColor}
      />
    </View>
  )
}

export default TeamNavLinkList
