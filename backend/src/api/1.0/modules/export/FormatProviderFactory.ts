import { injectable } from "inversify";
import { Constructor } from "./types";
import { FormatProviderFactoryInterface } from "./interfaces/FormatProviderFactoryInterface";

@injectable()
export class FormatProviderFactory implements FormatProviderFactoryInterface {

  public getFormatProvider<T>(Provider: Constructor<T>): T {
    return new Provider();
  }

}
