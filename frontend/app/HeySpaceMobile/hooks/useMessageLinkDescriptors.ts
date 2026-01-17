import { Id } from "common/utils/identifier";
import getLinkDescriptors, { LinkDescriptor } from "common/utils/getLinkDescriptors";
import { useSelector } from "react-redux";
import { selectMessageText, selectMessageContainerId } from "common/models/domain/MessagesModel/selectors/domain";
import MarkdownRenderer from "common/models/domain/MessagesModel/MarkdownRenderer";
import getBoundMarkdownToReactRenderers from "../components/common/MarkdownOutput/markdownToReactRenderers";
import { ReactElement } from "../../common/node_modules/@types/react/index";

export default function useMessageLinkDescriptors(messageId: Id, text: string): LinkDescriptor[] {
  const messageText = useSelector(state => selectMessageText(state, { messageId }) || text || '')
  const containerObjectId = useSelector(state => selectMessageContainerId(state, { messageId }))
  const isMarkdown = typeof messageText === 'string'

  if (!isMarkdown) {
    return []
  }

  const markdownRenderer = new MarkdownRenderer({
    getBoundRenderers: getBoundMarkdownToReactRenderers({
      paragraphShouldHaveTopMargin: true,
      messageId,
      containerObjectId,
    }),
  })
  const markdownOutput = markdownRenderer.getRenderableOutput(text)

  let descriptors: LinkDescriptor[] = []
  markdownOutput
    .filter((element: ReactElement) => typeof element !== 'string')
    .forEach((element: ReactElement) => {
      descriptors = descriptors.concat(getLinkDescriptors(element)) 
    })

  return descriptors
}