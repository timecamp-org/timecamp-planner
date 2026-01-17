import { Tags } from 'commonComponents/Icons/fontawesome/Tags';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation/component';
import { PropertyButton } from 'components/buttons/PropertyButton';
import TagList from 'components/tags/TagList';
import { getConditionalClass } from 'utils/getConditionalClass';

import { PureCardInterface } from '..';
import styles from '../styles.css';

export function renderTagList({
  cardProps,
  showAddTagOnBelowMaxLimit,
  showTagsOnEmpty,
}: {
  cardProps: PureCardInterface;
  showTagsOnEmpty?: boolean;
  showAddTagOnBelowMaxLimit?: boolean;
}) {
  return (
    <StopClickEventPropagation>
      <TagList
        objectId={cardProps.taskId}
        className={styles.tagList}
        isDeletable
        showAddTagOnEmpty={showTagsOnEmpty}
        showAddTagOnBelowMaxLimit={showAddTagOnBelowMaxLimit}
        maxTagsToShow={2}
        tagClassName={styles.tag}
        customButtonClassName={`${styles.addTagButton} ${styles.emptyProperty} ${getConditionalClass(
          styles.visible,
          cardProps.hook.isHovering
        )}`}
        addTagButtonRenderer={({ isOpen, onOpen }) => (
          <PropertyButton
            isActive={isOpen}
            onClick={() => {
              if (!isOpen) {
                onOpen();
              }
            }}
            className={styles.emptyPropertyButtonSize}
            icon={<Tags size="xs" className={styles.icon} />}
          />
        )}
      />
    </StopClickEventPropagation>
  );
}
