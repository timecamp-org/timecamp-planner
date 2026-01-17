import Component from "./component";

import VirtualizeChatItems from "commonEnhancers/chat/VirtualizeChatItems";
import EnhanceWithChatItems from "commonEnhancers/chat/EnhanceWithChatItems";
import FetchChatItems from "commonEnhancers/chat/FetchChatItems";
import EnhanceWithNewMessagesSeparator from "commonEnhancers/chat/EnhanceWithNewMessagesSeparator";
import SaveScrollPosition from "commonEnhancers/chat/SaveScrollPosition";
import EnhanceWithOnMessageRead from "commonEnhancers/chat/EnhanceWithOnMessageRead";
import SetInitialScrollPosition from "commonEnhancers/chat/SetInitialScrollPosition";
import KeepCorrectScrollPosition from "commonEnhancers/chat/KeepCorrectScrollPosition";
import InjectDateSeparatorIfNone from "commonEnhancers/chat/InjectDateSeparatorIfNone";
import EnhanceWithChatItemHeight from "commonEnhancers/chat/EnhanceWithChatItemHeight";

import NormalizeScroll from "./enhancers/NormalizeScroll";
import EnhanceWithScrollEvents from "./enhancers/EnhanceWithScrollEvents";
import EnhanceWithScrollActions from "./enhancers/EnhanceWithScrollActions";

export default EnhanceWithScrollActions(
  EnhanceWithChatItemHeight(
    EnhanceWithChatItems(
      FetchChatItems(
        VirtualizeChatItems(
          EnhanceWithNewMessagesSeparator(
            EnhanceWithOnMessageRead(
              KeepCorrectScrollPosition(
                SetInitialScrollPosition(
                  SaveScrollPosition(
                    InjectDateSeparatorIfNone(
                      EnhanceWithScrollEvents(NormalizeScroll(Component))
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
);
