import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { doNothing } from "common/utils";

import { selectListName } from "models/domain/ListsModel/selectors";
import { onUpdateList } from "models/domain/ListsModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceSectionNameIO extends BaseComponent {
    static propTypes = {
      sectionId: PropTypes.string.isRequired,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,

      sectionName: PropTypes.string.isRequired,
      onSectionUpdate: PropTypes.func.isRequired,
    };

    static defaultProps = {
      onFocus: doNothing,
      onBlur: doNothing,
    };

    state = {
      isFocused: false,
      sectionName: this.props.sectionName,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          sectionId={this.props.sectionId}
          isFocused={this.state.isFocused}
          sectionNameInputValue={this.state.sectionName}
          maxLength={this.props.maxLength}
          inputRef={this.inputRef}
          onChangeSectionName={this.onChangeSectionName}
          onCancel={this.onCancel}
          onKeyDown={this.onKeyDown}
          onSetIsFocused={this.onSetIsFocused}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      );
    }

    inputRef(ref) {
      this.input = ref;
    }

    onChangeSectionName(event) {
      this.setState({
        sectionName: event.target.value,
      });
    }

    onFocus(event) {
      this.props.onFocus();
    }

    onKeyDown(event) {
      if (event.key === "Enter") {
        event.stopPropagation();
        const text = event.target.value;
        this.onSectionUpdate(text);
      } else if (event.key === "Escape") {
        event.stopPropagation();
        this.onCancel();
      }
    }

    onBlur(event) {
      const text = event.target.value;
      this.onSectionUpdate(text);
      this.props.onBlur();
    }

    onSectionUpdate(text) {
      if (text !== this.props.sectionName) {
        this.props.onSectionUpdate(text);
      }
      this.onSetIsFocused(false);
    }

    onCancel() {
      this.setState({
        sectionName: this.props.sectionName,
        isFocused: false,
      });
    }

    onSetIsFocused(isFocused) {
      this.setState({ isFocused });
    }

    componentDidUpdate(prevProps) {
      if (
        !this.state.isFocused &&
        this.props.sectionName !== this.state.sectionName
      ) {
        this.setState({
          sectionName: this.props.sectionName,
        });
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      sectionName: selectListName(state, { listId: props.sectionId }),
    };
  };

  function mapDispatchToProps(dispatch, props) {
    return {
      onSectionUpdate: (name) =>
        dispatch(onUpdateList(props.sectionId, { name })),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSectionNameIO);
}

export default Enhance;
