import { DecoratingQuillRenderer } from './DecoratingQuillRenderer'
import { MARKDOWN_DECORATORS } from './types'

/**
 * Renders Quill ops as markdown source.
 */
export class MarkdownQuillRenderer
  extends DecoratingQuillRenderer
{
  constructor() {
    super(MARKDOWN_DECORATORS)
  }
}