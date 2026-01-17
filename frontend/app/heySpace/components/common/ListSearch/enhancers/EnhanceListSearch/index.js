import React from "react";
import PropTypes from "prop-types";
import { List } from "immutable";
import ImmutablePropTypes from "react-immutable-proptypes";
import EnhanceWithClickOutside from "react-click-outside";

import { doNothing } from "common/utils";

import BaseComponent from "commonEnhancers/BaseComponent";

const emptyList = new List();

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceListSearch extends BaseComponent {
    static propTypes = {
      list: ImmutablePropTypes.list.isRequired,
      defaultList: ImmutablePropTypes.list,
      excludedList: ImmutablePropTypes.list,

      listFilter: PropTypes.func.isRequired,
      onResetError: PropTypes.func,
      onClickOutside: PropTypes.func,
    };

    static defaultProps = {
      list: emptyList,
      excludedList: emptyList,

      onResetError: doNothing,
      onClickOutside: doNothing,
    };

    state = {
      value: "",
      list: this.props.list.filter(
        (item) => this.props.excludedList.indexOf(item) === -1
      ),
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          value={this.state.value}
          list={this.getList()}
          defaultList={this.props.defaultList}
          shouldRenderDefaultList={!this.state.value || this.state.value === ""}
          clearSearchPhraseCallback={this.clearSearchPhraseCallback}
          onChange={this.onChange}
        />
      );
    }

    onChange(value) {
      if (value === "") {
        this.props.onResetError();
      }

      this.setState({
        value,
      });
    }

    getList() {
      const { listFilter, list, excludedList } = this.props;

      return listFilter
        ? listFilter(list, this.state.value).filter(
            (item) => excludedList.indexOf(item) === -1
          )
        : list;
    }

    clearSearchPhraseCallback() {
      this.setState({
        value: "",
      });
    }

    handleClickOutside() {
      const { list, value } = this.state;
      this.props.onClickOutside(list, value);
    }
  }

  return EnhanceListSearch;
}

export default enhance;
