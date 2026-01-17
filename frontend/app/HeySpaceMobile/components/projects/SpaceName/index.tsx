import React, { FC } from 'react'

import { Text } from 'react-native'
import { ellipsizeInTheEnd } from 'common/utils'
import { AnyDict } from '../../../../common/types'
import { selectProjectName } from 'models/domain/ProjectsModel/selectors'
import { Id } from '../../../../common/utils/identifier'
import { useSelector } from '../../../../common/hooks/useSelector'

type SpaceNameInterface = {
  spaceId: Id,
  style?: AnyDict,
  numberOfLines?: number,
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
  maxLength?: number,
}

const defaultProps: Partial<SpaceNameInterface> = {
  numberOfLines: 1,
  ellipsizeMode: 'tail',
  maxLength: 0,
}

const SpaceName: FC<SpaceNameInterface> = (props) => {
  const spaceName = useSelector(state => selectProjectName(state, { projectId: props.spaceId }))
  return (
    <Text
      style={props.style}
      numberOfLines={props.numberOfLines}
      ellipsizeMode={props.ellipsizeMode}
    >
      {props.maxLength ? ellipsizeInTheEnd(spaceName, props.maxLength) : spaceName}
    </Text>
  )
}

SpaceName.defaultProps = defaultProps

export default SpaceName
