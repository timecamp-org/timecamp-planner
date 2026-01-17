import { Constructor } from "../types";

export interface FormatProviderFactoryInterface {
  getFormatProvider<T>(provider: Constructor<T>): T
}
