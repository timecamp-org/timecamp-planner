import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';
import { selectProjectIdByListId } from 'models/domain/ListsModel/selectors';
import { onUpdateList } from 'models/domain/ListsModel/actions';

import PureBaseComponent from 'commonEnhancers/PureBaseComponent';

function Enhance(ComposedComponent) {
  class EnhanceSectionOptions extends PureBaseComponent {
    static propTypes = {
      sectionId: PropTypes.string.isRequired,
      onAddCard: PropTypes.func.isRequired,
    };

    state = {
      isDropdownVisible: false,
      isArchiveListModalOpen: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          sectionId={this.props.sectionId}
          userId={this.props.userId}
          isDropdownVisible={this.state.isDropdownVisible}
          isArchiveListModalOpen={this.state.isArchiveListModalOpen}
          sectionOptions={this.props.sectionOptions}
          color={this.props.color}
          onAddCard={this.onAddCard}
          onSetIsDropdownVisible={this.onSetIsDropdownVisible}
          onCopySectionDispatched={this.onCopySectionDispatched}
          onCopySectionCancelled={this.onCopySectionCancelled}
          onMoveSectionDispatched={this.onMoveSectionDispatched}
          onMoveSectionCancelled={this.onMoveSectionCancelled}
          onCardLimitCancelled={this.onCardLimitCancelled}
          onMoveAllCardsDispatched={this.onMoveAllCardsDispatched}
          onMoveAllCardsCancelled={this.onMoveAllCardsCancelled}
          onShowArchiveListModal={this.onShowArchiveListModal}
          onCloseArchiveListModal={this.onCloseArchiveListModal}
          onArchiveList={this.props.onArchiveList}
        />
      );
    }

    onShowArchiveListModal() {
      this.onSetIsDropdownVisible(false);
      this.setState({
        isArchiveListModalOpen: true,
      });
    }

    onCloseArchiveListModal() {
      this.setState({
        isArchiveListModalOpen: false,
      });
    }

    onAddCard() {
      this.onSetIsDropdownVisible(false);
      this.props.onAddCard(this.props.sectionId);
    }

    onSetIsDropdownVisible(isDropdownVisible) {
      this.setState({ isDropdownVisible });
    }

    onCopySectionDispatched() {
      this.onSetIsDropdownVisible(false);
    }

    onCopySectionCancelled() {
      this.onSetIsDropdownVisible(false);
    }

    onMoveSectionDispatched() {
      this.onSetIsDropdownVisible(false);
    }

    onMoveSectionCancelled() {
      this.onSetIsDropdownVisible(false);
    }

    onCardLimitCancelled() {
      this.onSetIsDropdownVisible(false);
    }

    onMoveAllCardsDispatched() {
      this.onSetIsDropdownVisible(false);
    }

    onMoveAllCardsCancelled() {
      this.onSetIsDropdownVisible(false);
    }
  }

  const mapStateToProps = (state, props) => {
    const projectId = selectProjectIdByListId(state, {
      listId: props.sectionId,
    });
    return {
      color: selectProjectColor(state, { projectId }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onArchiveList: () =>
      dispatch(onUpdateList(props.sectionId, { isArchived: true })),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSectionOptions);
}

export default Enhance;
