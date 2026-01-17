import Component from './component'

import VirtualizeChatItems from 'common/enhancers/chat/VirtualizeChatItems'
import EnhanceWithChatItems from 'common/enhancers/chat/EnhanceWithChatItems'
import FetchChatItems from 'common/enhancers/chat/FetchChatItems'
import EnhanceWithNewMessagesSeparator from 'common/enhancers/chat/EnhanceWithNewMessagesSeparator'
import SaveScrollPosition from 'common/enhancers/chat/SaveScrollPosition'
import EnhanceWithOnMessageRead from 'common/enhancers/chat/EnhanceWithOnMessageRead'
import SetInitialScrollPosition from 'common/enhancers/chat/SetInitialScrollPosition'
import KeepCorrectScrollPosition from 'common/enhancers/chat/KeepCorrectScrollPosition'
import EnhanceWithScrollEvents from './enhancers/EnhanceWithScrollEvents'
import EnhanceWithScrollActions from './enhancers/EnhanceWithScrollActions'

export default EnhanceWithScrollActions(
  EnhanceWithChatItems(
    FetchChatItems(
      VirtualizeChatItems(
        EnhanceWithNewMessagesSeparator(
          EnhanceWithOnMessageRead(
            KeepCorrectScrollPosition(
              SetInitialScrollPosition(
                SaveScrollPosition(
                  EnhanceWithScrollEvents(
                    Component
                  )
                )
              )
            )
          )
        )
      )
    )
  )
)