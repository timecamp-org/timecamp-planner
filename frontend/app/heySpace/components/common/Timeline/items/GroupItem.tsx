/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactCalendarGroupRendererProps, TimelineGroupBase } from 'react-calendar-timeline';

import PersonFullName from 'components/person/PersonFullName';
import { PersonGroup } from 'components/person/PersonGroup/PersonGroup';
import PersonIcon from 'components/person/PersonIcon';

import cssStyles from '../styles.css';

import 'react-calendar-timeline/lib/Timeline.css';

export const GroupItem = (props: ReactCalendarGroupRendererProps<TimelineGroupBase>) => {
  const {
    group: { id },
  } = props;

  return (
    <div className={cssStyles.groupItem} data-user-id={id}>
      <PersonIcon userId={id} height={25} width={25} wrapperClassName={cssStyles.avatar} />
      <div className={cssStyles.groupItemDetails}>
        <PersonFullName className={cssStyles.personName} userId={id} />
        <PersonGroup userId={id} />
      </div>
    </div>
  );
};
