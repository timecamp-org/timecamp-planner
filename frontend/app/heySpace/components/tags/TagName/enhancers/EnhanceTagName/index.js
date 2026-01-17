import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import * as TagsSelectors from "models/domain/TagsModel/selectors";

function enhance(Component) {
  class EnhanceTagName extends BaseComponent {
    static propTypes = {
      tagId: PropTypes.string.isRequired,
    };

    render() {
      return <Component name={this.props.name} />;
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      name: TagsSelectors.selectTagNameById(state, { tagId: props.tagId }),
    };
  };

  return connect(mapStateToProps)(EnhanceTagName);
}

export default enhance;
