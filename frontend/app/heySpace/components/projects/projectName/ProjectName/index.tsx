import { CSSProperties, FC, LegacyRef, MouseEventHandler, RefObject } from 'react';

import { doNothing, ellipsizeInTheEnd } from 'common/utils';
import InfoTooltip from 'commonComponents/InfoTooltip';
import useOnHover from 'hooks/useOnHover';

import useComponent, { ProjectNameHookInterface } from './hook';
import styles from './styles.css';

export type ProjectNameInterface = {
  className?: string;
  archivedClassName?: string;
  projectId?: string;
  taskId?: string;
  placeholder?: string;
  maxLength?: number;
  style?: CSSProperties;
  renderWithSpaceColor?: boolean;

  onClick?: MouseEventHandler<HTMLSpanElement>;
  onSetRef?: LegacyRef<HTMLSpanElement>;
  targetRef?: RefObject<HTMLSpanElement>;
};

const defaultProps: Partial<ProjectNameInterface> = {
  className: '',
  placeholder: '',
  maxLength: 0,
  style: {},
  renderWithSpaceColor: false,
  onClick: doNothing,
  onSetRef: doNothing,
};

const ProjectName: FC<ProjectNameInterface> = (props) => {
  const hook = useComponent(props);

  const archivedClass = hook.isArchived ? props.archivedClassName || styles.archived : '';

  const { isHovering, onMouseEnter, onMouseLeave } = useOnHover();
  const showTooltip = isHovering && props.maxLength < hook.projectName.length;

  return (
    <InfoTooltip
      shouldRenderInfoTooltip={showTooltip}
      infoTooltipWrapperClassName={styles.infoTooltip}
      targetComponent={
        <span
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={`${props.className ? props.className : styles.Component} ${archivedClass}`}
          style={getStyle(props, hook)}
          onClick={props.onClick}
          ref={props.targetRef || props.onSetRef}
        >
          {props.maxLength ? ellipsizeInTheEnd(hook.projectName, props.maxLength) : hook.projectName}
          {hook.projectName === '' ? <span className={styles.placeholder}>{props.placeholder}</span> : null}
        </span>
      }
      message={hook.projectName}
      popperPlacement="bottom"
    />
  );
};

function getStyle(props: ProjectNameInterface, hook: ProjectNameHookInterface): CSSProperties {
  if (props.renderWithSpaceColor) {
    return {
      ...props.style,
      color: hook.color,
    };
  } else {
    return props.style;
  }
}

ProjectName.defaultProps = defaultProps;

export default ProjectName;
