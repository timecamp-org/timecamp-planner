import React from 'react'
import ConvertToCardPopoverContent from 'commonComponents/ConvertToCardPopoverContent'

function ConvertChecklistItemToCard(props) {
  return (
    <ConvertToCardPopoverContent
      isAddCardDisabled={props.isAddCardDisabled}
      color={props.color}
      spaceIds={props.spaceIds}
      listIds={props.listIds}
      selectedSpaceId={props.selectedSpaceId}
      selectedListId={props.selectedListId}
      cardName={props.cardName}

      onSelectSpaceId={props.onSelectSpaceId}
      onSelectListId={props.onSelectListId}
      onClickClosePopover={props.onClickClosePopover}
      onConvertToCard={props.onConvertToCard}
      onChangeCardName={props.onChangeCardName}
    />
  )
}

export default ConvertChecklistItemToCard
