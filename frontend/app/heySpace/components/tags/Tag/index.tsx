import React from 'react';

import { doNothing, ellipsizeInTheEnd } from 'common/utils';
import { Id } from 'common/utils/identifier';
import { X } from 'commonComponents/Icons';

import { useComponent } from './hook';
import styles from './styles.css';

export type TagInterface = {
  tagId: Id;
  className?: string;
  isDeletable?: boolean;
  maxTagLength?: number;
  onRemoveTag?: (tagId: Id) => void;
};

const defaultProps = {
  isDeletable: true,
  onRemoveTag: doNothing,
  maxTagLength: -1,
};

const Tag: React.FC<TagInterface> = (props) => {
  const hook = useComponent(props);
  const shouldRenderDelete = hook.isHovering && props.isDeletable;

  return (
    <div
      className={props.className || styles.tag}
      style={{ backgroundColor: hook.tagColor }}
      onMouseEnter={hook.onMouseEnter}
      onMouseLeave={hook.onMouseLeave}
    >
      {ellipsizeInTheEnd(hook.tagName, props.maxTagLength)}
      {shouldRenderDelete && (
        <X className={styles.removeIcon} style={{ backgroundColor: hook.tagColor }} onClick={hook.onRemoveTag} />
      )}
    </div>
  );
};

Tag.defaultProps = defaultProps;

export default Tag;
