import { AppDbRow, OAuthClientDbRow } from "../db/schema";
import { AppWithClientInterface } from "./types";

export function mergeAppWithOAuthClient(app: AppDbRow, oAuthClient: OAuthClientDbRow): AppWithClientInterface {
  return {
    id: app.id,
    oAuthClient,
  }
}
