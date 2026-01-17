import { date, number, withKnobs } from '@storybook/addon-knobs'
import { day, hour } from 'common/utils/timeIntervalDefinitions'
import { List } from 'immutable'
import TimelineCard from '../../overwatch/timeline/TimelineCard'
import Timeline from './index'

const groupId = 'group::1'
const groups = [{ id: groupId, title: 'Group 1' }]
const items = List([
  {
    id: 'task::001',
    group: groupId,
    start_time: 1583229600000,
    end_time: 1583787599999,
  },
  {
    id: 'task::002',
    group: groupId,
    start_time: 1583344800000,
    end_time: 1583935199999,
  },
  {
    id: 'task::003',
    group: groupId,
    start_time: 1583208000000,
    end_time: 1583492400000,
  },
])

const title = 'common/Timeline'

export const output = () => {
  const visibleTimeStart = date('Time start', new Date('03.03.2020'), title)
  const visibleTimeEnd = date('Time end', new Date('03.16.2020'), title)
  const minZoom = day * number('Min timeline zoom (days)', 7, { range: true, min: 1, max: 365, step: 1 }, title)
  const maxZoom = day * number('Max timeline zoom (days)', 14, { range: true, min: 1, max: 365, step: 1 }, title)
  const dragSnap = hour * number('Timeline move/resize drag snap (hours)', 1, { range: true, min: 1, max: 168, step: 1 }, title)

  return (
    <div style={{ width: '100%' }}>
      <Timeline
        groups={groups}
        items={items}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        minZoom={minZoom}
        maxZoom={maxZoom}
        dragSnap={dragSnap}
        itemRenderer={({ item: { id }, isSelected, isResizeHandleVisible }) => (
          <TimelineCard
            cardId={id}
            isSelected={isSelected}
            isResizeHandleVisible={isResizeHandleVisible}
          />
        )}
      />
    </div>
  )
}

export default { title, decorators: [withKnobs] }

