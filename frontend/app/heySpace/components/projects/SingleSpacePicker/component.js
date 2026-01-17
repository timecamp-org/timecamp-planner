import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'immutable-prop-types';
import { List } from 'immutable';
import styles from './styles.css';
import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';

import Dropdown from 'commonComponents/Dropdown';
import ProjectName from 'components/projects/projectName/ProjectName';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { ChevronUp, ChevronDown } from 'commonComponents/Icons';

SingleSpacePicker.propTypes = {
  className: PropTypes.string,
  spaceIds: ImmutablePropTypes.list,
  selectedSpaceId: PropTypes.string,
  isOpen: PropTypes.bool,

  onSelectSpaceId: PropTypes.func,
  onClickButtonDispatched: PropTypes.func,
};

SingleSpacePicker.defaultProps = {
  className: '',
  spaceIds: new List(),
  isOpen: false,
  onSelectSpaceId: doNothing,
  onClickButtonDispatched: doNothing,
};

const MAX_SPACE_LENGTH = 20;

function SingleSpacePicker(props) {
  const { t } = useTranslation();
  if (props.spaceIds.size > 0) {
    return (
      <Dropdown
        className={props.className || styles.Component}
        dropdownClassName={styles.dropdownContent}
        focusedItemClassName={styles.focusedItemClassName}
        items={props.spaceIds}
        buttonRenderer={renderButton}
        dropdownItemRenderer={renderItem}
        isAutoStretch={false}
        onSelectItem={props.onSelectSpaceId}
        onClickButtonDispatched={props.onClickButtonDispatched}
      />
    );
  } else {
    return renderCaseEmptySpaces(t);
  }

  function renderButton() {
    return (
      <SecondaryButton>
        {props.isOpen ? (
          <ChevronUp className={styles.dropdownButtonIcon} />
        ) : (
          <ChevronDown className={styles.dropdownButtonIcon} />
        )}
        {props.selectedSpaceId ? (
          <ProjectName projectId={props.selectedSpaceId} maxLength={MAX_SPACE_LENGTH} />
        ) : (
          t('Select project')
        )}
      </SecondaryButton>
    );
  }

  function renderItem(projectId) {
    return (
      <div
        key={`SingleSpacePicker_${projectId}`}
        className={styles.dropdownItem}
        onClick={() => props.onSelectSpaceId(projectId)}
      >
        <ProjectName projectId={projectId} className={styles.projectName} maxLength={MAX_SPACE_LENGTH} />
      </div>
    );
  }
}

function renderCaseEmptySpaces(t) {
  return <div className={styles.emptySpaces}>{t('No more available projects to choose')}</div>;
}

export default SingleSpacePicker;
