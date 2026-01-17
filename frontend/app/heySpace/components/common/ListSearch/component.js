import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';

import { Delete } from 'commonComponents/Icons';

ListSearch.propTypes = {
  className: PropTypes.string,
  classNameTitle: PropTypes.string,
  classNameInputWrapper: PropTypes.string,
  classNameInput: PropTypes.string,
  classNameList: PropTypes.string,

  title: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  inputType: PropTypes.string,
  shouldRenderCloseIcon: PropTypes.bool,

  inputRef: PropTypes.func,
  footerRenderer: PropTypes.func,
  emptyListRenderer: PropTypes.func,
  onChange: PropTypes.func,
  onClickDelete: PropTypes.func,
};

ListSearch.defaultProps = {
  title: '',
  placeholder: '',
  value: '',
  inputType: 'text',
  shouldRenderCloseIcon: false,

  inputRef: doNothing,
  footerRenderer: doNothing,
  emptyListRenderer: doNothing,
  onChange: doNothing,
  onClickDelete: doNothing,
};

function ListSearch(props) {
  return (
    <div className={props.className || styles.Component}>
      <div
        className={`${props.classNameHeader || styles.header} ${
          props.error ? styles.headerWithError : ''
        }`}
      >
        {props.title ? (
          <div className={props.classNameTitle || styles.title}>
            {props.title}
          </div>
        ) : null}
        <div className={props.classNameInputWrapper || styles.inputWrapper}>
          {props.inputRenderer ? (
            props.inputRenderer(props)
          ) : (
            <input
              ref={props.inputRef}
              className={props.classNameInput || styles.input}
              type={props.inputType}
              placeholder={props.placeholder}
              value={props.value}
              onChange={(event) => props.onChange(event.target.value)}
              autoFocus
            />
          )}
          {props.error ? (
            <div className={styles.error}>{props.error}</div>
          ) : null}
          {props.shouldRenderCloseIcon ? (
            <Delete className={styles.delete} onClick={props.onClickDelete} />
          ) : null}
        </div>
      </div>
      <div className={props.classNameList || styles.list}>
        {props.shouldRenderDefaultList &&
        props.defaultList &&
        props.defaultList.size > 0
          ? props.defaultList.map((item, index) =>
              props.defaultRowRenderer({
                item,
                index,
                ...props,
              })
            )
          : props.list.map((item, index) =>
              props.rowRenderer({
                item,
                index,
                ...props,
              })
            )}
      </div>
      {props.list.size === 0 ||
      (props.shouldRenderDefaultList &&
        props.defaultList &&
        props.defaultList.size === 0)
        ? props.emptyListRenderer(props)
        : null}
      <div className={props.classNameFooter || styles.footer}>
        {props.footerRenderer(
          props.list,
          props.value,
          props.clearSearchPhraseCallback
        )}
      </div>
    </div>
  );
}

export default ListSearch;
