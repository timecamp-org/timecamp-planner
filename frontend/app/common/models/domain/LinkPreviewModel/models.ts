import { Record } from "immutable"
import { LinkMetadataInterface } from './types'

const defaultLinkMetadata: LinkMetadataInterface = {
  description: undefined,
  logo: undefined,
  image: undefined,
  publisher: undefined,
  title: undefined,
  video: undefined,  
}


export class LinkMetadata extends Record(defaultLinkMetadata) implements LinkMetadataInterface {
  public readonly description!: string
  public readonly logo!: string
  public readonly image!: string
  public readonly publisher!: string
  public readonly title!: string
  public readonly video!: string

  public constructor(values?: Partial<LinkMetadataInterface>) {
    values ? super(values) : super()
  }
}
