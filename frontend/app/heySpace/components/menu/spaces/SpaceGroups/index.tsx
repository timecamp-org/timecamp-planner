import React, { memo, FC } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import styles from './styles.css'
import DraggableSpaceGroup from '../DraggableSpaceGroup'
import useComponent from './hook'
import { Id } from 'common/utils/identifier'
import ListContentSkeletonLoader from 'commonComponents/ListContentSkeletonLoader'
import colors from 'styles/colors.css'
import { ProjectDroppableType } from 'models/domain/PersonalProjectStructureModel/types'
import { List } from 'immutable'

type SpaceGroupsInterface = {
  className?: string,
}

const defaultProps = {
}

const SpaceGroups: FC<SpaceGroupsInterface> = (props) => {
  const hook = useComponent()

  if (!hook.isRequestFinished) {
    return renderSkeleton()
  }
  return (
    <Droppable
      droppableId={ProjectDroppableType.GROUP}
      type={'SPACE_GROUP'}
    >
      {(provided) => (
        <div
          className={props.className}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <InnerList
            projectGroupIds={hook.projectGroupIds}
          />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

function renderSkeleton() {
  return (
    <div className={styles.skeletonWrapper}>
      <ListContentSkeletonLoader
        backgroundColor={colors.darkTwoColor}
        foregroundColor={colors.duskColor}
      />
    </div>
  )
}

type InnerListInterface = {
  projectGroupIds: List<Id>,
}

const InnerList: FC<InnerListInterface> = memo((props) => (
  <>
    {props.projectGroupIds.map(renderGroup)}
  </>
))

function renderGroup(groupId: Id, index: number) {
  return (
    <DraggableSpaceGroup
      groupId={groupId}
      index={index}
      key={groupId}
    />
  )
}

SpaceGroups.defaultProps = defaultProps

export default SpaceGroups
