import { EncodedPaginationToken } from "../types";
import { PaginatorInterface } from "./PaginatorInterface";

export interface PaginationServiceInterface<TPaginationToken, TPaginatorOptions>
{
  getPaginator(paginationToken: EncodedPaginationToken, paginatorOptions: TPaginatorOptions): PaginatorInterface;

  parsePaginationToken(tokenString: EncodedPaginationToken): TPaginationToken

  encodeToken(token: TPaginationToken): EncodedPaginationToken | null
}
