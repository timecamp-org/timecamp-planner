import { ChainableRendererInterface } from "../interfaces/ChainableRendererInterface";
import { NotificationContent } from "../types";
import { ChainElementParameterResolver, ChainElementFilter, ChainElementRenderer } from "./types";
import { ChainableContextInterface } from "../interfaces/ChainableContextInterface";

/**
 * Instance of renderer that allows defining notifications in declarative rather than imperative way.
 */
export class ChainableRenderer<T extends NotificationContent>
  implements ChainableRendererInterface<T>
{

  protected filter: ChainElementFilter;
  protected parameterResolver: ChainElementParameterResolver
  private renderer: ChainElementRenderer<T>;

  /**
   * Not a singleton, but allows a cleaner way of object instantiation without wraping (new ..) in parentheses.
   *
   * @param {ChainElementFilter} filter
   * @param {ChainElementParameterResolver} resolver
   * @param {ChainElementRenderer} renderer
   * @return {ChainableRenderer}
   * @constructor
   */
  public static create<T extends NotificationContent>(
    filter: ChainElementFilter,
    resolver: ChainElementParameterResolver,
    renderer: ChainElementRenderer<T>
  ): ChainableRenderer<T> {
    return new ChainableRenderer<T>(filter, resolver, renderer);
  }

  constructor(
    filter: ChainElementFilter,
    resolver: ChainElementParameterResolver,
    renderer: ChainElementRenderer<T>
  ) {
    this.filter = filter;
    this.parameterResolver = resolver;
    this.renderer = renderer;
  }

  /**
   * IF (filter criteria match)
   * THEN
   *    fetch all required data
   *    AND render the content.
   * Really simple, right?
   *
   * @param {ChainableContextInterface} context
   * @return {Promise<NotificationContent>}
   */
  async render(context: ChainableContextInterface): Promise<T> {
    if (this.filter(context) !== true) {
      return null;
    }
    const params = await Promise.all(this.parameterResolver(context));

    return await this.renderer(...params);
  }
}
