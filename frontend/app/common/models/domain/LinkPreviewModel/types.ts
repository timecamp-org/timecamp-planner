import { ImmutableMap } from "common/types";
import { Map } from "immutable";

export interface LinkMetadataInterface {
  logo: string,
  image: string,
  title: string,
  description: string,
  video: string,
  publisher: string, 
}
export type LinkPreviewData = Map<string, LinkMetadataInterface>

export interface LinkPreviewState extends ImmutableMap<string, any> {
  linkPreviewData: LinkPreviewData,
}