import React from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectAllCurrentUserAccessibleTagsInOrder } from "models/domain/TagsModel/selectors";
import { onTagCreate } from "models/domain/TagsModel/actions";
import { onFetchOrganizationTagsOverviewIfDidNotFetchAlready } from "models/domain/RequestModel/actions";
import { selectRequestIsLoading } from "models/domain/RequestModel/selectors";
import { getOrganizationTagsOverview } from "models/domain/RequestModel/constants/requestTypes";
import { selectCurrentOrganizationId } from "models/domain/OrganizationsModel/selectors/domain";
import { selectHasAccessToTags } from "models/domain/SubscriptionLimitsModel/selectors";
import { tagsColors } from "commonStyles/colors";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceTagsOverviewPage extends BaseComponent {
    static propTypes = {
      groupedAndOrderedTags: ImmutablePropTypes.listOf(
        ImmutablePropTypes.contains({
          firstLetter: PropTypes.string.isRequired,
          tagsTaskIds: ImmutablePropTypes.listOf(
            ImmutablePropTypes.contains({
              tagId: PropTypes.string.isRequired,
              taskIds: ImmutablePropTypes.listOf(PropTypes.string.isRequired),
            })
          ),
        })
      ).isRequired,
      currentOrganizationId: PropTypes.string.isRequired,
      isLoading: PropTypes.bool.isRequired,
      hasAccessToTags: PropTypes.bool.isRequired,
      fetchTagsOverviewData: PropTypes.func.isRequired,
    };

    state = {
      isCreateTagPopoverOpen: false,
      tagName: "",
      tagColor: tagsColors[Math.floor(Math.random() * tagsColors.length)],
    };

    render() {
      return (
        <ComposedComponent
          isLoading={this.props.isLoading}
          isCreateTagPopoverOpen={this.state.isCreateTagPopoverOpen}
          hasAccessToTags={this.props.hasAccessToTags}
          groupedAndOrderedTags={this.props.groupedAndOrderedTags}
          tagName={this.state.tagName}
          tagColor={this.state.tagColor}
          isCreateTagDisabled={this.isCreateTagDisabled()}
          onSetIsCreateTagPopoverOpen={this.onSetIsCreateTagPopoverOpen}
          onCreateTag={this.onCreateTag}
          onChangeTagName={this.onChangeTagName}
          onChangeTagColor={this.onChangeTagColor}
        />
      );
    }

    onSetIsCreateTagPopoverOpen(isCreateTagPopoverOpen) {
      this.setState({ isCreateTagPopoverOpen });
    }

    onCreateTag() {
      if (!this.state.tagName) {
        return null;
      }
      this.props.onTagCreate(this.state.tagName, this.state.tagColor);
      this.onSetIsCreateTagPopoverOpen(false);
      this.setState({ tagName: "", tagColor: "" });
    }

    isCreateTagDisabled() {
      return this.state.tagName.trim().length === 0;
    }

    onChangeTagName(event) {
      this.setState({ tagName: event.target.value });
    }

    onChangeTagColor(color) {
      this.setState({ tagColor: color });
    }

    componentDidMount() {
      this.props.fetchTagsOverviewData(this.props.currentOrganizationId);
    }
  }

  const mapStateToProps = (state) => {
    const currentOrganizationId = selectCurrentOrganizationId(state);
    return {
      currentOrganizationId,
      groupedAndOrderedTags: selectAllCurrentUserAccessibleTagsInOrder(state),
      isLoading: selectRequestIsLoading(state, {
        requestType: getOrganizationTagsOverview,
        objectId: currentOrganizationId,
      }),
      hasAccessToTags: selectHasAccessToTags(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    fetchTagsOverviewData: (organizationId) =>
      dispatch(
        onFetchOrganizationTagsOverviewIfDidNotFetchAlready(organizationId)
      ),
    onTagCreate: (name, color) => dispatch(onTagCreate({ name, color })),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTagsOverviewPage);
}

export default enhance;
