import React from 'react'
import PropTypes from 'prop-types'

import ConvertToCardCommentPopoverContent from 'commonComponents/ConvertToCardCommentPopoverContent'

function ConvertChecklistItemToCardComment(props) {
  return (
    <ConvertToCardCommentPopoverContent
      isAddCardDisabled={props.isAddCardDisabled}
      color={props.color}
      spaceIds={props.spaceIds}
      listIds={props.listIds}
      cardIds={props.cardIds}
      selectedSpaceId={props.selectedSpaceId}
      selectedListId={props.selectedListId}
      selectedCardId={props.selectedCardId}

      onSelectSpaceId={props.onSelectSpaceId}
      onSelectListId={props.onSelectListId}
      onSelectCardId={props.onSelectCardId}
      onClickClosePopover={props.onClickClosePopover}
      onConvertToCardComment={props.onConvertToCardComment}
    />
  )
}

export default ConvertChecklistItemToCardComment
