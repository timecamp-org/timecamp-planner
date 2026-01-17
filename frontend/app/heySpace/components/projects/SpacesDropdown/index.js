import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import Dropdown from 'commonComponents/Dropdown';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import SecondaryButton from 'components/buttons/SecondaryButton';
import ProjectName from 'components/projects/projectName/ProjectName/withTooltip';
import { useTranslation } from 'i18n';

import styles from './styles.css';

const emptyList = new List();

SpacesDropdown.propTypes = {
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  buttonOpenClassName: PropTypes.string,
  selectedSpaceId: PropTypes.string,
  color: PropTypes.string,
  listIds: ImmutablePropTypes.list,

  onSelectSpaceId: PropTypes.func,
  onClickDropdownButton: PropTypes.func,
};

SpacesDropdown.defaultProps = {
  spaceIds: emptyList,
  onSelectSpaceId: doNothing,
  onClickDropdownButton: doNothing,
};

function SpacesDropdown(props) {
  const { t } = useTranslation();

  return (
    <Dropdown
      items={props.spaceIds}
      className={props.className}
      dropdownClassName={props.dropdownClassName || styles.dropdownContent}
      isDisabled={props.selectedSpaceId ? false : true}
      onSelectItem={props.onSelectSpaceId}
      buttonRenderer={renderSpaceDropdownButton}
      dropdownItemRenderer={renderSpaceDropdownItem}
      selectedItemId={props.selectedSpaceId}
    />
  );

  function renderSpaceDropdownButton(isOpen) {
    const shouldBeDisabled = props.selectedSpaceId ? false : true;
    const selectClosedClass = props.buttonClassName || styles.dropdownButton;
    const selectOpenClass = props.buttonOpenClassName || styles.dropdownButtonOpen;
    const className = isOpen ? selectOpenClass : selectClosedClass;

    return (
      <SecondaryButton
        className={className}
        color={props.color}
        isDisabled={shouldBeDisabled}
        onClick={props.onClickDropdownButton}
      >
        {shouldBeDisabled ? (
          t('New project')
        ) : (
          <ProjectName projectId={props.selectedSpaceId} className={styles.selectedList} />
        )}
        {shouldBeDisabled ? null : isOpen ? (
          <ChevronUp className={styles.dropdownButtonIcon} />
        ) : (
          <ChevronDown className={styles.dropdownButtonIcon} />
        )}
      </SecondaryButton>
    );
  }

  function renderSpaceDropdownItem(spaceId) {
    return (
      <SecondaryButton key={`Space_${spaceId}`} className={styles.dropdownItem}>
        <ProjectName className={styles.projectName} projectId={spaceId} />
      </SecondaryButton>
    );
  }
}

export default SpacesDropdown;
