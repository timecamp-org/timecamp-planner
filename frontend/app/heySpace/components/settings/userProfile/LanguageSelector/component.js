import { Button } from '@mui/material';
import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import Dropdown from 'commonComponents/Dropdown';
import { getLanguageTag } from 'i18n/languageTags';

import styles from './styles.css';

LanguageSelector.propTypes = {
  className: PropTypes.string,
  selectedLanguage: PropTypes.string,
  availableLanguages: ImmutablePropTypes.list,

  onSelectLanguage: PropTypes.func,
};

LanguageSelector.defaultProps = {
  className: '',
  selectedLanguage: 'en',
  availableLanguages: new List(),

  onSelectLanguage: doNothing,
};

function LanguageSelector(props) {
  return (
    <Dropdown
      className={props.className}
      items={props.availableLanguages}
      selectedItemId={props.selectedLanguage}
      buttonRenderer={renderLanguageDropdownButton}
      dropdownItemRenderer={renderLanguageOption}
      onSelectItem={props.onSelectLanguage}
    />
  );

  function renderLanguageDropdownButton() {
    return (
      <Button variant="text" className={styles.dropdownButton} color={props.color}>
        {getLanguageTag(props.selectedLanguage)}
      </Button>
    );
  }

  function renderLanguageOption(languageKey) {
    return (
      <Button variant="text" className={styles.languageOption}>
        {getLanguageTag(languageKey)}
      </Button>
    );
  }
}

export default LanguageSelector;
