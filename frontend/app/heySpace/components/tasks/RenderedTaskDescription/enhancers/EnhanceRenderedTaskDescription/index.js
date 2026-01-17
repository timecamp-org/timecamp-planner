import React from "react";
import PropTypes from "prop-types";

import BaseComponent from "commonEnhancers/BaseComponent";
import MarkdownRenderer from "models/domain/MessagesModel/MarkdownRenderer";
import getBoundMarkdownToReactRenderers from 'commonComponents/MarkdownOutput/markdownToReactRenderers';

function enhance(ComposedComponent) {
  class EnhanceRenderedTaskDescription extends BaseComponent {
    static propTypes = {
      source: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);

      this.markdownRenderer = new MarkdownRenderer({
        getBoundRenderers: getBoundMarkdownToReactRenderers({
          shouldRenderLinkPreview: false,
          shouldRenderMention: false,
          shouldRenderHail: false,
          paragraphShouldHaveTopMargin: true,
        }),
      });
    }

    render() {
      return <ComposedComponent markdownOutput={this.getMarkdownOutput()} />;
    }

    getMarkdownOutput() {
      return this.markdownRenderer.getRenderableOutput(this.props.source);
    }
  }

  return EnhanceRenderedTaskDescription;
}

export default enhance;
