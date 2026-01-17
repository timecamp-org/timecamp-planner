import { FC } from 'react';

import Dotdotdot from 'react-dotdotdot';

import { useSelector } from 'common/hooks/useSelector';
import { ellipsizeInTheEnd } from 'common/utils';
import { Id } from 'common/utils/identifier';
import InfoTooltip from 'commonComponents/InfoTooltip';
import useOnHover from 'hooks/useOnHover';
import { selectConversationNameByProjectId } from 'models/domain/ProjectsModel/selectors';

import styles from './styles.css';

const MAX_TEXT_LENGTH = 23;
const POPPER_MODIFIERS = {
  offset: {
    offset: `0, 5px`,
  },
};

type ProjectConversationNamesInterface = {
  projectId: Id;
  className?: string;
  shouldTruncateText?: boolean;
  showFullNameTooltip?: boolean;
};

const defaultProps = {
  shouldTruncateText: true,
};

const ProjectConversationNames: FC<ProjectConversationNamesInterface> = (props) => {
  const name = useSelector((state) => selectConversationNameByProjectId(state, { projectId: props.projectId }));

  const { isHovering, onMouseEnter, onMouseLeave } = useOnHover(false);

  const showTooltip = isHovering && name.length > MAX_TEXT_LENGTH;

  return (
    <div className={props.className || styles.Component} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {props.shouldTruncateText ? (
        <InfoTooltip
          shouldRenderInfoTooltip={showTooltip}
          infoTooltipWrapperClassName={styles.infoTooltip}
          targetComponent={
            <Dotdotdot clamp={1} useNativeClamp className={styles.textBreak}>
              {ellipsizeInTheEnd(name, MAX_TEXT_LENGTH)}
            </Dotdotdot>
          }
          message={<div>{name}</div>}
          popperPlacement="bottom"
          popperModifiers={POPPER_MODIFIERS}
        />
      ) : (
        name
      )}
    </div>
  );
};

ProjectConversationNames.defaultProps = defaultProps;

export default ProjectConversationNames;
