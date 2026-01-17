import { Record } from "immutable"
import { UserProjectSettingsInterface } from "./types"

const defaultUserProjectSettings: UserProjectSettingsInterface = {
}

export class UserProjectSettings extends Record(defaultUserProjectSettings) implements UserProjectSettingsInterface {

  public constructor(values?: Partial<UserProjectSettingsInterface>) {
    values ? super(values) : super()
  }
}