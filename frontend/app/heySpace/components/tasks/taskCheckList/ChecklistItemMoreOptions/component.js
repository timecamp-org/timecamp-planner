import PropTypes from 'prop-types';

import { Clone } from 'commonComponents/Icons/fontawesome/Clone';
import ConvertChecklistItemToCard from 'components/tasks/taskCheckList/ConvertChecklistItemToCard';
import ConvertChecklistItemToCardComment from 'components/tasks/taskCheckList/ConvertChecklistItemToCardComment';
import { useTranslation } from 'i18n/index';

import commonStyles from 'styles/common.css';
import SecondaryButton from '../../../buttons/SecondaryButton';
import { Comment } from '../../../common/Icons/fontawesome/Comment';
import { DotsVertical } from '../../../common/Icons/fontawesome/DotsVertical';
import { TrashCan } from '../../../common/Icons/fontawesome/TrashCan';
import UniversalPopover from '../../../common/UniversalPopover';

import { ChecklistItemMoreOptionsContentType } from './enhancers/EnhanceChecklistItemMoreOptions';
import styles from './styles.css';

ChecklistItemMoreOptions.propTypes = {
  isPopoverOpen: PropTypes.bool,
  checklistItemId: PropTypes.string,
  taskId: PropTypes.string,
  contentType: PropTypes.string,
  onThreeDotsClick: PropTypes.func,
  onClosePopover: PropTypes.func,
  onChoseConvertToCard: PropTypes.func,
  onChoseConvertToCardComment: PropTypes.func,
  onRemoveItemFromChecklist: PropTypes.func,
};

function ChecklistItemMoreOptions(props) {
  const { t } = useTranslation();

  return (
    <UniversalPopover
      popperContentWrapperClassName={styles.popoverContentWrapper}
      isPopoverOpened={props.isPopoverOpen}
      targetComponent={renderTarget(props)}
      popperComponent={renderContent(props, t)}
      shouldRenderArrow={false}
      popperPlacement="bottom"
      popperModifiers={{
        offset: {
          offset: `-100%, ${parseInt(commonStyles.gridCellSize, 10) * 2}`,
        },
        preventOverflow: {
          boundariesElement: 'window',
        },
      }}
    />
  );
}

function renderContent(props, t) {
  switch (props.contentType) {
    case ChecklistItemMoreOptionsContentType.convertToCard: {
      return (
        <ConvertChecklistItemToCard
          checklistItemId={props.checklistItemId}
          taskId={props.taskId}
          onClickClosePopover={props.onClosePopover}
        />
      );
    }
    case ChecklistItemMoreOptionsContentType.convertToCardComment: {
      return (
        <ConvertChecklistItemToCardComment
          checklistItemId={props.checklistItemId}
          taskId={props.taskId}
          onClickClosePopover={props.onClosePopover}
        />
      );
    }
    case ChecklistItemMoreOptionsContentType.contentPicker:
    default: {
      return (
        <>
          <ul className={styles.optionsList}>
            {renderContentPickerItem(t('Convert to task'), Clone, props.color, props.onChoseConvertToCard)}
            {renderContentPickerItem(
              t('Convert to task comment'),
              Comment,
              props.color,
              props.onChoseConvertToCardComment,
            )}
            {renderContentPickerItem(t('Delete'), TrashCan, props.color, props.onRemoveItemFromChecklist)}
          </ul>
        </>
      );
    }
  }
}

function renderContentPickerItem(caption, Icon, color, onClick) {
  return (
    <li className={styles.optionsListItem}>
      <SecondaryButton color={color} className={styles.optionButton} onClick={onClick}>
        <Icon className={styles.icon} />
        <span>{caption}</span>
      </SecondaryButton>
    </li>
  );
}

function renderTarget(props) {
  return (
    <div onClick={props.onThreeDotsClick} className={styles.threeDotsIconWrapper}>
      <DotsVertical className={styles.threeDotsIcon} />
    </div>
  );
}

export default ChecklistItemMoreOptions;
