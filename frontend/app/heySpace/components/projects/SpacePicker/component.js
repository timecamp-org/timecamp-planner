import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import Checkbox from 'commonComponents/Checkbox';
import Dropdown from 'commonComponents/Dropdown';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import ProjectName from 'components/projects/projectName/ProjectName';
import { useTranslation } from 'i18n';

import styles from './styles.css';

const emptyList = new List();

SpacePicker.propTypes = {
  className: PropTypes.string,
  spaceIds: ImmutablePropTypes.list,
  selectedSpaceIds: ImmutablePropTypes.list,
  isOpen: PropTypes.bool,

  onSelectSpaceId: PropTypes.func,
  onClickButtonDispatched: PropTypes.func,
};

SpacePicker.defaultProps = {
  className: '',
  spaceIds: emptyList,
  selectedSpaceIds: emptyList,
  isOpen: false,
  onSelectSpaceId: doNothing,
  onClickButtonDispatched: doNothing,
};

function SpacePicker(props) {
  const { t } = useTranslation();

  return (
    <Dropdown
      className={props.className || styles.Component}
      dropdownClassName={styles.dropdownContent}
      focusedItemClassName={styles.focusedItemClassName}
      isAutoStretch={false}
      items={props.spaceIds}
      shouldCloseAfterItemClick={false}
      buttonRenderer={renderButton}
      dropdownItemRenderer={renderItem}
      onSelectItem={props.onSelectSpaceId}
      onClickButtonDispatched={props.onClickButtonDispatched}
    />
  );

  function renderButton() {
    return (
      <button className={styles.button}>
        <p className={styles.buttonText}>
          {props.selectedSpaceIds.size > 0
            ? t('{{spacesCount}} selected', {
                spacesCount: props.selectedSpaceIds.size,
              })
            : t('Select project')}
        </p>
        {props.isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>
    );
  }

  function renderItem(projectId) {
    const isSelected = props.selectedSpaceIds.includes(projectId);

    return (
      <div
        key={`SpacePicker_${projectId}`}
        className={styles.dropdownItem}
        onClick={() => props.onSelectSpaceId(projectId)}
      >
        <Checkbox isChecked={isSelected} />
        <ProjectName projectId={projectId} className={styles.projectName} maxLength={20} />
      </div>
    );
  }
}

export default SpacePicker;
