import React from 'react';

import { List } from 'immutable';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { availableResources } from 'i18n';
import { onUpdateUser } from 'models/domain/UsersModel/actions';
import { selectCurrentUserLocale } from 'models/domain/UsersModel/selectors/domain';

const availableLanguages = new List(Object.keys(availableResources));

function EnhanceLanguageSelector(ComposedComponent) {
  class EnhanceLanguageSelector extends BaseComponent {
    static propTypes = {};

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          selectedLanguage={this.props.userLocale}
          availableLanguages={availableLanguages}
          onSelectLanguage={this.onSelectLanguage}
        />
      );
    }

    onSelectLanguage(locale) {
      this.props.onUpdateUserLocale(locale);
    }
  }

  function mapStateToProps(state) {
    return {
      userLocale: selectCurrentUserLocale(state),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onUpdateUserLocale: (locale) => dispatch(onUpdateUser({ locale }, true)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceLanguageSelector);
}

export default EnhanceLanguageSelector;
