import { PaginationServiceInterface } from "./interfaces/PaginationServiceInterface";
import { PaginationServiceOptions, EncodedPaginationToken } from "./types";
import { PaginatorInterface } from "./interfaces/PaginatorInterface";
import { JsonSerializerInterface } from "../common/json/JsonSerializerInterface";
import { Maybe } from "../common/types";
import { Id } from "../common/identifier";
import { injectable } from "inversify";

@injectable()
export abstract class AbstractPaginationService<TPaginationToken, TPaginatorOptions>
  implements PaginationServiceInterface<TPaginationToken, TPaginatorOptions> {
  constructor(
    private jsonSerializer: JsonSerializerInterface,
    protected options: PaginationServiceOptions,
  ) {}

  public abstract getPaginator(paginationToken: EncodedPaginationToken, paginatorOptions: TPaginatorOptions): PaginatorInterface;

  public parsePaginationToken(token: EncodedPaginationToken): TPaginationToken {
    const decodedJson = Buffer.from(token, 'base64').toString('ascii')
    return this.jsonSerializer.fromJson(decodedJson)
  }

  public encodeToken(token: TPaginationToken): Maybe<EncodedPaginationToken> {
    const json = this.jsonSerializer.toJson(token)
    return Buffer.from(json).toString('base64')
  }

  protected createPaginationToken(id: Id, createdAt: number) {
    const json = this.jsonSerializer.toJson({ id, createdAt })
    return Buffer.from(json).toString('base64')
  }
}